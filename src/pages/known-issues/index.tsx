import { Flex } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'
import usePagination from '../../utils/hooks/usePagination'
import {
  KnownIssueDataElement,
  KnownIssueStatus,
  SortByType,
} from 'utils/typings/types'
import Head from 'next/head'
import styles from 'styles/filterable-cards-page'
import { PreviewContext } from 'utils/contexts/preview'
import { Fragment, useContext, useMemo, useState } from 'react'
import { getDocsPaths as getKnownIssuesPaths } from 'utils/getDocsPaths'
import { serialize } from 'next-mdx-remote/serialize'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/start-here.png'
import KnownIssueCard from 'components/known-issue-card'
import Pagination from 'components/pagination'
import { localeType } from 'utils/navigation-utils'
import Filter from 'components/filter'
import {
  knownIssuesStatusFilter,
  knownIssuesModulesFilters,
  sortBy,
} from 'utils/constants'
import Select from 'components/select'
import Input from 'components/input'
import SearchIcon from 'components/icons/search-icon'
import { fetchContentBatch, FetchResult } from 'utils/githubBatchFetch'
import { retryWithRateLimit } from 'utils/retry-util'
import DebugPanel from '../../components/debug-panel'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  knownIssuesData: KnownIssueDataElement[]
  branch: string
  page: number
  totalPages: number
  fallbackMode?: boolean
  error?: string
  debugInfo?: {
    errorMessage: string
    stack: string
  }
}

