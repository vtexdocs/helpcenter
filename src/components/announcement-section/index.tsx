import { Box, Button, Flex, Text } from '@vtex/brand-ui'

import { CardProps } from '../announcement-card'
import { useIntl } from 'react-intl'

import styles from './styles'
import AnnouncementCard from '../announcement-card'

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
        <AnnouncementCard announcements={lastAnnouncements} />
      </Box>
      <Button sx={styles.button}>
        {intl.formatMessage({ id: 'landing_page_announcements.button' })}
      </Button>
    </Flex>
  )
}

export default AnnouncementSection
