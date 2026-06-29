import { Box, Flex, IconCaret, Link, Text } from '@vtex/brand-ui'
import { useState } from 'react'
import { useIntl } from 'react-intl'

import { Tag } from '@vtexdocs/components'
import {
  announcementTypeTagColorMap,
  filterAnnouncementTypeTags,
  getAnnouncementTypeDotColors,
} from 'utils/announcementTypeTags'
import tokens from 'styles/theme-tokens'

import styles from './styles'

interface Props {
  title: string
  articleLink: string
  publishedAt: Date
  synopsis?: string
  tags?: string[]
}

const AnnouncementExpandableRow = ({
  title,
  articleLink,
  publishedAt,
  synopsis,
  tags,
}: Props) => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)

  const synopsisText = synopsis?.trim()
  const hasSynopsis = Boolean(synopsisText)

  const typeTags = filterAnnouncementTypeTags(tags)
  const dotColors = getAnnouncementTypeDotColors(tags)

  const dateSideLabel = intl
    .formatDate(publishedAt, { month: 'long', day: 'numeric' })
    .toLocaleUpperCase(intl.locale)

  const toggleLabel = intl.formatMessage(
    {
      id: open
        ? 'announcement_expandable_row.collapse'
        : 'announcement_expandable_row.expand',
    },
    { title }
  )

  return (
    <Flex sx={styles.row}>
      <Box sx={styles.dateColumn}>{dateSideLabel}</Box>

      <Flex sx={styles.trackColumn}>
        <Box
          sx={{
            ...styles.dot,
            ...dotColors,
          }}
        />
      </Flex>

      <Flex sx={styles.mainColumn}>
        <Flex sx={styles.header}>
          {hasSynopsis ? (
            <Box
              as="button"
              type="button"
              aria-expanded={open}
              aria-label={toggleLabel}
              onClick={() => setOpen((v) => !v)}
              sx={styles.caretButton}
            >
              <IconCaret
                color={tokens.grays.caretIcon}
                direction={open ? 'down' : 'right'}
                size={18}
              />
            </Box>
          ) : (
            <Box sx={{ ...styles.caretWrap, width: '20px' }} />
          )}
          <Flex sx={styles.textBlock}>
            {typeTags.length > 0 ? (
              <Flex sx={styles.typeTagsContainer}>
                {typeTags.map((tag) => (
                  <Tag key={tag} color={announcementTypeTagColorMap[tag]}>
                    {tag}
                  </Tag>
                ))}
              </Flex>
            ) : null}
            <Link
              href={articleLink}
              sx={{ ...styles.titleLink, ...styles.releaseTitle }}
            >
              <Text as="p">{title}</Text>
            </Link>
          </Flex>
        </Flex>
        {hasSynopsis && open ? (
          <Text as="p" sx={styles.body}>
            {synopsisText}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  )
}

export default AnnouncementExpandableRow
