import { Box, Text, Link } from '@vtex/brand-ui'

import type { FaqCardDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'
import DateText from 'components/date-text'

const FaqCard = ({
  title,
  productTeam,
  slug,
  createdAt,
  updatedAt,
}: FaqCardDataElement) => {
  const createdAtDate = new Date(createdAt)
  const updatedAtDate = new Date(updatedAt)

  return (
    <Link href={`faqs/${slug}`}>
      <Box sx={styles.container}>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <DateText createdAt={createdAtDate} updatedAt={updatedAtDate} />
        <Tag color={'Gray'} sx={styles.tag}>
          {productTeam}
        </Tag>
      </Box>
    </Link>
  )
}

export default FaqCard
