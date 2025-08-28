import { Text } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'

import styles from './styles'

interface props {
  minutes: string
}

const TimeToRead = ({ minutes }: props) => {
  const intl = useIntl()

  return (
    <Text sx={styles.readingTime}>
      {intl.formatMessage(
        {
          id: 'documentation_reading_time.text',
          defaultMessage: '',
        },
        { minutes: minutes }
      )}
    </Text>
  )
}

export default TimeToRead
