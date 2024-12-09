import { Box, Flex, Text, Timeline } from '@vtex/brand-ui'
import { useContext } from 'react'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'

import { getDaysElapsed } from '../../utils/get-days-elapsed'

import styles from './styles'
import MegaphoneIcon from 'components/icons/megaphone-icon'
import NewIcon from 'components/icons/new-icon'
import Link from 'next/link'

export interface AnnouncementTimelineCardProps {
  title: string
  date: Date
  articleLink: string
  first?: boolean
}

const AnnouncementTimelineItem = ({
  title,
  date,
  articleLink,
  first = false,
}: AnnouncementTimelineCardProps) => {
  const { locale } = useContext(LibraryContext)
  const messages = getMessages()[locale]

  return (
    <Flex sx={styles.releaseContainer}>
      <Timeline.Event
        sx={styles.timeLineBar}
        title={
          first ? (
            <Text sx={styles.newTitle}>New</Text>
          ) : (
            <Link href={articleLink}>
              <Text sx={styles.timelineTitle}>{title}</Text>
            </Link>
          )
        }
        icon={first ? <NewIcon sx={styles.icon} /> : null}
      >
        {first && (
          <Link href={articleLink}>
            <Text sx={styles.timelineTitle}>{title}</Text>
          </Link>
        )}
        {first && <Box sx={styles.placeholder}></Box>}
        <Text sx={styles.content}>
          {`${getDaysElapsed(date)} ${messages['relese-note-days-elapsed']}`}
        </Text>
      </Timeline.Event>
    </Flex>
  )
}

interface Props {
  announcements: AnnouncementTimelineCardProps[]
}

const AnnouncementTimelineCard = ({ announcements }: Props) => {
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)

  const { locale } = useContext(LibraryContext)
  const messages = getMessages()[locale]

  return (
    <Flex sx={styles.cardContainer}>
      <Box>
        <Flex sx={styles.title}>
          <MegaphoneIcon />
          <Text>{messages['landing_page_announcements.title']}</Text>
        </Flex>
        <Text sx={styles.description}>
          {messages['landing_page_announcements.description']}
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
