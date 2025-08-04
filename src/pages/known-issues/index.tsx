import { Flex } from '@vtex/brand-ui'
import { GetStaticPropsContext, NextPage } from 'next'

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
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'

interface Props {
  knownIssuesData: KnownIssueDataElement[]
  branch: string
}

const KnownIssuesPage: NextPage<Props> = ({ knownIssuesData, branch }) => {
  const intl = useIntl()

  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
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
  const filteredResult = useMemo(() => {
    const data = knownIssuesData.filter((knownIssue) => {
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
        <link rel="preload" as="image" href="/images/start-here.png" />
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
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)

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

    for (const { content, slug } of batchResults) {
      if (!content) continue
      const frontmatter = await parseFrontmatter(content, logger)

      if (
        frontmatter &&
        frontmatter.tag &&
        frontmatter.kiStatus &&
        frontmatter.id &&
        frontmatter.title &&
        frontmatter.createdAt &&
        frontmatter.updatedAt &&
        (frontmatter.status == 'PUBLISHED' || 'CHANGED')
      ) {
        knownIssuesData.push({
          id: String(frontmatter.id),
          title: String(frontmatter.title),
          module: String(frontmatter.tag),
          slug,
          createdAt: String(frontmatter.createdAt),
          updatedAt: String(frontmatter.updatedAt),
          status: String(frontmatter.status),
          kiStatus: frontmatter.kiStatus as KnownIssueStatus,
        })
      }
    }
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
