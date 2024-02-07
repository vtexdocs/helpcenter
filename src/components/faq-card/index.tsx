import { Box, Text, Link } from '@vtex/brand-ui'

import type { FaqCardDataElement } from 'utils/typings/types'

import styles from './styles'
import { useIntl } from 'react-intl'

const FaqCard = ({ title, createdAt, slug }: FaqCardDataElement) => {
  const intl = useIntl()

  return (
    <Link href={`faq/${slug}`}>
      <Box sx={styles.container}>
        <Text sx={styles.date}>{intl.formatDate(new Date(createdAt))}</Text>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
      </Box>
    </Link>
  )
}

export default FaqCard
