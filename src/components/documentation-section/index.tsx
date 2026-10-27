import { Box, Text } from '@vtex/brand-ui'
import { SectionCard, SectionCardGrid } from '@vtexdocs/components'

import { menuDocumentationData } from 'utils/constants'

import styles from './styles'
import { useIntl } from 'react-intl'

const DocumentationSection = () => {
  const intl = useIntl()
  return (
    <Box sx={styles.sectionContainer}>
      <Text sx={styles.title}>
        {intl.formatMessage({
          id: 'landing_page_documentation.title',
        })}
      </Text>
      <SectionCardGrid data-cy="documentation-section-card-list">
        {menuDocumentationData(intl).map((card) => (
          <SectionCard
            key={card.title}
            {...card}
            ctaLabel={intl.formatMessage({
              id: card.isExternalLink
                ? 'landing_page_documentation_card.accessPortal'
                : 'landing_page_documentation_card.learnMoreText',
            })}
          />
        ))}
      </SectionCardGrid>
    </Box>
  )
}

export default DocumentationSection
