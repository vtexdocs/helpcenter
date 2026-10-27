import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentationSectionCard from '../documentation-section-card'

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
      <Flex
        sx={styles.cardsContainer}
        data-cy="documentation-section-card-list"
      >
        {menuDocumentationData(intl).map((card) => (
          <DocumentationSectionCard key={card.title} {...card} />
        ))}
      </Flex>
    </Box>
  )
}

export default DocumentationSection
