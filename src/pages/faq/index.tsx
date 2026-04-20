import { Box, Flex } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'

import { FaqCardDataElement } from 'utils/typings/types'
import { SortByType, LocaleType } from 'utils/typings/unionTypes'
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
import { getDocsPaths as getFaqPaths } from 'utils/getDocsPaths'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import faqImage from '../../../public/images/faq.png'
import Pagination from 'components/pagination'
import Select from 'components/select'
import { faqFilter, sortBy } from 'utils/constants'
import FaqCard from 'components/faq-card'
import Filter from 'components/filter'
import usePagination from '../../utils/hooks/usePagination'
import { Input } from '@vtexdocs/components'
import { SearchIcon } from '@vtexdocs/components'
import ChipFilter from 'components/chip-filter'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'
import Tooltip from 'components/tooltip'
import {
  countTermMatches,
  getSearchTerms,
  itemMatchesAnyTerm,
} from 'utils/search/tokenizedSearch'

interface Props {
  faqData: FaqCardDataElement[]
  branch: string
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
  const searchTerms = useMemo(
    () => getSearchTerms(search, intl.locale),
    [search, intl.locale]
  )

  const chipCategories: string[] = faqFilter(intl).options.map(
    (option) => option.name
  )

  const filteredResult = useMemo(() => {
    const data = faqData.filter((question) => {
      const hasFilter: boolean =
        filters.length === 0 || filters.includes(question.productTeam)
      const fields = [question.title, question.slug, question.productTeam].map(
        (s) => String(s ?? '').toLowerCase()
      )
      const hasSearch = itemMatchesAnyTerm(searchTerms, fields)

      return hasFilter && hasSearch
    })

    const sorted = data.sort((a, b) => {
      const fieldsA = [a.title, a.slug, a.productTeam].map((s) =>
        String(s ?? '').toLowerCase()
      )
      const fieldsB = [b.title, b.slug, b.productTeam].map((s) =>
        String(s ?? '').toLowerCase()
      )
      const matchCountA = countTermMatches(searchTerms, fieldsA)
      const matchCountB = countTermMatches(searchTerms, fieldsB)

      if (matchCountA !== matchCountB) {
        return matchCountB - matchCountA
      }

      const dateA =
        sortByValue === 'newest' ? new Date(b.createdAt) : new Date(b.updatedAt)
      const dateB =
        sortByValue === 'newest' ? new Date(a.createdAt) : new Date(a.updatedAt)

      return dateA.getTime() - dateB.getTime()
    })

    return sorted
  }, [filters, sortByValue, searchTerms, faqData])

  useEffect(() => {
    setPageIndex({
      curr: 1,
      total: Math.ceil(filteredResult.length / itemsPerPage),
    })
  }, [filteredResult])

  const paginatedResult = usePagination<FaqCardDataElement>(
    itemsPerPage,
    pageIndex,
    filteredResult
  )

  const handleClick = useCallback(({ selected }: { selected: number }) => {
    setPageIndex((prev) => ({ ...prev, curr: selected }))
  }, [])

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
      const matchesCategory = data.productTeam === category
      const fields = [data.title, data.slug, data.productTeam].map((s) =>
        String(s ?? '').toLowerCase()
      )
      const matchesSearch = itemMatchesAnyTerm(searchTerms, fields)
      return matchesCategory && matchesSearch
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
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/images/faq.png" />
      </Head>
      <Fragment>
        <PageHeader
          title={intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
          description={intl.formatMessage({
            id: 'landing_page_faq.description',
          })}
          imageUrl={faqImage}
          imageAlt={intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
          priority
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
          <Flex sx={{ width: '100%', alignItems: 'center', gap: '8px' }}>
            <Box sx={{ width: '100%' }}>
              <Input
                Icon={SearchIcon}
                placeholder={intl.formatMessage({
                  id: 'faq_page_search.placeholder',
                })}
                value={search}
                onChange={(value: string) => setSearch(value)}
              />
            </Box>
            <Tooltip
              placement="top"
              label={intl.formatMessage({
                id: 'known_issues_page_search.priority_tooltip',
                defaultMessage:
                  'Resultados priorizam titulos com maior quantidade de termos correspondentes; em empate, aplica-se a ordenacao selecionada.',
              })}
            >
              <Box
                as="button"
                type="button"
                aria-label={intl.formatMessage({
                  id: 'known_issues_page_search.priority_tooltip',
                })}
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1px solid',
                  borderColor: 'muted.2',
                  backgroundColor: 'transparent',
                  color: 'muted.0',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'help',
                  flexShrink: 0,
                  p: 0,
                }}
              >
                ?
              </Box>
            </Tooltip>
          </Flex>
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
            {paginatedResult.map((question) => {
              return <FaqCard key={question.slug} {...question} />
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
  const sectionSelected = 'faq'
  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as { branch: string }).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const docsPathsGLOBAL = await getFaqPaths('faq', branch)
  const logger = getLogger('FAQs')
  const currentLocale: LocaleType = (locale ?? 'en') as LocaleType
  const slugs = Object.keys(docsPathsGLOBAL)
  const batchSize = 100

  const faqData: FaqCardDataElement[] = []

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

    const parsedBatch = await Promise.all(
      batchResults.map(async ({ content, slug }) => {
        if (!content) return null

        const frontmatter = await parseFrontmatter(content, logger)

        if (frontmatter) {
          return {
            title: String(frontmatter.title),
            slug,
            createdAt: String(frontmatter.createdAt),
            updatedAt: String(frontmatter.updatedAt),
            status: String(frontmatter.status),
            productTeam: String(frontmatter.productTeam || ''),
          }
        }

        return null
      })
    )

    const validFaqs = parsedBatch.filter(
      (item): item is FaqCardDataElement => item !== null
    )

    faqData.push(...validFaqs)
  }

  return {
    props: {
      sectionSelected,
      faqData,
      branch,
    },
    revalidate: getISRRevalidateTime(),
  }
}

export default FaqPage
