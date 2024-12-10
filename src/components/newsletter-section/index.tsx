import { Box, Flex, Text } from '@vtex/brand-ui'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

import Image from 'next/image'
import styles from 'components/newsletter-section/styles'

import { SearchInput } from '@vtexdocs/components'

const NewsletterSection = () => {
  const { locale } = useContext(LibraryContext)
  const messages = getMessages()[locale]
  return (
    <Box sx={styles.section}>
      <Box sx={styles.imageContainer}>
        <Image
          src={'/images/landing.png'}
          alt="Image of the VTEX store environment"
          fill
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Flex sx={styles.newsletterBox}>
        <Text sx={styles.newsletterTitle}>
          {messages['landing_page_newsletter.title']}
        </Text>
        <Text sx={styles.newsletterDescription}>
          {messages['landing_page_newsletter.description']}
        </Text>
        <SearchInput />
      </Flex>
    </Box>
  )
}

export default NewsletterSection
