import PageHeader from 'components/page-header'
import styles from 'styles/filterable-cards-page'
import troubleshooting from '../../../public/images/troubleshooting.png'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import type { GetStaticPropsContext, NextPage } from 'next'
import { useContext, useEffect, useMemo, useState } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import { getDocsPaths as getTroubleshootingPaths } from 'utils/getDocsPaths'
import { getLogger } from 'utils/logging/log-util'
import { LocaleType } from 'utils/typings/unionTypes'
import { Box, Flex } from '@vtex/brand-ui'
import { TroubleshootingDataElement } from 'utils/typings/types'
import usePagination from 'utils/hooks/usePagination'
import TroubleshootingCard from 'components/troubleshooting-card'
import Pagination from 'components/pagination'

import Filter from 'components/filter'
import { SearchIcon } from '@vtexdocs/components'
import { Input } from '@vtexdocs/components'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch } from 'utils/fetchBatchGithubData'
import { parseFrontmatter } from 'utils/fetchBatchGithubData'
import Tooltip from 'components/tooltip'
import {
  countTermMatches,
  getSearchTerms,
  itemMatchesAnyTerm,
} from 'utils/search/tokenizedSearch'

interface Props {
  branch: string
  troubleshootingData: TroubleshootingDataElement[]
  availableDomainFilters: string[]
  availableSymptomFilters: string[]
}

const TroubleshootingPage: NextPage<Props> = ({
  troubleshootingData,
  branch,
  availableDomainFilters,
  availableSymptomFilters,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)
  const intl = useIntl()

  setBranchPreview(branch)

  const itemsPerPage = 8
  const [pageIndex, setPageIndex] = useState({
    curr: 1,
    total: Math.ceil(troubleshootingData.length / itemsPerPage),
  })
  const [filters, setFilters] = useState<{
    domains: string[]
    symptoms: string[]
  }>({ domains: [], symptoms: [] })
  const [search, setSearch] = useState<string>('')
  const searchTerms = useMemo(
    () => getSearchTerms(search, intl.locale),
    [search, intl.locale]
  )

  const createDynamicTroubleshootingFilter = (
    nameId: string,
    options: string[]
  ) => ({
    name: intl.formatMessage({ id: nameId }),
    options: options.map((option) => ({
      id: option,
      name: option,
    })),
  })

  const filteredResult = useMemo(() => {
    const data = troubleshootingData.filter((troubleshoot) => {
      const hasFilters: boolean =
        (filters.domains.length === 0 ||
          (troubleshoot.domainFilters ?? []).some((tag) =>
            filters.domains.includes(tag)
          )) &&
        (filters.symptoms.length === 0 ||
          (troubleshoot.symptomFilters ?? []).some((tag) =>
            filters.symptoms.includes(tag)
          ))
      const fields = [troubleshoot.title, troubleshoot.slug].map((s) =>
        String(s ?? '').toLowerCase()
      )
      const hasSearch = itemMatchesAnyTerm(searchTerms, fields)
      return hasSearch && hasFilters
    })

    return data.sort((a, b) => {
      const fieldsA = [a.title, a.slug].map((s) =>
        String(s ?? '').toLowerCase()
      )
      const fieldsB = [b.title, b.slug].map((s) =>
        String(s ?? '').toLowerCase()
      )
      const matchA = countTermMatches(searchTerms, fieldsA)
      const matchB = countTermMatches(searchTerms, fieldsB)
      if (matchA !== matchB) {
        return matchB - matchA
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [filters, searchTerms, troubleshootingData])

  useEffect(() => {
    setPageIndex({
      curr: 1,
      total: Math.ceil(filteredResult.length / itemsPerPage),
    })
  }, [filteredResult])

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
              tagFilter={createDynamicTroubleshootingFilter(
                'troubleshooting_filter_symptoms.title',
                availableSymptomFilters
              )}
              checkBoxFilter={createDynamicTroubleshootingFilter(
                'troubleshooting_filter_domains.title',
                availableDomainFilters
              )}
              onApply={(newFilters) =>
                setFilters({
                  domains: newFilters.checklist,
                  symptoms: newFilters.tag,
                })
              }
              selectedCheckboxes={filters.domains}
              selectedTags={filters.symptoms}
            />
          </Flex>
          <Flex sx={{ width: '100%', alignItems: 'center', gap: '8px' }}>
            <Box sx={{ width: '100%' }}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'troubleshooting_page_search.placeholder',
                })}
                Icon={SearchIcon}
                value={search}
                onChange={(value: string) => setSearch(value)}
              />
            </Box>
            <Tooltip
              placement="top"
              label={intl.formatMessage({
                id: 'known_issues_page_search.priority_tooltip',
                defaultMessage:
                  'Resultados priorizam titulos com maior quantidade de termos correspondentes; em empate, aplica-se a ordenacao por data de atualizacao.',
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
  const currentLocale: LocaleType = (locale ?? 'en') as LocaleType
  const slugs = Object.keys(docsPathsGLOBAL)
  const batchSize = 100

  const troubleshootingData: TroubleshootingDataElement[] = []
  const allDomainFilters = new Set<string>()
  const allSymptomFilters = new Set<string>()

  function normalizeFrontmatterList(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean)
    }

    return String(value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  function formatTagLabel(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

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
        const rawDomainFilters = normalizeFrontmatterList(
          frontmatter.domainFilters
        )
        const rawSymptomFilters = normalizeFrontmatterList(
          frontmatter.symptomFilters
        )
        const domainFilters = rawDomainFilters.map(formatTagLabel)
        const symptomFilters = rawSymptomFilters.map(formatTagLabel)

        domainFilters.forEach((tag) => allDomainFilters.add(tag))
        symptomFilters.forEach((tag) => allSymptomFilters.add(tag))

        troubleshootingData.push({
          title: String(frontmatter.title),
          slug,
          createdAt: String(frontmatter.createdAt),
          updatedAt: String(frontmatter.updatedAt),
          domainFilters,
          symptomFilters,
          status: String(frontmatter.status),
        })
      }
    }
  }

  const availableDomainFilters = Array.from(allDomainFilters).sort()
  const availableSymptomFilters = Array.from(allSymptomFilters).sort()

  return {
    props: {
      sectionSelected,
      troubleshootingData,
      availableDomainFilters,
      availableSymptomFilters,
      branch,
    },
    revalidate: getISRRevalidateTime(),
  }
}

export default TroubleshootingPage
