import { Flex, Text } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'

import { AnnouncementDataElement } from 'utils/typings/types'
import { LocaleType } from 'utils/typings/unionTypes'
import Head from 'next/head'
import styles from 'styles/announcements-page'
import { PreviewContext } from 'utils/contexts/preview'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { getDocsPaths as getAnnouncementsPaths } from 'utils/getDocsPaths'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/announcements.png'
import Filter from 'components/filter'
import {
  announcementsTypeFilter,
  announcementsAreaFilter,
} from 'utils/constants'
import { SearchIcon } from '@vtexdocs/components'
import { Input } from '@vtexdocs/components'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'
import AnnouncementExpandableRow from 'components/announcement-expandable-row'
import { capitalizeMonthHeading } from 'utils/capitalizeMonthHeading'
import {
  getAnnouncementTypeKey,
  type AnnouncementTypeFilterKey,
} from 'utils/getAnnouncementTypeKey'

interface Props {
  announcementsData: AnnouncementDataElement[]
  branch: string
}

const AnnouncementsPage: NextPage<Props> = ({ announcementsData, branch }) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)

  useEffect(() => {
    setBranchPreview(branch)
  }, [branch, setBranchPreview])

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{
    type: string[]
    area: string[]
  }>({ type: [], area: [] })

  const typeConfig = useMemo(() => announcementsTypeFilter(intl), [intl])
  const areaConfig = useMemo(() => announcementsAreaFilter(intl), [intl])

  const filteredResult = useMemo(() => {
    const data = announcementsData.filter((announcement) => {
      const matchesSearch = announcement.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesType =
        filters.type.length === 0 ||
        filters.type.some((t) => announcement.tags.includes(t))

      const matchesArea =
        filters.area.length === 0 ||
        filters.area.some((a) => announcement.tags.includes(a))

      return matchesSearch && matchesType && matchesArea
    })

    data.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return data
  }, [searchTerm, filters, announcementsData, intl.locale])

  /** Lista completa após filtros — a timeline agrupa por mês; paginar antes cortava meses inteiros. */
  const timelineAnnouncements = useMemo(
    () =>
      filteredResult.map((announcement) => ({
        title: announcement.title,
        publishedAt: new Date(announcement.createdAt),
        articleLink: announcement.url,
        synopsis: announcement.synopsis,
        typeKey: getAnnouncementTypeKey(announcement.tags, intl),
      })),
    [filteredResult, intl]
  )

  const timelineByMonth = useMemo(() => {
    const groups: {
      monthKey: string
      label: string
      announcements: {
        title: string
        publishedAt: Date
        articleLink: string
        synopsis?: string
        typeKey?: AnnouncementTypeFilterKey
      }[]
    }[] = []

    for (const item of timelineAnnouncements) {
      const d = item.publishedAt
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}`
      let group = groups.find((g) => g.monthKey === monthKey)
      if (!group) {
        group = {
          monthKey,
          label: capitalizeMonthHeading(
            intl.formatDate(d, { month: 'long', year: 'numeric' }),
            intl.locale
          ),
          announcements: [],
        }
        groups.push(group)
      }
      group.announcements.push(item)
    }

    return groups
  }, [timelineAnnouncements, intl])

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
            <Filter
              tagFilter={typeConfig}
              checkBoxFilter={areaConfig}
              selectedTags={filters.type}
              selectedCheckboxes={filters.area}
              onApply={(newFilters) =>
                setFilters({
                  type: newFilters.tag ?? [],
                  area: newFilters.checklist ?? [],
                })
              }
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
            {filteredResult.length === 0 && (
              <Flex sx={styles.noResults}>
                {intl.formatMessage({ id: 'announcements_page_result.empty' })}
              </Flex>
            )}
            {filteredResult.length > 0 &&
              timelineByMonth.map((monthGroup) => (
                <Flex key={monthGroup.monthKey} sx={styles.monthBlock}>
                  <Text sx={styles.monthHeading}>{monthGroup.label}</Text>
                  {monthGroup.announcements.map((item, idx) => (
                    <AnnouncementExpandableRow
                      key={item.articleLink}
                      title={item.title}
                      articleLink={item.articleLink}
                      publishedAt={item.publishedAt}
                      synopsis={item.synopsis}
                      typeKey={item.typeKey}
                      isFirstInMonth={idx === 0}
                      isLastInMonth={
                        idx === monthGroup.announcements.length - 1
                      }
                    />
                  ))}
                </Flex>
              ))}
          </Flex>
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
  const currentLocale: LocaleType = (locale ?? 'en') as LocaleType
  const slugs = Object.keys(docsPathsGLOBAL)
  const batchSize = 100

  const announcementsData: AnnouncementDataElement[] = []

  function getAnnouncementSynopsis(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontmatter: any,
    locale: LocaleType
  ): string | undefined {
    switch (locale) {
      case 'en':
        return frontmatter?.announcementSynopsisEN
      case 'es':
        return frontmatter?.announcementSynopsisES
      case 'pt':
        return frontmatter?.announcementSynopsisPT
      default:
        return '-'
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
      // Only include published or changed announcements
      if (
        frontmatter &&
        (frontmatter.status === 'PUBLISHED' || frontmatter.status === 'CHANGED')
      ) {
        const tags: string[] =
          frontmatter.tags &&
          Array.isArray(frontmatter.tags) &&
          frontmatter.tags.length > 0
            ? frontmatter.tags.map(String)
            : []

        const base: AnnouncementDataElement = {
          title: String(frontmatter.title),
          url: `announcements/${slug}`,
          createdAt: String(frontmatter.createdAt),
          updatedAt: String(frontmatter.updatedAt),
          status: String(frontmatter.status),
          tags,
        }

        const synopsis = getAnnouncementSynopsis(frontmatter, currentLocale)
        if (synopsis !== undefined) {
          base.synopsis = synopsis
        }

        announcementsData.push(base)
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
