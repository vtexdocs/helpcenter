import PageHeader from 'components/page-header'
import styles from 'styles/filterable-cards-page'
import troubleshooting from '../../../public/images/troubleshooting.png'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import type { GetStaticPropsContext, NextPage } from 'next'
import { useContext, useMemo, useState } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import { getDocsPaths as getTroubleshootingPaths } from 'utils/getDocsPaths'
import { getLogger } from 'utils/logging/log-util'
import { localeType } from 'utils/navigation-utils'
import { Flex } from '@vtex/brand-ui'
import Select from 'components/select'
import { SortByType, TroubleshootingDataElement } from 'utils/typings/types'
import usePagination from 'utils/hooks/usePagination'
import { sortBy } from 'utils/constants'
import TroubleshootingCard from 'components/troubleshooting-card'
import Pagination from 'components/pagination'

import Filter from 'components/filter'
import searchIcon from '../../components/icons/search-icon'
import { Input } from '@vtexdocs/components'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch } from 'utils/fetchBatchGithubData'
import { parseFrontmatter } from 'utils/fetchBatchGithubData'

interface Props {
  branch: string
  troubleshootingData: TroubleshootingDataElement[]
  availableTags: string[]
}

const TroubleshootingPage: NextPage<Props> = ({
  troubleshootingData,
  branch,
  availableTags,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const intl = useIntl()

  const itemsPerPage = 8
  const [pageIndex, setPageIndex] = useState({
    curr: 1,
    total: Math.ceil(troubleshootingData.length / itemsPerPage),
  })
  const [filters, setFilters] = useState<string[]>([])
  const [sortByValue, setSortByValue] = useState<SortByType>('newest')
  const [search, setSearch] = useState<string>('')

  // Create dynamic filter function
  const createDynamicTroubleshootingFilter = (tags: string[]) => ({
    name: intl.formatMessage({ id: 'troubleshooting_filter_tags.title' }),
    options: tags.map((tag) => ({
      id: tag,
      name: tag,
    })),
  })

  const filteredResult = useMemo(() => {
    const data = troubleshootingData.filter((troubleshoot) => {
      const hasFilters: boolean =
        filters.length === 0 ||
        troubleshoot.tags.some((tag) => filters.includes(tag))
      const hasSearch: boolean = troubleshoot.title
        .toLowerCase()
        .includes(search.toLowerCase())
      return hasSearch && hasFilters
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

  const paginatedResult = usePagination<TroubleshootingDataElement>(
    itemsPerPage,
    pageIndex,
    filteredResult
  )

  function handleClick(props: { selected: number }) {
    if (props.selected !== undefined && props.selected !== pageIndex.curr)
      setPageIndex({ ...pageIndex, curr: props.selected })
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'troubleshooting_page.title' })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'troubleshooting_page.description',
          })}
          key="title"
        />
      </Head>
      <>
        <PageHeader
          title={intl.formatMessage({
            id: 'troubleshooting_page.title',
          })}
          description={intl.formatMessage({
            id: 'troubleshooting_page.description',
          })}
          imageUrl={troubleshooting}
          imageAlt={intl.formatMessage({ id: 'troubleshooting_page.title' })}
        />
        <Flex sx={styles.container}>
          <Flex sx={styles.optionsContainer}>
            <Filter
              checkBoxFilter={createDynamicTroubleshootingFilter(availableTags)}
              onApply={(newFilters) => setFilters(newFilters.checklist)}
              selectedCheckboxes={filters}
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
              id: 'troubleshooting_page_search.placeholder',
            })}
            Icon={searchIcon}
            value={search}
            onChange={(value: string) => setSearch(value)}
          />
          <Flex sx={styles.cardContainer}>
            {paginatedResult.length === 0 && (
              <Flex sx={styles.noResults}>
                {intl.formatMessage({ id: 'search_result.empty' })}
              </Flex>
            )}
            {paginatedResult.map((troubleshoot, id) => {
              return <TroubleshootingCard key={id} {...troubleshoot} />
            })}
          </Flex>
          <Pagination
            forcePage={pageIndex.curr}
            pageCount={pageIndex.total}
            onPageChange={handleClick}
          />
        </Flex>
      </>
    </>
  )
}

export async function getStaticProps({
  locale,
  preview,
  previewData,
}: GetStaticPropsContext) {
  const sectionSelected = 'troubleshooting'
  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as { branch: string }).branch
      : 'main'
  const branch: string = preview ? previewBranch : 'main'
  const docsPathsGLOBAL = await getTroubleshootingPaths(
    'troubleshooting',
    branch
  )
  const logger = getLogger('troubleshooting')
  const currentLocale: localeType = (locale ?? 'en') as localeType
  const slugs = Object.keys(docsPathsGLOBAL)
  const batchSize = 100

  const troubleshootingData: TroubleshootingDataElement[] = []
  const allTags = new Set<string>() // Track all unique tags

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize)
    const batchResults = await fetchBatch(
      batch,
      'help-center-content',
      docsPathsGLOBAL,
      currentLocale,
      branch,
      logger
    )

    for (const { content, slug } of batchResults) {
      if (!content) continue
      const frontmatter = await parseFrontmatter(content, logger)
      if (frontmatter) {
        const tags = String(frontmatter.tags ?? '')
          .split(',')
          .map((tag) => {
            const trimmed = tag.trim()
            // Only capitalize first letter if it's lowercase
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
          })
          .filter(Boolean)
        // Add tags to our set
        tags.forEach((tag) => allTags.add(tag))
        troubleshootingData.push({
          title: String(frontmatter.title),
          slug,
          createdAt: String(frontmatter.createdAt),
          updatedAt: String(frontmatter.updatedAt),
          tags,
          status: String(frontmatter.status),
        })
      }
    }
  }

  // Convert Set to sorted array
  const availableTags = Array.from(allTags).sort()

  return {
    props: {
      sectionSelected,
      troubleshootingData,
      availableTags,
      branch,
    },
    revalidate: getISRRevalidateTime(),
  }
}

export default TroubleshootingPage
