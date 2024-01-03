import { Box, Button, Flex, Text } from '@vtex/brand-ui'

import { faqData } from 'utils/constants'

import styles from './styles'
import { useIntl } from 'react-intl'
import FaqSectionCard from 'components/faq-section-card'

const FaqSection = () => {
  const intl = useIntl()
  return (
    <Box sx={styles.sectionContainer}>
      <Box sx={styles.titleContainer}>
        <Box>
          <Text sx={styles.title}>
            {intl.formatMessage({
              id: 'landing_page_faq.title',
            })}
          </Text>
          <Text sx={styles.description}>
            {intl.formatMessage({
              id: 'landing_page_faq.description',
            })}
          </Text>
        </Box>
        <Button sx={styles.leftButton}>
          {intl.formatMessage({ id: 'landing_page_faq.button' })}
        </Button>
      </Box>
      <Flex sx={styles.cardsContainer} data-cy="faq-section-card-list">
        {faqData(intl).map((card) => (
          <FaqSectionCard key={card.title} {...card} />
        ))}
      </Flex>
      <Button sx={styles.bottomButton}>
        {intl.formatMessage({ id: 'landing_page_faq.button' })}
      </Button>
    </Box>
  )
}

export default FaqSection
