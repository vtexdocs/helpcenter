import { Flex } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'

import { AnnouncementDataElement, SortByType } from 'utils/typings/types'
import Head from 'next/head'
import styles from 'styles/announcements-page'
import { PreviewContext } from 'utils/contexts/preview'
import { Fragment, useContext, useMemo, useState } from 'react'
import { getDocsPaths as getAnnouncementsPaths } from 'utils/getDocsPaths'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/announcements.png'
import Pagination from 'components/pagination'
import { localeType } from 'utils/navigation-utils'
import Select from 'components/select'
import AnnouncementCard from 'components/announcement-card'
import { sortBy } from 'utils/constants'
import SearchIcon from 'components/icons/search-icon'
import Input from 'components/input'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'

interface Props {
  announcementsData: AnnouncementDataElement[]
  branch: string
}

const AnnouncementsPage: NextPage<Props> = ({ announcementsData, branch }) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const itemsPerPage = 8
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState({ curr: 1, total: 1 })
  const [sortByValue, setSortByValue] = useState<SortByType>('newest')

  const filteredResult = useMemo(() => {
    const data = announcementsData.filter((announcement) =>
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    data.sort((a, b) => {
      const dateA =
        sortByValue === 'newest' ? new Date(b.createdAt) : new Date(b.updatedAt)
      const dateB =
        sortByValue === 'newest' ? new Date(a.createdAt) : new Date(a.updatedAt)

      return dateA.getTime() - dateB.getTime()
    })

    setPage({ curr: 1, total: Math.ceil(data.length / itemsPerPage) })

    return data
  }, [searchTerm, sortByValue, intl.locale])

  const paginatedResult = useMemo(() => {
    return filteredResult.slice(
      (page.curr - 1) * itemsPerPage,
      page.curr * itemsPerPage
    )
  }, [page])

  function handleClick(props: { selected: number }) {
    if (props.selected !== undefined && props.selected !== page.curr)
      setPage({ ...page, curr: props.selected })
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'announcements_page.title',
          })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'announcements_page.description',
          })}
          key="title"
        />
      </Head>
      <Fragment>
        <PageHeader
          title={intl.formatMessage({
            id: 'announcements_page.title',
          })}
          description={intl.formatMessage({
            id: 'announcements_page.description',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'announcements_page.title',
          })}
        />
        <Flex sx={styles.container}>
          <Flex sx={styles.optionsContainer}>
            <Select
              label={intl.formatMessage({ id: 'sort.label' })}
              value={sortByValue}
              options={sortBy(intl)}
              onSelect={(ordering) => setSortByValue(ordering as SortByType)}
            />
          </Flex>
          <Input
            placeholder={intl.formatMessage({
              id: 'announcements_page_search.placeholder',
            })}
            Icon={SearchIcon}
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
          />
          <Flex sx={styles.cardContainer}>
            {paginatedResult.length === 0 && (
              <Flex sx={styles.noResults}>
                {intl.formatMessage({ id: 'announcements_page_result.empty' })}
              </Flex>
            )}
            {paginatedResult.map((announcement, id) => {
              return (
                <AnnouncementCard
                  key={id}
                  announcement={announcement}
                  appearance="large"
                />
              )
            })}
          </Flex>
          <Pagination
            forcePage={page.curr}
            pageCount={page.total}
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
  const sectionSelected = 'announcements'
  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as { branch: string }).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const docsPathsGLOBAL = await getAnnouncementsPaths('announcements', branch)

  const logger = getLogger('News')
  const currentLocale: localeType = (locale ?? 'en') as localeType
  const slugs = Object.keys(docsPathsGLOBAL)
  const batchSize = 100

  const announcementsData: AnnouncementDataElement[] = []

  function getAnnouncementSynopsis(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontmatter: any,
    locale: localeType
  ): string | undefined {
    switch (locale) {
      case 'en':
        return frontmatter?.announcementSynopsisEN
      case 'es':
        return frontmatter?.announcementSynopsisES
      case 'pt':
        return frontmatter?.announcementSynopsisPT
      default:
        return undefined
    }
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
      if (frontmatter && (frontmatter.status == 'PUBLISHED' || 'CHANGED')) {
        announcementsData.push({
          title: String(frontmatter.title),
          url: `announcements/${slug}`,
          createdAt: String(frontmatter.createdAt),
          updatedAt: String(frontmatter.updatedAt),
          status: String(frontmatter.status),
          synopsis: getAnnouncementSynopsis(frontmatter, currentLocale),
        })
      }
    }
  }

  return {
    props: {
      sectionSelected,
      announcementsData,
      branch,
    },
    revalidate: getISRRevalidateTime(),
  }
}

export default AnnouncementsPage
