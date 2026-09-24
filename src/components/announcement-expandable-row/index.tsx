import { Box, Flex, Link, Text } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'

import { Tag } from '@vtexdocs/components'
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
  productTeam?: string
}

const AnnouncementExpandableRow = ({
  title,
  articleLink,
  publishedAt,
  synopsis,
  tags,
  productTeam,
}: Props) => {
  const intl = useIntl()

  const synopsisText = synopsis?.trim()
  const typeTags = filterAnnouncementTypeTags(tags)
  const dotColors = getAnnouncementTypeDotColors(tags)
  const showLabels = typeTags.length > 0 || Boolean(productTeam)

  const dateSideLabel = intl.formatDate(publishedAt, {
    month: 'short',
    day: 'numeric',
  })

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

      <Link href={articleLink} sx={styles.cardLink}>
        <Text as="h3" sx={styles.releaseTitle}>
          {title}
        </Text>
        {synopsisText ? (
          <Text as="p" sx={styles.body}>
            {synopsisText}
          </Text>
        ) : null}
        {showLabels ? (
          <Flex sx={styles.labels}>
            {typeTags.map((tag) => (
              <Tag key={tag} color={announcementTypeTagColorMap[tag]}>
                {tag}
              </Tag>
            ))}
            {productTeam ? <Tag color="Gray">{productTeam}</Tag> : null}
          </Flex>
        ) : null}
      </Link>
    </Flex>
  )
}

export default AnnouncementExpandableRow
