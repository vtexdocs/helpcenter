import { Box, Button, Flex, Text } from '@vtex/brand-ui'

import { CardProps } from '../announcement-timeline-card'
import { useIntl } from 'react-intl'

import styles from './styles'
import AnnouncementTimelineCard from '../announcement-timeline-card'
import Link from 'next/link'

const lastAnnouncements: CardProps[] = [
  {
    title: 'Black Week: VTEX Dashboards Analysis Strategies',
    description: 'Deprecation of apps-graphql@2.x',
    date: new Date('03/02/2023'),
  },
  {
    title: 'Black Week: VTEX Dashboards Analysis Strategies',
    description: 'Deprecation of apps-graphql@2.x',
    date: new Date('03/02/2023'),
  },
  {
    title: 'Black Week: VTEX Dashboards Analysis Strategies',
    description: 'Deprecation of apps-graphql@2.x',
    date: new Date('03/02/2023'),
  },
  {
    title: 'Black Week: VTEX Dashboards Analysis Strategies',
    description: 'Deprecation of apps-graphql@2.x',
    date: new Date('03/02/2023'),
  },
  {
    title: 'Black Week: VTEX Dashboards Analysis Strategies',
    description: 'Deprecation of apps-graphql@2.x',
    date: new Date('03/02/2023'),
  },
]

const AnnouncementSection = () => {
  const intl = useIntl()

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
        <AnnouncementTimelineCard announcements={lastAnnouncements} />
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