const KnownIssuesPage: NextPage<Props> = ({
  knownIssuesData,
  branch,
  fallbackMode,
  error,
  debugInfo,
}) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)

  const itemsPerPage = 8
  const [pageIndex, setPageIndex] = useState({ curr: 1, total: 1 })
  const [filters, setFilters] = useState<{
    kiStatus: string[]
    modules: string[]
  }>({ kiStatus: [], modules: [] })
  const [search, setSearch] = useState<string>('')
  const [sortByValue, setSortByValue] = useState<SortByType>('newest')

  const filteredResult = useMemo(() => {
    const data = knownIssuesData
      .filter((knownIssue) => knownIssue.status === 'PUBLISHED')
      .filter((knownIssue) => {
        const hasFilter: boolean =
          (filters.kiStatus.length === 0 ||
            filters.kiStatus.includes(knownIssue.kiStatus)) &&
          (filters.modules.length === 0 ||
            filters.modules.includes(knownIssue.module))
        const hasSearch: boolean = knownIssue.title
          .toLowerCase()
          .includes(search.toLowerCase())
        return hasFilter && hasSearch
      })

    data.sort((a, b) => {
      const dateA =
        sortByValue === 'newest' ? new Date(b.createdAt) : new Date(b.updatedAt)
      const dateB =
        sortByValue === 'newest' ? new Date(a.createdAt) : new Date(a.updatedAt)
      return dateA.getTime() - dateB.getTime()
    })

    setPageIndex({ curr: 1, total: Math.ceil(data.length / itemsPerPage) })
    return data
  }, [filters, sortByValue, intl.locale, search])

  const paginatedResult = usePagination<KnownIssueDataElement>(
    itemsPerPage,
    pageIndex,
    filteredResult
  )

  function handleClick(props: { selected: number }) {
    if (props.selected !== undefined && props.selected !== pageIndex.curr)
      setPageIndex({ ...pageIndex, curr: props.selected })
  }

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'known_issues_page.title',
          })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'known_issues_page.subtitle',
          })}
          key="title"
        />
      </Head>
      <Fragment>
        <PageHeader
          title={intl.formatMessage({
            id: 'known_issues_page.title',
          })}
          description={intl.formatMessage({
            id: 'known_issues_page.subtitle',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'known_issues_page.title',
          })}
        />
        <Flex sx={styles.container}>
          {isDev && fallbackMode && (
            <div
              style={{
                background: '#ffeeee',
                padding: '15px',
                border: '1px solid #ff0000',
                margin: '15px 0',
              }}
            >
              <h2>Debug Information</h2>
              <p>
                <strong>Error:</strong> {error}
              </p>
              {debugInfo && (
                <>
                  <p>
                    <strong>Error Message:</strong> {debugInfo.errorMessage}
                  </p>
                  <pre>{debugInfo.stack}</pre>
                </>
              )}
            </div>
          )}
          {fallbackMode && (
            <DebugPanel
              title="Known Issues Data Fetching Error"
              error={error}
              errorInfo={debugInfo}
              data={{ knownIssuesCount: knownIssuesData?.length || 0 }}
            />
          )}
          {knownIssuesData.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3>No known issues found</h3>
              <p>
                This could be due to a data fetching issue. Please try
                refreshing the page.
              </p>
            </div>
          )}
          <Flex sx={styles.optionsContainer}>
            <Filter
              tagFilter={knownIssuesStatusFilter(intl)}
              checkBoxFilter={knownIssuesModulesFilters(intl)}
              selectedCheckboxes={filters.modules}
              selectedTags={filters.kiStatus}
              onApply={(newFilters) =>
                setFilters({
                  kiStatus: newFilters.tag,
                  modules: newFilters.checklist,
                })
              }
            />
            <Select
              label={intl.formatMessage({ id: 'sort.label' })}
              value={sortByValue}
              options={sortBy(intl)}
              onSelect={(ordering) => setSortByValue(ordering as SortByType)}
            />
          </Flex>
          <Input
            placeholder={intl.formatMessage({
              id: 'known_issues_page_search.placeholder',
            })}
            value={search}
            Icon={SearchIcon}
            onChange={(value) => setSearch(value)}
          />
          <Flex sx={styles.cardContainer}>
            {paginatedResult.length === 0 && (
              <Flex sx={styles.noResults}>
                {intl.formatMessage({ id: 'search_result.empty' })}
              </Flex>
            )}
            {paginatedResult.map((issue, id) => {
              return <KnownIssueCard key={id} {...issue} />
            })}
          </Flex>
          <Pagination
            forcePage={pageIndex.curr}
            pageCount={pageIndex.total}
            onPageChange={handleClick}
          />
        </Flex>
      </Fragment>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  preview,
  previewData,
}) => {
  const currentLocale = locale as localeType
  console.log('Starting getStaticProps for known-issues index')

  try {
    const sidebarfallback = await getNavigation()
    const sectionSelected = 'Known Issues'
    const previewBranch =
      preview &&
      JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
        ? JSON.parse(JSON.stringify(previewData)).branch
        : 'main'
    const branch = preview ? previewBranch : 'main'
    const logger = getLogger('Known Issues')
    // Add debug logging
    logger.info('Starting to fetch known issues paths')
    // Attempt to get doc paths with proper typing for fetchContentBatch
    const docsPathsGLOBAL: Record<
      string,
      { locale: localeType; path: string }[]
    > = {}
    try {
      // Use retryWithRateLimit for GitHub API calls with type casting
      logger.info('Calling getKnownIssuesPaths with retryWithRateLimit')
      const paths = await retryWithRateLimit(
        () => getKnownIssuesPaths('known-issues', branch),
        {
          maxRetries: 5,
          timeout: 30000, // 30 seconds
          operationName: 'fetch-known-issues-paths',
          handleRateLimit: true,
        }
      )
      logger.info(`Got paths response: ${JSON.stringify(paths)}`)
      // Convert the returned paths to the expected type for fetchContentBatch
      Object.keys(paths).forEach((slug) => {
        docsPathsGLOBAL[slug] = paths[slug].map((item) => ({
          locale: item.locale as localeType,
          path: item.path,
        }))
      })
      if (Object.keys(docsPathsGLOBAL).length === 0) {
        logger.warn(
          'No known issues found or empty response from GitHub. Using empty docsPaths.'
        )
        // Continue with empty docsPaths rather than throwing an error
      }
    } catch (pathError) {
      logger.error(
        `Failed to fetch known-issues paths: ${
          pathError instanceof Error ? pathError.message : String(pathError)
        }`
      )
      logger.error(`Error details: ${JSON.stringify(pathError)}`)
      // Continue with empty docsPaths rather than rethrowing
    }

    const slugs = Object.keys(docsPathsGLOBAL)
    logger.info(`Processing ${slugs.length} known issues slugs`)

    if (slugs.length === 0) {
      // Return empty data instead of failing
      return {
        props: {
          sidebarfallback,
          sectionSelected,
          knownIssuesData: [],
          branch,
        },
        revalidate: 60, // Shorter revalidation when we couldn't fetch data
      }
    }

    // Process each content item from the batch
    async function processKnownIssueContent(
      result: FetchResult
    ): Promise<KnownIssueDataElement | null> {
      if (!result.content) return null

      try {
        // Extract only the frontmatter to minimize parsing
        const onlyFrontmatter = `---\n${result.content.split('---')[1]}---\n`
        const { frontmatter } = await serialize(onlyFrontmatter, {
          parseFrontmatter: true,
        })

        if (!frontmatter) {
          logger.warn(`No frontmatter found for ${result.slug}`)
          return null
        }

        // Validate required frontmatter properties
        if (!frontmatter.tag || !frontmatter.kiStatus) {
          logger.warn(
            `Missing required frontmatter properties for ${result.slug}: tag or kiStatus missing`
          )
          return null
        }

        return {
          id: frontmatter.internalReference,
          title: frontmatter.title || result.slug,
          module: frontmatter.tag,
          slug: result.slug,
          kiStatus: frontmatter.kiStatus.replace(' ', '_') as KnownIssueStatus,
          createdAt: String(frontmatter.createdAt || new Date()),
          updatedAt: String(frontmatter.updatedAt || new Date()),
          status: frontmatter.status || 'DRAFT',
        }
      } catch (error) {
        logger.error(
          `Error processing frontmatter for ${result.slug}: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
        return null
      }
    }

    // Use the batch fetching utility with error handling
    let knownIssuesData: KnownIssueDataElement[] = []
    try {
      knownIssuesData = await fetchContentBatch(
        docsPathsGLOBAL,
        slugs,
        currentLocale,
        branch,
        30, // Smaller batch size to reduce GitHub API pressure
        processKnownIssueContent
      )
      logger.info(
        `Successfully processed ${knownIssuesData.length} known issues`
      )
    } catch (batchError) {
      logger.error(
        `Error in batch fetching: ${
          batchError instanceof Error ? batchError.message : String(batchError)
        }`
      )
      // Continue with empty data rather than failing completely
    }

    return {
      props: {
        sidebarfallback,
        sectionSelected,
        knownIssuesData: knownIssuesData || [],
        branch,
      },
      revalidate: 600, // 10 minutes
    }
  } catch (error) {
    console.error('Error fetching known issues:', error)
    // Return a fallback state with minimal data
    const errorObject =
      error instanceof Error ? error : new Error(String(error))
    return {
      props: {
        sidebarfallback: {},
        sectionSelected: 'Known Issues',
        knownIssuesData: [],
        branch: 'main',
        fallbackMode: true,
        error: 'Unable to fetch known issues. Please try again later.',
        debugInfo:
          process.env.NODE_ENV === 'development'
            ? {
                errorMessage: errorObject.message || 'Unknown error',
                stack: errorObject.stack || 'No stack trace available',
              }
            : undefined,
      },
      revalidate: 60, // Short revalidation time when in error state
    }
  }
}

export default KnownIssuesPage
