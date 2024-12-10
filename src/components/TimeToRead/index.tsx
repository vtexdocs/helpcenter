import { Text } from '@vtex/brand-ui'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

import readingTime from 'styles/documentation-page'

interface props {
  minutes: string
}

const TimeToRead = ({ minutes }: props) => {
  function shouldTimeDisplay(minutes: string): boolean {
    return parseInt(minutes) >= 5
  }

  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  if (shouldTimeDisplay(minutes)) {
    return (
      <Text sx={readingTime}>
        {`${minutes} ${messages['documentation_reading_time.text']}`}
      </Text>
    )
  }
  return null
}

export default TimeToRead
