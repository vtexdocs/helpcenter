import { Box, Button, Flex, Text } from '@vtex/brand-ui'

import { faqData } from 'utils/constants'

import styles from './styles'
import { useIntl } from 'react-intl'
import FaqSectionCard from 'components/faq-section-card'
import Link from 'next/link'

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
        <Box sx={styles.leftButtonContainer}>
          <Link href={'/faq'}>
            <Button sx={styles.button}>
              {intl.formatMessage({ id: 'landing_page_faq.button' })}
            </Button>
          </Link>
        </Box>
      </Box>
      <Flex sx={styles.cardsContainer} data-cy="faq-section-card-list">
        {faqData(intl).map((card) => (
          <FaqSectionCard key={card.title} {...card} />
        ))}
      </Flex>
      <Box sx={styles.bottomButtonContainer}>
        <Link href={'/faq'}>
          <Button sx={styles.button}>
            {intl.formatMessage({ id: 'landing_page_faq.button' })}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default FaqSection
