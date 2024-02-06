import { Box, Text, Link, Flex } from '@vtex/brand-ui'

import type { AnnouncementDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'
import { useIntl } from 'react-intl'

export type AnnouncementCardSize = 'small' | 'large'

interface AnnouncementCardProps {
  announcement: AnnouncementDataElement
  appearance?: AnnouncementCardSize
}

const AnnouncementCard = ({
  announcement,
  appearance = 'small',
}: AnnouncementCardProps) => {
  const { createdAt, url, title } = announcement
  const intl = useIntl()

  const date = new Date(createdAt)
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)
  const isNew = date >= sevenDaysAgo && date <= currentDate

  return (
    <Link sx={{ ...styles.link[appearance] }} href={`${url}`}>
      <Box sx={{ ...styles.container, ...styles.containerSpacing[appearance] }}>
        <Text sx={{ ...styles.date[appearance] }}>{intl.formatDate(date)}</Text>
        <Text sx={{ ...styles.title[appearance] }} className="title">
          {title}
        </Text>
        {isNew && (
          <Flex sx={styles.bottomContainer}>
            <Tag sx={styles.tag} color={'New'}>
              New
            </Tag>
          </Flex>
        )}
      </Box>
    </Link>
  )
}

export default AnnouncementCard
