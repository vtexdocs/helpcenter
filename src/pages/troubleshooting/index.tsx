import PageHeader from 'components/page-header'
import styles from 'styles/filterable-cards-page'
import troubleshooting from '../../../public/images/troubleshooting.png'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import type { GetStaticPropsContext, NextPage } from 'next'
import { useContext, useMemo, useState } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import { getDocsPaths as getTroubleshootingPaths } from 'utils/getDocsPaths'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'
import { getLogger } from 'utils/logging/log-util'
import { localeType } from 'utils/navigation-utils'
import { serialize } from 'next-mdx-remote/serialize'
import { Flex } from '@vtex/brand-ui'
import Select from 'components/select'
import { SortByType, TroubleshootingDataElement } from 'utils/typings/types'
import usePagination from 'utils/hooks/usePagination'
import { sortBy } from 'utils/constants'
import TroubleshootingCard from 'components/troubleshooting-card'
import Pagination from 'components/pagination'
import { TroubleshootingFilters } from 'utils/constants'
import Filter from 'components/filter'
import searchIcon from '../../components/icons/search-icon'
import Input from 'components/input'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  branch: string
  troubleshootingData: TroubleshootingDataElement[]
  page: number
  totalPages: number
}

const TroubleshootingPage: NextPage<Props> = ({
  troubleshootingData,
  branch,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const intl = useIntl()

  const itemsPerPage = 5
  const [pageIndex, setPageIndex] = useState({ curr: 1, total: 1 })
  const [filters, setFilters] = useState<string[]>([])
  const [sortByValue, setSortByValue] = useState<SortByType>('newest')
  const [search, setSearch] = useState<string>('')

  const filteredResult = useMemo(() => {
    const data = troubleshootingData
      .filter((troubleshoot) => troubleshoot.status === 'PUBLISHED')
      .filter((troubleshoot) => {
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
              checkBoxFilter={TroubleshootingFilters(intl)}
              onApply={(newFilters) => setFilters(newFilters.checklist)}
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
  const sidebarFallback = await getNavigation()
  const sectionSelected = 'troubleshooting'
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch: string = preview ? previewBranch : 'main'
  const docsPathsGLOBAL = await getTroubleshootingPaths(
    'troubleshooting',
    branch
  )
  const logger = getLogger('troubleshooting')
  const currentLocale: localeType = (locale ?? 'en') as localeType

  const slugs = Object.keys(docsPathsGLOBAL)

  async function fetchFromGithub(path: string, slug: string) {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
      )
      const data = await response.text()
      return { content: data, slug }
    } catch (error) {
      logger.error(`Error fetching data for path ${path}` + ' ' + error)
      return { content: '', slug }
    }
  }

  const batchSize = 100

  const fetchBatch = async (batch: string[]) => {
    const promises = batch.map(async (slug) => {
      const path = docsPathsGLOBAL[slug]?.find(
        (e) => e.locale === currentLocale
      )?.path

      if (path) return await fetchFromGithub(path, slug)

      return { content: '', slug }
    })

    return Promise.all(promises)
  }

  const troubleshootingData: TroubleshootingDataElement[] = []
  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize)
    const batchResults = await fetchBatch(batch)

    for (const data of batchResults) {
      if (data?.content) {
        try {
          const onlyFrontmatter = `---\n${data.content.split('---')[1]}---\n`

          const { frontmatter } = await serialize(onlyFrontmatter, {
            parseFrontmatter: true,
          })

          if (frontmatter) {
            troubleshootingData.push({
              title: String(frontmatter.title ?? ''),
              slug: data.slug,
              createdAt: String(frontmatter.createdAt),
              updatedAt: String(frontmatter.updatedAt),
              tags: String(frontmatter.tags ?? '').split(','),
              status: frontmatter.status,
            })
          }
        } catch (error) {
          logger.error(`${error}`)
        }
      }
    }
  }

  return {
    props: {
      sidebarFallback,
      sectionSelected,
      troubleshootingData,
      branch,
    },
  }
}

export default TroubleshootingPage
