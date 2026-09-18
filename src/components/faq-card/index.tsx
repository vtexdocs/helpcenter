import { Flex, Text, Link } from '@vtex/brand-ui'

import type { FaqCardDataElement } from 'utils/typings/types'

import styles from './styles'
import { Tag } from '@vtexdocs/components'

const FaqCard = ({ title, productTeam, slug, excerpt }: FaqCardDataElement) => {
  const excerptText = excerpt?.trim()

  return (
    <Link href={`faq/${slug}`} sx={styles.link}>
      <Flex sx={styles.container}>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        {excerptText ? <Text sx={styles.excerpt}>{excerptText}</Text> : null}
        {productTeam && (
          <Flex sx={styles.badgesRow}>
            <Tag color="Gray" sx={styles.tag}>
              {productTeam}
            </Tag>
          </Flex>
        )}
      </Flex>
    </Link>
  )
}

export default FaqCard
