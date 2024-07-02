import { Text } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'

import readingTime from 'styles/documentation-page'

interface props {
  minutes: string
}

const TimeToRead = ({ minutes }: props) => {
  function shouldTimeDisplay(minutes: string): boolean {
    return parseInt(minutes) >= 5
  }

  const intl = useIntl()

  if (shouldTimeDisplay(minutes)) {
    return (
      <Text sx={readingTime}>
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
  return null
}

export default TimeToRead
