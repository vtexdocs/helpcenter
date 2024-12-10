import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentationSectionCard from '../documentation-section-card'

import { documentationData } from 'utils/constants'

import styles from './styles'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

const DocumentationSection = () => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]
  return (
    <Box sx={styles.sectionContainer}>
      <Text sx={styles.title}>
        {messages['landing_page_documentation.title']}
      </Text>
      <Flex
        sx={styles.cardsContainer}
        data-cy="documentation-section-card-list"
      >
        {documentationData(locale).map((card) => (
          <DocumentationSectionCard key={card.title} {...card} />
        ))}
      </Flex>
    </Box>
  )
}

export default DocumentationSection
