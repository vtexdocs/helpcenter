import { Box, Flex, Text, Link } from '@vtex/brand-ui'

import type { AnnouncementDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'
import { useIntl } from 'react-intl'

type AnnouncementTagColor =
  | 'Fixed'
  | 'Closed'
  | 'Scheduled'
  | 'Deprecation'
  | 'Backlog'

const typeTagColor: Record<string, AnnouncementTagColor> = {
  'New feature': 'Fixed',
  Improvement: 'Closed',
  'Breaking change': 'Scheduled',
  Deprecation: 'Deprecation',
  'Security update': 'Backlog',
}

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
  const formattedDate = intl.formatDate(createdAtDate)

  const typeTags = (announcement.tags ?? []).filter(
    (tag) => tag in typeTagColor
  )

  return (
    <Link sx={{ ...styles.link[appearance] }} href={`${url}`}>
      <Box sx={{ ...styles.container, ...styles.containerSpacing[appearance] }}>
        {typeTags.length > 0 && (
          <Flex sx={styles.tagContainer}>
            {typeTags.map((tag) => (
              <Tag key={tag} color={typeTagColor[tag]}>
                {intl.formatMessage({
                  id: `announcements_filter_type.${tag
                    .toLowerCase()
                    .replace(/ /g, '_')}`,
                })}
              </Tag>
            ))}
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
