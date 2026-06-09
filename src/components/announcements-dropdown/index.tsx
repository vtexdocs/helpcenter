import { Box, Flex, Text } from '@vtex/brand-ui'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { getDaysElapsed } from 'utils/get-days-elapsed'
import Tag from 'components/tag'
import { getTagColorByLocalizedName } from 'utils/constants'
import styles from './styles'

export interface AnnouncementDropdownItem {
  title: string
  date: Date
  url: string
  author?: string
  tags?: string[]
}

interface AnnouncementsDropdownProps {
  announcements: AnnouncementDropdownItem[]
}

const AnnouncementsDropdown = ({
  announcements,
}: AnnouncementsDropdownProps) => {
  const intl = useIntl()

  return (
    <Box sx={styles.outerContainer}>
      <Box sx={styles.innerContainer}>
        <Box sx={styles.header}>
          <Text sx={styles.headerTitle}>
            {intl.formatMessage({
              id: 'landing_page_announcements.description',
            })}
          </Text>
        </Box>

        <Box sx={styles.announcementsList}>
          {announcements.slice(0, 2).map((announcement, index) => (
            <Link key={index} href={announcement.url} passHref>
              <Box sx={styles.announcementItem}>
                {announcement.author && (
                  <Text sx={styles.authorName}>{announcement.author}</Text>
                )}
                {announcement.tags && announcement.tags.length > 0 && (
                  <Flex sx={styles.tagsContainer}>
                    {announcement.tags.slice(0, 3).map((tag, tagIndex) => {
                      const color = getTagColorByLocalizedName(tag) || 'Gray'
                      return (
                        <Tag key={tagIndex} color={color}>
                          {tag}
                        </Tag>
                      )
                    })}
                  </Flex>
                )}
                <Text sx={styles.announcementTitle}>{announcement.title}</Text>
                <Text sx={styles.announcementDate}>
                  {`${getDaysElapsed(announcement.date)} ${intl.formatMessage({
                    id: 'relese-note-days-elapsed',
                  })}`}
                </Text>
              </Box>
            </Link>
          ))}
        </Box>

        <Link href="/announcements" passHref>
          <Box sx={styles.viewAllButton}>
            <Text sx={styles.viewAllText}>
              {intl.formatMessage({
                id: 'announcements_page.access_more',
              })}
            </Text>
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default AnnouncementsDropdown
