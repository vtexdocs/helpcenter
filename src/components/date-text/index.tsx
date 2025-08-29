import { Flex, Text } from '@vtex/brand-ui'

import { useIntl } from 'react-intl'
import styles from './styles'

interface DateTextProps {
  createdAt: Date
  updatedAt: Date
}

const DateText = ({ createdAt, updatedAt }: DateTextProps) => {
  const intl = useIntl()

  const CreatedAtText = () => {
    return (
      <Text>
        <span style={{ fontWeight: '600', paddingRight: '4px' }}>
          {intl.formatMessage({
            id: 'date_text.created',
          })}
        </span>
        {intl.formatDate(createdAt)}
      </Text>
    )
  }

  const UpdatedAtText = () => {
    return (
      <Text>
        <span style={{ fontWeight: '600', paddingRight: '4px' }}>
          {intl.formatMessage({
            id: 'date_text.updated',
          })}
        </span>
        {intl.formatDate(updatedAt)}
      </Text>
    )
  }

  return (
    <Flex sx={styles.dateContainer}>
      <CreatedAtText />
      <Text>{' • '}</Text>
      <UpdatedAtText />
    </Flex>
  )
}

export default DateText
