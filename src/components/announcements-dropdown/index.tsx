import { Box, Flex, Text } from '@vtex/brand-ui'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { getDaysElapsed } from 'utils/get-days-elapsed'
import { ArrowRightIcon, Tag } from '@vtexdocs/components'
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

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
} as const

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
          {announcements.slice(0, 2).map((announcement) => (
            <Link
              key={announcement.url}
              href={announcement.url}
              style={linkStyle}
            >
              <Box sx={styles.announcementItem}>
                {announcement.tags && announcement.tags.length > 0 && (
                  <Flex sx={styles.tagsContainer}>
                    {announcement.tags.slice(0, 3).map((tag) => {
                      const color = getTagColorByLocalizedName(tag) || 'Gray'
                      return (
                        <Tag key={tag} color={color}>
                          {tag}
                        </Tag>
                      )
                    })}
                  </Flex>
                )}
                <Text className="title" sx={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Flex sx={styles.metaRow}>
                  {announcement.author && (
                    <Text sx={styles.authorName}>{announcement.author}</Text>
                  )}
                  <Text className="date" sx={styles.announcementDate}>
                    {`${getDaysElapsed(announcement.date)} ${intl.formatMessage(
                      {
                        id: 'relese-note-days-elapsed',
                      }
                    )}`}
                  </Text>
                </Flex>
              </Box>
            </Link>
          ))}
        </Box>

        <Link href="/announcements" style={linkStyle}>
          <Box sx={styles.viewAllButton}>
            <Text sx={styles.viewAllText}>
              {intl.formatMessage({
                id: 'announcements_page.access_more',
              })}
            </Text>
            <ArrowRightIcon sx={styles.viewAllIcon} />
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default AnnouncementsDropdown
