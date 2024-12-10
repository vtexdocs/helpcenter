import { Flex, Text } from '@vtex/brand-ui'

import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'
import styles from './styles'

interface DateTextProps {
  createdAt: Date
  updatedAt: Date
}

const DateText = ({}: /*createdAt, updatedAt*/ DateTextProps) => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  const CreatedAtText = () => {
    return (
      <Text>{`${messages['date_text.created']} formatDate(createdAt)`}</Text>
    )
  }

  const UpdatedAtText = () => {
    return (
      <Text>{`${messages['date_text.updated']} formatDate(updatedAt)`}</Text>
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
