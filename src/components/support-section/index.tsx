import { Flex, Text } from '@vtex/brand-ui'

import styles from './styles'
import { FormattedMessage, useIntl } from 'react-intl'
import { supportData } from 'utils/constants'
import SupportSectionCard from 'components/support-section-card'

const SupportSection = () => {
  const intl = useIntl()

  return (
    <Flex sx={styles.sectionContainer}>
      <Text sx={styles.title}>
        <FormattedMessage id="landing_page_support.title" />
      </Text>
      <Flex sx={styles.contentCards}>
        {supportData(intl).map((support) => (
          <SupportSectionCard {...support} key={support.title} />
        ))}
      </Flex>
    </Flex>
  )
}

export default SupportSection
