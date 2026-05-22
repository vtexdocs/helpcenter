import { Box, Flex, IconCaret, Link, Text } from '@vtex/brand-ui'
import type { KeyboardEvent, MouseEvent } from 'react'
import { useState } from 'react'
import { useIntl } from 'react-intl'

import Tag from 'components/tag'
import {
  announcementTypeTagColorMap,
  filterAnnouncementTypeTags,
  getAnnouncementTypeDotColors,
} from 'utils/announcementTypeTags'

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

  const headerSx = hasSynopsis ? styles.headerInteractive : styles.headerStatic

  function handleHeaderKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((v) => !v)
    }
  }

  const headerProps = hasSynopsis
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-expanded': open,
        onClick: () => setOpen((v) => !v),
        onKeyDown: handleHeaderKeyDown,
      }
    : {}

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
        <Flex sx={headerSx} {...headerProps}>
          {hasSynopsis ? (
            <Flex sx={styles.caretWrap}>
              <IconCaret
                color="#9B9B9B"
                direction={open ? 'down' : 'right'}
                size={18}
              />
            </Flex>
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
              onClick={(e: MouseEvent<HTMLAnchorElement>) =>
                e.stopPropagation()
              }
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
