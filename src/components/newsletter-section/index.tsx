import { Box, Flex, Text } from '@vtex/brand-ui'

import Image from 'next/image'
import styles from 'components/newsletter-section/styles'

import { FormattedMessage } from 'react-intl'

const NewsletterSection = () => {
  return (
    <Box sx={styles.section}>
      <Flex sx={styles.newsletterBox}>
        <Text sx={styles.newsletterTitle}>
          <FormattedMessage id="landing_page_newsletter.title" />
        </Text>
        <Text sx={styles.newsletterDescription}>
          <FormattedMessage id="landing_page_newsletter.description" />
        </Text>
      </Flex>
      <Box sx={styles.imageContainer}>
        {/* Desktop Image */}
        <Box sx={styles.desktopImageContainer}>
          <Image
            src={'/images/landing.png'}
            alt="Image of the VTEX store environment"
            priority
            fill
            objectFit="cover"
          />
        </Box>
        {/* Mobile Image */}
        <Box sx={styles.mobileImageContainer}>
          <Image
            src={'/images/landing_mobile.png'}
            alt="Image of the VTEX store environment"
            priority
            fill
            objectFit="cover"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default NewsletterSection
