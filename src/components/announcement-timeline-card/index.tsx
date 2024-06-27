import { Box, Flex, Text, Timeline } from '@vtex/brand-ui'

import { getDaysElapsed } from '../../utils/get-days-elapsed'
import { useIntl } from 'react-intl'

import styles from './styles'
import MegaphoneIcon from 'components/icons/megaphone-icon'
import NewIcon from 'components/icons/new-icon'

export interface AnnouncementTimelineCardProps {
  title: string
  date: Date
  first?: boolean
}

const AnnouncementTimelineItem = ({
  title,
  date,
  first = false,
}: AnnouncementTimelineCardProps) => {
  const intl = useIntl()

  return (
    <Flex sx={styles.releaseContainer}>
      <Timeline.Event
        sx={styles.timeLineBar}
        title={
          first ? (
            <Text sx={styles.newTitle}>New</Text>
          ) : (
            <Text sx={styles.timelineTitle}>{title}</Text>
          )
        }
        icon={first ? <NewIcon sx={styles.icon} /> : null}
      >
        {first && <Text sx={styles.timelineTitle}>{title}</Text>}
        {first && <Box sx={styles.placeholder}></Box>}
        <Text sx={styles.content}>
          {`${getDaysElapsed(date)} ${intl.formatMessage({
            id: 'relese-note-days-elapsed',
          })}`}
        </Text>
      </Timeline.Event>
    </Flex>
  )
}

interface Props {
  announcements: AnnouncementTimelineCardProps[]
}

const AnnouncementTimelineCard = ({ announcements }: Props) => {
  const intl = useIntl()
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)

  return (
    <Flex sx={styles.cardContainer}>
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
      <Box sx={styles.timelineContainer}>
        {announcements.map((announcement, index) => {
          const isNew = announcement.date >= sevenDaysAgo

          return (
            <AnnouncementTimelineItem
              key={index}
              {...{ ...announcement, first: isNew || index === 0 }}
            />
          )
        })}
      </Box>
    </Flex>
  )
}

export default AnnouncementTimelineCard
