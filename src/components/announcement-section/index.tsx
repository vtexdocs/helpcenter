import { Box, Button, Flex, Text } from '@vtex/brand-ui'
import { LibraryContext } from '@vtexdocs/components'
import { getMessages } from 'utils/get-messages'
import { useContext } from 'react'

import styles from './styles'
import AnnouncementTimelineCard from '../announcement-timeline-card'
import Link from 'next/link'

import { AnnouncementDataElement } from 'utils/typings/types'
interface AnnouncementSectionProps {
  announcements: AnnouncementDataElement[]
  annoucementsAmout: number
}

const AnnouncementSection = ({
  announcements,
  annoucementsAmout,
}: AnnouncementSectionProps) => {
  const { locale } = useContext(LibraryContext)
  const messages = getMessages()[locale]

  function getNewestDate(createdAt: string, updatedAt: string) {
    const createdAtTimestamp = Date.parse(createdAt)
    const updatedAtTimestamp = Date.parse(updatedAt)

    return createdAtTimestamp > updatedAtTimestamp ? createdAt : updatedAt
  }
  const newAnnouncements = announcements
    .map((announcement) => {
      return {
        title: announcement.title,
        date: new Date(
          getNewestDate(announcement.createdAt, announcement.updatedAt)
        ),
        articleLink: announcement.url,
      }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, annoucementsAmout)

  return (
    <Flex sx={styles.sectionContainer}>
      <Flex>
        <Text sx={styles.title}>
          {messages['landing_page_announcements.title']}
        </Text>
      </Flex>
      <Box sx={styles.cardsContainer}>
        <AnnouncementTimelineCard announcements={newAnnouncements} />
      </Box>
      <Flex sx={styles.buttonContainer}>
        <Link href={'/announcements'}>
          <Button sx={styles.button}>
            {messages['landing_page_announcements.button']}
          </Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default AnnouncementSection
