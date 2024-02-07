import { Box, Text, Link } from '@vtex/brand-ui'

import type { FaqCardDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'

const FaqCard = ({ title, productTeam, slug }: FaqCardDataElement) => {
  return (
    <Link href={`faq/${slug}`}>
      <Box sx={styles.container}>
        <Tag color={'Gray'} sx={styles.tag}>
          {productTeam}
        </Tag>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
      </Box>
    </Link>
  )
}

export default FaqCard
