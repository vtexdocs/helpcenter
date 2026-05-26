import { Box, Flex, Text, Link } from '@vtex/brand-ui'

import type { AnnouncementDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'
import { useIntl } from 'react-intl'
import { getTagColorByLocalizedName } from 'utils/constants'

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

  const typeTags = (announcement.tags ?? [])
    .map((tag) => ({
      name: tag,
      color: getTagColorByLocalizedName(tag),
    }))
    .filter((tag) => tag.color !== undefined)

  return (
    <Link sx={{ ...styles.link[appearance] }} href={`${url}`}>
      <Box sx={{ ...styles.container, ...styles.containerSpacing[appearance] }}>
        {typeTags.length > 0 && (
          <Flex sx={styles.tagContainer}>
            {typeTags.map((tag) => (
              <Tag key={tag.name} color={tag.color!}>
                {tag.name}
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
