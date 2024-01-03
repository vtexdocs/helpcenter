import Link from 'next/link'
import { Box, Flex, Text, Timeline } from '@vtex/brand-ui'

import { getDaysElapsed } from '../../utils/get-days-elapsed'
import { useIntl } from 'react-intl'

import styles from './styles'
import MegaphoneIcon from 'components/icons/megaphone-icon'
import NewIcon from 'components/icons/new-icon'

export interface CardProps {
  title: string
  description: string
  date: Date
  first?: boolean
}

const AnnouncementTimelineItem = ({
  title,
  date,
  first = false,
}: CardProps) => {
  const intl = useIntl()

  return (
    <Flex sx={styles.releaseContainer}>
      <Timeline.Event
        sx={styles.timeLineBar}
        title={
          first ? (
            <Text sx={styles.newTitle}>New</Text>
          ) : (
            <Box sx={styles.placeholder}></Box>
          )
        }
        icon={first ? <NewIcon sx={styles.icon} /> : null}
      >
        <Text sx={styles.timelineTitle}>{title}</Text>
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
  announcements: CardProps[]
}

const AnnouncementCard = ({ announcements }: Props) => {
  const intl = useIntl()
  return (
    <Link href={'/announcements'} legacyBehavior>
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
            return index === 0 ? (
              <AnnouncementTimelineItem
                key={index}
                {...{ ...announcement, first: true }}
              />
            ) : (
              <AnnouncementTimelineItem key={index} {...announcement} />
            )
          })}
        </Box>
      </Flex>
    </Link>
  )
}

export default AnnouncementCard
