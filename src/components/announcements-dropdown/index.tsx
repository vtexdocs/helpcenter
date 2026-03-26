import { Box, Flex, Text } from '@vtex/brand-ui'
import Link from 'next/link'
import { NewIcon } from '@vtexdocs/components'
import { useIntl } from 'react-intl'
import { getDaysElapsed } from 'utils/get-days-elapsed'
import Tag from 'components/tag'
import styles from './styles'

export interface AnnouncementDropdownItem {
  title: string
  date: Date
  url: string
  isNew: boolean
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

  const getTagColor = (tag: string) => {
    const tagLower = tag.toLowerCase()

    // New feature - Green
    if (
      tagLower.includes('funcionalidad') ||
      tagLower.includes('funcionalidade') ||
      tagLower.includes('feature')
    ) {
      return 'Green'
    }

    // Improvement - Blue
    if (
      tagLower.includes('melhoria') ||
      tagLower.includes('improvement') ||
      tagLower.includes('mejora')
    ) {
      return 'Blue'
    }

    // Breaking change - Yellow
    if (
      tagLower.includes('breaking') ||
      tagLower.includes('disruptivo') ||
      tagLower.includes('cambio disruptivo')
    ) {
      return 'Scheduled'
    }

    // Deprecation - Pink
    if (tagLower.includes('descontinua') || tagLower.includes('deprecation')) {
      return 'Deprecation'
    }

    // Security - Gray
    if (
      tagLower.includes('segurança') ||
      tagLower.includes('seguridad') ||
      tagLower.includes('security')
    ) {
      return 'Gray'
    }

    // Default for area tags
    return 'Gray'
  }

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
                    {announcement.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Tag key={tagIndex} color={getTagColor(tag)}>
                        {tag}
                      </Tag>
                    ))}
                  </Flex>
                )}
                <Text sx={styles.announcementTitle}>{announcement.title}</Text>
                <Flex sx={styles.metaInfo}>
                  {announcement.isNew && (
                    <Flex sx={styles.newBadge}>
                      <NewIcon sx={styles.newIcon} />
                    </Flex>
                  )}
                  <Text sx={styles.announcementDate}>
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
