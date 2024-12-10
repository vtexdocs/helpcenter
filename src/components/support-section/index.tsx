import { Flex, Text } from '@vtex/brand-ui'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

import styles from './styles'
import { supportData } from 'utils/constants'
import SupportSectionCard from 'components/support-section-card'

const SupportSection = () => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  return (
    <Flex sx={styles.sectionContainer}>
      <Text sx={styles.title}>{messages['landing_page_support.title']}</Text>
      <Flex sx={styles.contentCards}>
        {supportData(locale).map((support) => (
          <SupportSectionCard {...support} key={support.title} />
        ))}
      </Flex>
    </Flex>
  )
}

export default SupportSection
