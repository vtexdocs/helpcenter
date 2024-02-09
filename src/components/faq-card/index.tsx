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
    <Link href={`faq/${slug}`}>
      <Box sx={styles.container}>
        <Tag color={'Gray'} sx={styles.tag}>
          {productTeam}
        </Tag>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <DateText createdAt={createdAtDate} updatedAt={updatedAtDate} />
      </Box>
    </Link>
  )
}

export default FaqCard
