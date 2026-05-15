import { Box, Flex, IconCaret, Text } from '@vtex/brand-ui'
import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'

import type { AnnouncementTypeFilterKey } from 'utils/getAnnouncementTypeKey'

import styles from './styles'
import { getAnnouncementTypeVisual } from './typeVisual'

interface Props {
  title: string
  articleLink: string
  publishedAt: Date
  synopsis?: string
  typeKey?: AnnouncementTypeFilterKey
  isFirstInMonth: boolean
  isLastInMonth: boolean
}

const AnnouncementExpandableRow = ({
  title,
  articleLink,
  publishedAt,
  synopsis,
  typeKey,
  isFirstInMonth,
  isLastInMonth,
}: Props) => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)

  const synopsisText = synopsis?.trim()
  const hasSynopsis = Boolean(synopsisText)

  const visual = getAnnouncementTypeVisual(typeKey)
  const publishedLabel = intl.formatDate(publishedAt, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const statusMessageId = typeKey
    ? (`announcements_filter_type.${typeKey}` as const)
    : 'announcement_timeline.default_type'

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
      <Flex sx={styles.trackColumn}>
        {!isFirstInMonth ? <Box sx={styles.stemTop} /> : null}
        <Box
          sx={{
            ...styles.dot,
            backgroundColor: visual.dotFill,
            borderColor: visual.dotBorder,
          }}
        />
        {!isLastInMonth ? <Box sx={styles.stemBottom} /> : null}
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
            <Text
              as="span"
              sx={{
                ...styles.statusLabel,
                color: visual.labelColor,
              }}
            >
              {intl.formatMessage({ id: statusMessageId })}
            </Text>
            <Link
              href={articleLink}
              onClick={(e) => e.stopPropagation()}
              sx={styles.titleLink}
            >
              <Text as="span" sx={styles.title}>
                {title}
              </Text>
            </Link>
            <Text as="span" sx={styles.timeLabel}>
              {publishedLabel}
            </Text>
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
