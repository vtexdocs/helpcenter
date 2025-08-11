import { Box, Button, Flex } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'

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
  function getNewestDate(createdAt: string) {
    const createdAtTimestamp = Date.parse(createdAt)

    return createdAtTimestamp
  }
  const intl = useIntl()
  const newAnnouncements = announcements
    .map((announcement) => {
      return {
        title: announcement.title,
        date: new Date(getNewestDate(announcement.createdAt)),
        articleLink: announcement.url,
      }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, annoucementsAmout)

  return (
    <Flex sx={styles.sectionContainer}>
      <Box sx={styles.cardsContainer}>
        <AnnouncementTimelineCard announcements={newAnnouncements} />
      </Box>
      <Flex sx={styles.buttonContainer}>
        <Link href={'/announcements'}>
          <Button sx={styles.button}>
            {intl.formatMessage({ id: 'landing_page_announcements.button' })}
          </Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default AnnouncementSection
