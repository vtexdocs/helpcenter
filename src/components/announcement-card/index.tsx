import { Box, Text, Link, Flex } from '@vtex/brand-ui'

import type { AnnouncementDataElement } from 'utils/typings/types'
import {
  announcementTypeTagColorMap,
  filterAnnouncementTypeTags,
} from 'utils/announcementTypeTags'

import styles from './styles'
import { Tag } from '@vtexdocs/components'
import { useIntl } from 'react-intl'
import DateText from 'components/date-text'

export type AnnouncementCardSize = 'small' | 'large'

interface AnnouncementCardProps {
  announcement: AnnouncementDataElement
  appearance?: AnnouncementCardSize
}

const AnnouncementCard = ({
  announcement,
  appearance = 'small',
}: AnnouncementCardProps) => {
  const { createdAt, updatedAt, url, title } = announcement
  const intl = useIntl()

  const createdAtDate = new Date(createdAt)
  const updatedAtDate = new Date(updatedAt)

  const createdAtText = `${intl.formatMessage({
    id: 'date_text.created',
  })}: ${intl.formatDate(createdAtDate)}`

  const typeTags = filterAnnouncementTypeTags(announcement.tags)

  return (
    <Link sx={{ ...styles.link[appearance] }} href={`${url}`}>
      <Box sx={{ ...styles.container, ...styles.containerSpacing[appearance] }}>
        {typeTags.length > 0 && (
          <Flex sx={styles.tagContainer}>
            {typeTags.map((tag) => (
              <Tag key={tag} color={announcementTypeTagColorMap[tag]}>
                {tag}
              </Tag>
            ))}
          </Flex>
        )}
        <Text sx={{ ...styles.title[appearance] }} className="title">
          {title}
        </Text>
        {appearance === 'large' && (
          <DateText createdAt={createdAtDate} updatedAt={updatedAtDate} />
        )}
        {appearance === 'small' && (
          <Flex sx={styles.datesContainer}>
            <Text sx={{ ...styles.date[appearance] }}>{createdAtText}</Text>
          </Flex>
        )}
        {announcement?.synopsis && (
          <Text sx={{ ...styles.synopsis[appearance] }}>
            {announcement.synopsis}
          </Text>
        )}
      </Box>
    </Link>
  )
}

export default AnnouncementCard
