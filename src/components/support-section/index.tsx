import { Flex, Text } from '@vtex/brand-ui'
import { SectionCard, SectionCardGrid } from '@vtexdocs/components'

import styles from './styles'
import { FormattedMessage, useIntl } from 'react-intl'
import { menuSupportData } from 'utils/constants'

const SupportSection = () => {
  const intl = useIntl()

  return (
    <Flex sx={styles.sectionContainer}>
      <Text sx={styles.title}>
        <FormattedMessage id="landing_page_support.title" />
      </Text>
      <SectionCardGrid>
        {menuSupportData(intl).map((support) => (
          <SectionCard
            key={support.title}
            {...support}
            ctaLabel={intl.formatMessage({
              id: support.isExternalLink
                ? 'landing_page_documentation_card.accessPortal'
                : 'landing_page_documentation_card.learnMoreText',
            })}
          />
        ))}
      </SectionCardGrid>
    </Flex>
  )
}

export default SupportSection
