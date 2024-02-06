import { Box, Text, Link, Flex } from '@vtex/brand-ui'

import type { AnnouncementDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'
import { useIntl } from 'react-intl'

const AnnouncementCard = ({
  title,
  createdAt,
  url,
}: AnnouncementDataElement) => {
  const intl = useIntl()
  const date = new Date(createdAt)
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)
  const isNew = date >= sevenDaysAgo && date <= currentDate

  return (
    <Link sx={styles.link} href={`${url}`}>
      <Box sx={styles.container}>
        <Text sx={styles.date}>{intl.formatDate(date)}</Text>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <Flex sx={styles.bottomContainer}>
          {isNew && (
            <Tag sx={styles.tag} color={'New'}>
              New
            </Tag>
          )}
        </Flex>
      </Box>
    </Link>
  )
}

export default AnnouncementCard
