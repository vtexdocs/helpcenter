import { Box, Flex, Text } from '@vtex/brand-ui'
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
import {
  announcementsTypeFilter,
  announcementsAreaFilter,
} from 'utils/constants'
import {
  ChipFilter,
  Input,
  ListingFilter,
  SearchIcon,
  Tooltip,
} from '@vtexdocs/components'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'
import AnnouncementExpandableRow from 'components/announcement-expandable-row'
import {
  countTermMatches,
  getSearchTerms,
  itemMatchesAnyTerm,
} from 'utils/search/tokenizedSearch'

interface Props {
  announcementsData: AnnouncementDataElement[]
  branch: string
}

const ANNOUNCEMENTS_PAGE_SIZE = 20

function getAnnouncementSearchFields(announcement: AnnouncementDataElement) {
  return [
    announcement.title ?? '',
    announcement.synopsis ?? '',
    announcement.tags.length > 0 ? announcement.tags.join(' ') : '',
  ].map((s) => String(s).toLowerCase())
}

const AnnouncementsPage: NextPage<Props> = ({ announcementsData, branch }) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)

  useEffect(() => {
    setBranchPreview(branch)
  }, [branch, setBranchPreview])

  const [searchTerm, setSearchTerm] = useState('')
  const searchTerms = useMemo(
    () => getSearchTerms(searchTerm, intl.locale),
    [searchTerm, intl.locale]
  )

  const [filters, setFilters] = useState<{
    type: string[]
    area: string[]
  }>({ type: [], area: [] })

  const [visibleCount, setVisibleCount] = useState(ANNOUNCEMENTS_PAGE_SIZE)

  useEffect(() => {
    setVisibleCount(ANNOUNCEMENTS_PAGE_SIZE)
  }, [searchTerms, filters])

  const typeConfig = useMemo(() => announcementsTypeFilter(intl), [intl])
  const areaConfig = useMemo(() => announcementsAreaFilter(intl), [intl])
  const typeChipCategories = useMemo(
    () =>
      typeConfig.options.map((option) => ({
        type: option.id,
        title: option.name,
        Icon: option.Icon,
      })),
    [typeConfig]
  )

  const filteredResult = useMemo(() => {
    const data = announcementsData.filter((announcement) => {
      const fields = getAnnouncementSearchFields(announcement)
      const matchesSearch = itemMatchesAnyTerm(searchTerms, fields)

      const matchesType =
        filters.type.length === 0 ||
        filters.type.some((t) => announcement.tags.includes(t))

      const matchesArea =
        filters.area.length === 0 ||
        filters.area.some((a) => announcement.tags.includes(a))

      return matchesSearch && matchesType && matchesArea
    })

    return data.sort((a, b) => {
      const matchA = countTermMatches(
        searchTerms,
        getAnnouncementSearchFields(a)
      )
      const matchB = countTermMatches(
        searchTerms,
        getAnnouncementSearchFields(b)
      )
      if (matchA !== matchB) {
        return matchB - matchA
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [searchTerms, filters, announcementsData])

  function handleTypeApply(category: string) {
    setFilters((prev) =>
      prev.type.includes(category)
        ? prev
        : { ...prev, type: [...prev.type, category] }
    )
  }

  function handleTypeReset() {
    setFilters((prev) => ({ ...prev, type: [] }))
  }

  function handleTypeRemoval(category: string) {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.filter((type) => type !== category),
    }))
  }

  function getTypeCategoryAmount(category: string): number {
    return announcementsData.filter((announcement) => {
      if (!announcement.tags.includes(category)) return false

      const matchesSearch = itemMatchesAnyTerm(
        searchTerms,
        getAnnouncementSearchFields(announcement)
      )
      const matchesArea =
        filters.area.length === 0 ||
        filters.area.some((area) => announcement.tags.includes(area))

      return matchesSearch && matchesArea
    }).length
  }

  const allResultsCount = useMemo(() => {
    return announcementsData.filter((announcement) => {
      const matchesSearch = itemMatchesAnyTerm(
        searchTerms,
        getAnnouncementSearchFields(announcement)
      )
      const matchesArea =
        filters.area.length === 0 ||
        filters.area.some((area) => announcement.tags.includes(area))

      return matchesSearch && matchesArea
    }).length
  }, [announcementsData, searchTerms, filters.area])

  const timelineAnnouncements = useMemo(
    () =>
      filteredResult.map((announcement) => ({
        title: announcement.title,
        publishedAt: new Date(announcement.createdAt),
        articleLink: announcement.url,
        synopsis: announcement.synopsis,
        tags: announcement.tags,
        productTeam: announcement.productTeam,
      })),
    [filteredResult]
  )

  const visibleAnnouncements = useMemo(
    () => timelineAnnouncements.slice(0, visibleCount),
    [timelineAnnouncements, visibleCount]
  )

  const hasMore = visibleCount < timelineAnnouncements.length

  const timelineByYear = useMemo(() => {
    type TimelineItem = {
      title: string
      publishedAt: Date
      articleLink: string
      synopsis?: string
      tags?: string[]
      productTeam?: string
    }

    const bucket = new Map<string, TimelineItem[]>()

    for (const item of visibleAnnouncements) {
      const yearKey = String(item.publishedAt.getFullYear())
      const list = bucket.get(yearKey) ?? []
      list.push(item)
      bucket.set(yearKey, list)
    }

    const yearsDesc = [...bucket.keys()].sort((a, b) => Number(b) - Number(a))

    return yearsDesc.map((yearKey) => ({
      yearKey,
      label: yearKey,
      announcements: bucket.get(yearKey) ?? [],
    }))
  }, [visibleAnnouncements])

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
          <Flex sx={styles.stickyControls}>
            <Flex sx={styles.chipFilterContainer}>
              <Box sx={styles.filterWrap}>
                <ListingFilter
                  checkBoxFilter={areaConfig}
                  selectedCheckboxes={filters.area}
                  labels={{
                    button: intl.formatMessage({ id: 'filter_modal.title' }),
                    modalTitle: intl.formatMessage({
                      id: 'filter_modal.title',
                    }),
                    remove: intl.formatMessage({ id: 'filter_modal.remove' }),
                    apply: intl.formatMessage({ id: 'filter_modal.button' }),
                  }}
                  onApply={(newFilters) =>
                    setFilters((prev) => ({
                      ...prev,
                      area: newFilters.checklist ?? [],
                    }))
                  }
                />
              </Box>
              <Box sx={styles.chipFilterList}>
                <ChipFilter
                  filters={filters.type}
                  categories={typeChipCategories}
                  applyCategory={handleTypeApply}
                  resetFilters={handleTypeReset}
                  removeCategory={handleTypeRemoval}
                  getCategoryAmount={getTypeCategoryAmount}
                  allResultsCount={allResultsCount}
                  allResultsLabel={intl.formatMessage({
                    id: 'chip.all_results',
                  })}
                  hideEmptyCategories
                />
              </Box>
            </Flex>
            <Flex sx={styles.toolbar}>
              <Flex sx={styles.searchWrap}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'announcements_page_search.placeholder',
                    })}
                    Icon={SearchIcon}
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                  />
                </Box>
                <Tooltip
                  placement="top"
                  label={intl.formatMessage({
                    id: 'known_issues_page_search.priority_tooltip',
                    defaultMessage:
                      'Resultados priorizam titulos com maior quantidade de termos correspondentes; em empate, aplica-se a ordenacao por data de criacao.',
                  })}
                >
                  <Box
                    as="button"
                    type="button"
                    aria-label={intl.formatMessage({
                      id: 'known_issues_page_search.priority_tooltip',
                    })}
                    sx={styles.helpButton}
                  >
                    ?
                  </Box>
                </Tooltip>
              </Flex>
            </Flex>
          </Flex>
          <Flex sx={styles.cardContainer}>
            {!!filteredResult.length && searchTerm.trim() !== '' && (
              <Box sx={styles.resultsNumberContainer}>
                {filteredResult.length}{' '}
                {intl.formatMessage({ id: 'announcements_page.results_found' })}
              </Box>
            )}
            {filteredResult.length === 0 && (
              <Flex sx={styles.noResults}>
                {intl.formatMessage({ id: 'announcements_page_result.empty' })}
              </Flex>
            )}
            {filteredResult.length > 0 &&
              timelineByYear.map((yearGroup, yearIndex) => (
                <Flex
                  key={yearGroup.yearKey}
                  id={`announcements-${yearGroup.yearKey}`}
                  sx={{
                    ...styles.yearBlock,
                    ...(yearIndex > 0 ? { mt: ['36px', '44px'] } : {}),
                  }}
                >
                  <Flex sx={styles.yearTimelineBody}>
                    <Box sx={styles.yearVerticalRail} aria-hidden />
                    <Flex sx={styles.yearHeadingRow}>
                      <Text as="h2" sx={styles.yearHeading}>
                        {yearGroup.label}
                      </Text>
                      <Flex sx={styles.yearHeadingTrack}>
                        <Box sx={styles.yearRailNode} aria-hidden />
                      </Flex>
                    </Flex>
                    <Flex sx={styles.yearItems}>
                      {yearGroup.announcements.map((item) => (
                        <AnnouncementExpandableRow
                          key={item.articleLink}
                          title={item.title}
                          articleLink={item.articleLink}
                          publishedAt={item.publishedAt}
                          synopsis={item.synopsis}
                          tags={item.tags}
                          productTeam={item.productTeam}
                        />
                      ))}
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            {hasMore && (
              <Box
                as="button"
                type="button"
                onClick={() =>
                  setVisibleCount((count) => count + ANNOUNCEMENTS_PAGE_SIZE)
                }
                sx={styles.seeMoreButton}
              >
                {intl.formatMessage({ id: 'announcements_page.see_more' })}
              </Box>
            )}
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
      if (frontmatter) {
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

        const productTeam = String(frontmatter.productTeam ?? '').trim()
        if (productTeam) {
          base.productTeam = productTeam
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
