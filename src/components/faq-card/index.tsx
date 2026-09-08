import { Box, Text, Link } from '@vtex/brand-ui'

import type { FaqCardDataElement } from 'utils/typings/types'

import styles from './styles'
import { Tag } from '@vtexdocs/components'

const FaqCard = ({ title, productTeam, slug }: FaqCardDataElement) => {
  return (
    <Link href={`faq/${slug}`} sx={styles.link}>
      <Box sx={styles.container}>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <Tag color={'Gray'} sx={styles.tag}>
          {productTeam}
        </Tag>
      </Box>
    </Link>
  )
}

export default FaqCard
