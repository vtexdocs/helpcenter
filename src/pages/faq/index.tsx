import { Box, Flex } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'
import { FaqCardDataElement, SortByType } from 'utils/typings/types'
import Head from 'next/head'
import styles from 'styles/filterable-cards-page'
import { PreviewContext } from 'utils/contexts/preview'
import { Fragment, useContext, useMemo, useState } from 'react'
import { getDocsPaths as getFaqPaths } from 'utils/getDocsPaths'
import { serialize } from 'next-mdx-remote/serialize'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/faq.png'
import Pagination from 'components/pagination'
import { localeType } from 'utils/navigation-utils'
import Select from 'components/select'
import { faqFilter, sortBy } from 'utils/constants'
import FaqCard from 'components/faq-card'
import Filter from 'components/filter'
import usePagination from '../../utils/hooks/usePagination'
import Input from 'components/input'
import SearchIcon from 'components/icons/search-icon'
import ChipFilter from 'components/chip-filter'
import { fetchContentBatch, FetchResult } from 'utils/githubBatchFetch'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  faqData: FaqCardDataElement[]
  branch: string
  page: number
  totalPages: number
}

const FaqPage: NextPage<Props> = ({ faqData, branch }) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)

  const itemsPerPage = 8
  const [pageIndex, setPageIndex] = useState({ curr: 1, total: 1 })
  const [filters, setFilters] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')
  const [sortByValue, setSortByValue] = useState<SortByType>('newest')

  const chipCategories: string[] = faqFilter(intl).options.map(
    (option) => option.name
  )

  const filteredResult = useMemo(() => {
    const data = faqData
      .filter((question) => question.status === 'PUBLISHED')
      .filter((question) => {
        const hasFilter: boolean =
          filters.length === 0 || filters.includes(question.productTeam)
        const hasSearch: boolean = question.title
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

  const paginatedResult = usePagination<FaqCardDataElement>(
    itemsPerPage,
    pageIndex,
    filteredResult
  )

  function handleClick(props: { selected: number }) {
    if (props.selected !== undefined && props.selected !== pageIndex.curr)
      setPageIndex({ ...pageIndex, curr: props.selected })
  }

  function handleFilterApply(filters: string[]) {
    setFilters(filters)
  }

  function handleCategoriesSelection(category: string) {
    setFilters([...filters, category])
  }

  function handleFilterReset() {
    setFilters([])
  }

  function handleFilterRemoval(category: string) {
    const copyFilters = [...filters]
    copyFilters.splice(copyFilters.indexOf(category), 1)
    setFilters(copyFilters)
  }

  function getCategoryAmount(category: string): number {
    return faqData.filter((data) => {
      return data.productTeam === category
    }).length
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'landing_page_faq.description',
          })}
          key="title"
        />
      </Head>
      <Fragment>
        <PageHeader
          title={intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
          description={intl.formatMessage({
            id: 'landing_page_faq.description',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
        />
        <Flex sx={styles.container}>
          <Flex sx={styles.optionsContainer}>
            <Filter
              selectedCheckboxes={filters}
              checkBoxFilter={faqFilter(intl)}
              onApply={(newFilters) => handleFilterApply(newFilters.checklist)}
            />
            <Select
              label={intl.formatMessage({ id: 'sort.label' })}
              value={sortByValue}
              options={sortBy(intl)}
              onSelect={(ordering) => setSortByValue(ordering as SortByType)}
            />
          </Flex>
          <Input
            Icon={SearchIcon}
            placeholder={intl.formatMessage({
              id: 'faq_page_search.placeholder',
            })}
            value={search}
            onChange={(value: string) => setSearch(value)}
          />
          <ChipFilter
            removeCategory={handleFilterRemoval}
            resetFilters={handleFilterReset}
            filters={filters}
            getCategoryAmount={getCategoryAmount}
            categories={chipCategories}
            applyCategory={handleCategoriesSelection}
          />
          <Flex sx={styles.cardContainer}>
            {!!filteredResult.length && (
              <Box sx={styles.resultsNumberContainer}>
                {filteredResult.length}{' '}
                {intl.formatMessage({ id: 'faq_page.results_found' })}
              </Box>
            )}
            {paginatedResult.length === 0 && (
              <Flex sx={styles.noResults}>
                {intl.formatMessage({ id: 'search_result.empty' })}
              </Flex>
            )}
            {paginatedResult.map((question, id) => {
              return <FaqCard key={id} {...question} />
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
  const sidebarfallback = await getNavigation()
  const sectionSelected = 'FAQs'
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const docsPathsGLOBAL = (await getFaqPaths('faq', branch)) as Record<
    string,
    { locale: localeType; path: string }[]
  >
  const logger = getLogger('FAQ')
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)

  const slugs = Object.keys(docsPathsGLOBAL)

  // Process each content item from the batch
  async function processFaqContent(
    result: FetchResult
  ): Promise<FaqCardDataElement | null> {
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

      return {
        title: frontmatter.title,
        slug: result.slug,
        createdAt: String(frontmatter.createdAt),
        updatedAt: String(frontmatter.updatedAt),
        productTeam: frontmatter.productTeam,
        status: frontmatter.status,
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

  // Use the new batch fetching utility
  const faqData = await fetchContentBatch(
    docsPathsGLOBAL,
    slugs,
    currentLocale,
    branch,
    50, // Smaller batch size to avoid overwhelming GitHub
    processFaqContent
  )

  logger.info(`Successfully processed ${faqData.length} FAQ items`)

  return {
    props: {
      sidebarfallback,
      sectionSelected,
      faqData,
      branch,
    },
  }
}

export default FaqPage
