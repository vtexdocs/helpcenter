import { Box, Text, Link } from '@vtex/brand-ui'

import Tag from 'components/tag'

import styles from './styles'

import type { TroubleshootingDataElement } from 'utils/typings/types'

export default function TroubleshootingCard({
  title,
  slug,
  productTeam,
}: TroubleshootingDataElement) {
  return (
    <Link href={`troubleshooting/${slug}`}>
      <Box sx={styles.container}>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <Tag color={'Gray'} sx={styles.tag}>
          {productTeam}
        </Tag>
      </Box>
    </Link>
  )
}
