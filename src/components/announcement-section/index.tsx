import { Box, Button, Flex, Text } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'

import styles from './styles'
import AnnouncementTimelineCard from '../announcement-timeline-card'
import Link from 'next/link'

interface AnnouncementSectionProps {
  announcements: { title: string; date: string }[]
}

const AnnouncementSection = ({ announcements }: AnnouncementSectionProps) => {
  const intl = useIntl()
  const newAnnouncements = announcements
    .map((announcement) => {
      return { title: announcement.title, date: new Date(announcement.date) }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <Flex sx={styles.sectionContainer}>
      <Flex>
        <Text sx={styles.title}>
          {intl.formatMessage({
            id: 'landing_page_announcements.title',
          })}
        </Text>
      </Flex>
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
