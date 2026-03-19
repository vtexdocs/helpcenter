import { Box, Text, Link } from '@vtex/brand-ui'

import Tag from 'components/tag'

import styles from './styles'

import type { TroubleshootingDataElement } from 'utils/typings/types'

export default function TroubleshootingCard({
  title,
  slug,
  domainFilters,
  symptomFilters,
}: TroubleshootingDataElement) {
  const areaTags = (domainFilters ?? []).filter((tag) => tag !== '')
  const problemTypeTags = (symptomFilters ?? []).filter((tag) => tag !== '')

  return (
    <Link href={`troubleshooting/${slug}`}>
      <Box sx={styles.container}>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        {areaTags.length > 0 || problemTypeTags.length > 0 ? (
          <Box sx={styles.groupsContainer}>
            {problemTypeTags.length > 0 && (
              <Box sx={styles.groupContainer}>
                <Box sx={styles.tagsContainer}>
                  {problemTypeTags.map((tag) => (
                    <Tag key={`symptom-${tag}`} sx={styles.tag} color="Blue">
                      {tag}
                    </Tag>
                  ))}
                </Box>
              </Box>
            )}
            {areaTags.length > 0 && (
              <Box sx={styles.groupContainer}>
                <Box sx={styles.tagsContainer}>
                  {areaTags.map((tag) => (
                    <Tag key={`area-${tag}`} sx={styles.tag} color="Gray">
                      {tag}
                    </Tag>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ) : null}
      </Box>
    </Link>
  )
}
