import { Box, Text, Link } from '@vtex/brand-ui'

import Tag from 'components/tag'

import styles from './styles'

import type { TroubleshootingDataElement } from 'utils/typings/types'

export default function TroubleshootingCard({
  title,
  slug,
  tags,
}: TroubleshootingDataElement) {
  return (
    <Link href={`troubleshooting/${slug}`}>
      <Box sx={styles.container}>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <Box sx={styles.tagsContainer}>
          {tags
            .filter((moduleTag: string) => moduleTag !== '')
            .map((moduleTag: string) => (
              <Tag sx={styles.tag} color={'Gray'}>
                {moduleTag}
              </Tag>
            ))}
        </Box>
      </Box>
    </Link>
  )
}
