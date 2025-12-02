import { Flex } from '@vtex/brand-ui'
import { GetStaticPropsContext, NextPage } from 'next'

import usePagination from '../../utils/hooks/usePagination'
import { KnownIssueDataElement } from 'utils/typings/types'
import {
  KnownIssueStatus,
  SortByType,
  LocaleType,
} from 'utils/typings/unionTypes'
import Head from 'next/head'
import styles from 'styles/filterable-cards-page'
import { PreviewContext } from 'utils/contexts/preview'
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getDocsPaths as getKnownIssuesPaths } from 'utils/getDocsPaths'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/known-issues.png'
import KnownIssueCard from 'components/known-issue-card'
import Pagination from 'components/pagination'
import Filter from 'components/filter'
import {
  knownIssuesStatusFilter,
  knownIssuesModulesFilters,
  sortBy,
} from 'utils/constants'
import Select from 'components/select'
import { Input } from '@vtexdocs/components'
import { SearchIcon } from '@vtexdocs/components'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'

interface Props {
  knownIssuesData: KnownIssueDataElement[]
  branch: string
}

type Option = { id: string; name: string }
type FilterConfig = { name: string; options: Option[] }

const KnownIssuesPage: NextPage<Props> = ({ knownIssuesData, branch }) => {
  const intl = useIntl()

  const { setBranchPreview } = useContext(PreviewContext)

  useEffect(() => {
    setBranchPreview(branch)
  }, [])

  const itemsPerPage = 8
  const [pageIndex, setPageIndex] = useState({
    curr: 1,
    total: Math.ceil(knownIssuesData.length / itemsPerPage),
  })
  const [filters, setFilters] = useState<{
    kiStatus: string[]
    modules: string[]
  }>({ kiStatus: [], modules: [] })
  const [search, setSearch] = useState<string>('')
  const [sortByValue, setSortByValue] = useState<SortByType>('newest')
  const normalizedSearch = useMemo(() => search.toLowerCase(), [search])

  const statusConfig: FilterConfig = useMemo(
    () => knownIssuesStatusFilter(intl),
    [intl]
  )
  const moduleConfig: FilterConfig = useMemo(
    () => knownIssuesModulesFilters(intl),
    [intl]
  )

  const statusNameToId = useMemo(
    () => Object.fromEntries(statusConfig.options.map((o) => [o.name, o.id])),
    [statusConfig]
  )
  const moduleNameToId = useMemo(
    () => Object.fromEntries(moduleConfig.options.map((o) => [o.name, o.id])),
    [moduleConfig]
  )

  const filteredResult = useMemo(() => {
    const data = knownIssuesData.filter((knownIssue) => {
      const hasFilter: boolean =
        (filters.kiStatus.length === 0 ||
          filters.kiStatus.includes(knownIssue.kiStatus)) &&
        (filters.modules.length === 0 ||
          filters.modules.includes(knownIssue.module))

      const hasSearch: boolean = knownIssue.title
        .toLowerCase()
        .includes(normalizedSearch)
      return hasFilter && hasSearch
    })

    const sorted = data.sort((a, b) => {
      const dateA =
        sortByValue === 'newest' ? new Date(b.createdAt) : new Date(b.updatedAt)
      const dateB =
        sortByValue === 'newest' ? new Date(a.createdAt) : new Date(a.updatedAt)

      return dateA.getTime() - dateB.getTime()
    })
    return sorted
  }, [filters, sortByValue, normalizedSearch])

  useEffect(() => {
    setPageIndex({
      curr: 1,
      total: Math.ceil(filteredResult.length / itemsPerPage),
    })
  }, [filteredResult])

  const paginatedResult = usePagination<KnownIssueDataElement>(
    itemsPerPage,
    pageIndex,
    filteredResult
  )

  const handleClick = useCallback(({ selected }: { selected: number }) => {
    setPageIndex((prev) => ({ ...prev, curr: selected }))
  }, [])

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
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/images/known-issues.png" />
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
          priority
        />
        <Flex sx={styles.container}>
          <Flex sx={styles.optionsContainer}>
            <Filter
              tagFilter={statusConfig}
              checkBoxFilter={moduleConfig}
              selectedCheckboxes={filters.modules}
              selectedTags={filters.kiStatus}
              onApply={(newFilters) =>
                setFilters({
                  kiStatus: (newFilters.tag ?? []).map(
                    (n: string) => statusNameToId[n] ?? n
                  ),
                  modules: (newFilters.checklist ?? []).map(
                    (n: string) => moduleNameToId[n] ?? n
                  ),
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
            {paginatedResult.map((issue) => {
              return <KnownIssueCard key={issue.id} {...issue} />
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

export async function getStaticProps({
  locale,
  preview,
  previewData,
}: GetStaticPropsContext) {
  const sectionSelected = 'known-issues'

  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as { branch: string }).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const docsPathsGLOBAL = await getKnownIssuesPaths('known-issues')
  const logger = getLogger('Known Issues')
  const currentLocale: LocaleType = locale
    ? (locale as LocaleType)
    : ('en' as LocaleType)

  const slugs = Object.keys(docsPathsGLOBAL)
  const batchSize = 100
  const knownIssuesData: KnownIssueDataElement[] = []

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize)
    const batchResults = await fetchBatch(
      batch,
      'known-issues',
      docsPathsGLOBAL,
      currentLocale,
      branch,
      logger
    )

    const parsedBatch = await Promise.all(
      batchResults.map(async ({ content, slug }) => {
        if (!content) return null

        const frontmatter = await parseFrontmatter(content, logger)
        if (frontmatter) {
          return {
            id: String(frontmatter?.internalReference),
            title: String(frontmatter?.title),
            module: String(frontmatter?.tag),
            slug,
            createdAt: String(frontmatter?.createdAt),
            updatedAt: String(frontmatter?.updatedAt),
            status: String(frontmatter?.status),
            kiStatus: frontmatter?.kiStatus as KnownIssueStatus,
          }
        }

        return null
      })
    )

    const validBatch = parsedBatch.filter(
      (item): item is KnownIssueDataElement => item !== null
    )

    knownIssuesData.push(...validBatch)
  }

  return {
    props: {
      sectionSelected,
      knownIssuesData,
      branch,
    },
    revalidate: getISRRevalidateTime(),
  }
}

export default KnownIssuesPage
