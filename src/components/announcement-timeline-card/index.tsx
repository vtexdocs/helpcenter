import { Box, Flex, Text, Timeline } from '@vtex/brand-ui'

import { getDaysElapsed } from '../../utils/get-days-elapsed'
import { useIntl } from 'react-intl'

import styles from './styles'
import cardStyles from 'components/announcement-card/styles'
import Tag from 'components/tag'
import { MegaphoneIcon, NewIcon } from '@vtexdocs/components'
import Link from 'next/link'
import type { AnnouncementTypeFilterKey } from 'utils/getAnnouncementTypeKey'

export interface AnnouncementTimelineCardProps {
  title: string
  date: Date
  articleLink: string
  first?: boolean
  /** Listagem completa: sinopse, data e tipo (mesmo vocabulário do filtro) */
  createdAt?: Date
  updatedAt?: Date
  synopsis?: string
  typeKey?: AnnouncementTypeFilterKey
}

function tagColorForTypeKey(
  key: AnnouncementTypeFilterKey
): 'NewFeature' | 'Improvement' | 'Gray' {
  if (key === 'new_feature') return 'NewFeature'
  if (key === 'improvement') return 'Improvement'
  return 'Gray'
}

const AnnouncementTimelineItem = ({
  title,
  date,
  articleLink,
  first = false,
  createdAt,
  updatedAt,
  synopsis,
  typeKey,
}: AnnouncementTimelineCardProps) => {
  const intl = useIntl()
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)

  const showNewTag =
    !!createdAt &&
    !typeKey &&
    createdAt >= sevenDaysAgo &&
    createdAt <= currentDate
  const showMetaBlock = !!(createdAt && updatedAt)
  /** Listagem: sinopse, categoria e data (como cards de comunicados) */
  const useCardLikeChrome = showMetaBlock

  const titleLink = (
    <Link href={articleLink}>
      <Text sx={styles.timelineTitle}>{title}</Text>
    </Link>
  )

  const showNewIcon = useCardLikeChrome ? showNewTag : first

  return (
    <Flex sx={styles.releaseContainer}>
      <Timeline.Event
        sx={styles.timeLineBar}
        title={
          useCardLikeChrome ? (
            titleLink
          ) : first ? (
            <Text sx={styles.newTitle}>
              {intl.formatMessage({
                id: 'announcement_card.new_tag',
                defaultMessage: 'New',
              })}
            </Text>
          ) : (
            titleLink
          )
        }
        icon={showNewIcon ? <NewIcon sx={styles.icon} /> : null}
      >
        {useCardLikeChrome ? (
          <>
            {typeKey ? (
              <Flex sx={cardStyles.bottomContainer}>
                <Tag
                  sx={{ ...cardStyles.tag, ...styles.categoryTag }}
                  color={tagColorForTypeKey(typeKey)}
                >
                  {intl.formatMessage({
                    id: `announcements_filter_type.${typeKey}`,
                  })}
                </Tag>
              </Flex>
            ) : null}
            {showNewTag ? (
              <Flex sx={cardStyles.bottomContainer}>
                <Tag sx={cardStyles.tag} color={'New'}>
                  {intl.formatMessage({
                    id: 'announcement_card.new_tag',
                    defaultMessage: 'New',
                  })}
                </Tag>
              </Flex>
            ) : null}
            {synopsis ? <Text sx={styles.synopsis}>{synopsis}</Text> : null}
            <Text sx={styles.footerDate}>
              {intl.formatDate(date, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </>
        ) : (
          <>
            {first && titleLink}
            {first && <Box sx={styles.placeholder}></Box>}
            <Text sx={styles.content}>
              {`${getDaysElapsed(date)} ${intl.formatMessage({
                id: 'relese-note-days-elapsed',
              })}`}
            </Text>
          </>
        )}
      </Timeline.Event>
    </Flex>
  )
}

interface Props {
  announcements: AnnouncementTimelineCardProps[]
  /** Bloco com título/descrição da home (landing) */
  showLandingHeader?: boolean
  /** Na listagem completa, exibir a timeline também no breakpoint menor */
  forceTimelineVisible?: boolean
  /** Na home o primeiro item ganha destaque; na página paginada use false */
  highlightFirstItem?: boolean
}

const AnnouncementTimelineCard = ({
  announcements,
  showLandingHeader = true,
  forceTimelineVisible = false,
  highlightFirstItem = true,
}: Props) => {
  const intl = useIntl()
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)

  const containerSx = showLandingHeader
    ? styles.cardContainer
    : { ...styles.cardContainer, ...styles.cardContainerPage }

  const timelineSx = forceTimelineVisible
    ? { ...styles.timelineContainer, display: 'block' }
    : styles.timelineContainer

  return (
    <Flex sx={containerSx}>
      {showLandingHeader && (
        <Box>
          <Flex sx={styles.title}>
            <MegaphoneIcon />
            <Text>
              {intl.formatMessage({
                id: 'landing_page_announcements.title',
              })}
            </Text>
          </Flex>
          <Text sx={styles.description}>
            {intl.formatMessage({
              id: 'landing_page_announcements.description',
            })}
          </Text>
        </Box>
      )}
      <Box sx={timelineSx}>
        {announcements.map((announcement, index) => {
          const newReferenceDate = announcement.createdAt ?? announcement.date
          const isNew =
            newReferenceDate >= sevenDaysAgo && newReferenceDate <= currentDate
          const first = isNew || (highlightFirstItem && index === 0)

          return (
            <AnnouncementTimelineItem
              key={announcement.articleLink}
              {...{ ...announcement, first }}
            />
          )
        })}
      </Box>
    </Flex>
  )
}

export default AnnouncementTimelineCard
