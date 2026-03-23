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

  const createdAtDate = new Date(createdAt)
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)
  const isNew = createdAtDate >= sevenDaysAgo && createdAtDate <= currentDate

  const formattedDate = intl.formatDate(createdAtDate)

  return (
    <Link sx={{ ...styles.link[appearance] }} href={`${url}`}>
      <Box sx={{ ...styles.container, ...styles.containerSpacing[appearance] }}>
        {isNew && (
          <Flex sx={styles.bottomContainer}>
            <Tag sx={styles.tag} color={'New'}>
              {intl.formatMessage({
                id: 'announcement_card.new_tag',
                defaultMessage: 'New',
              })}
            </Tag>
          </Flex>
        )}
        <Text sx={{ ...styles.title[appearance] }} className="title">
          {title}
        </Text>
        {announcement?.synopsis && (
          <Text sx={{ ...styles.synopsis[appearance] }}>
            {announcement.synopsis}
          </Text>
        )}
        <Text sx={{ ...styles.date[appearance] }}>{formattedDate}</Text>
      </Box>
    </Link>
  )
}

export default AnnouncementCard
