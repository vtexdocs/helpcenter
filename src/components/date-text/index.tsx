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
        <em>
          {`${intl.formatMessage({
            id: 'date_text.created',
          })} `}
        </em>
        {intl.formatDate(createdAt)}
      </Text>
    )
  }

  const UpdatedAtText = () => {
    return (
      <Text>
        <em>
          {`${intl.formatMessage({
            id: 'date_text.updated',
          })} `}
        </em>
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
