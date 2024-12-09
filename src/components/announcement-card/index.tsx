import { Box, Text, Link, Flex } from '@vtex/brand-ui'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

import type { AnnouncementDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'
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

  const createdAtDate = new Date(createdAt)
  const updatedAtDate = new Date(updatedAt)
  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)
  const isNew = createdAtDate >= sevenDaysAgo && createdAtDate <= currentDate

  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  const createdAtText = `${messages['date_text.created']}: formatDate(createdAtDate)`

  return (
    <Link sx={{ ...styles.link[appearance] }} href={`${url}`}>
      <Box sx={{ ...styles.container, ...styles.containerSpacing[appearance] }}>
        {isNew && (
          <Flex sx={styles.bottomContainer}>
            <Tag sx={styles.tag} color={'New'}>
              New
            </Tag>
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
      </Box>
    </Link>
  )
}

export default AnnouncementCard
