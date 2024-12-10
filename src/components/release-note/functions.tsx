import { Text } from '@vtex/brand-ui'
import { getDaysElapsed } from 'utils/get-days-elapsed'
import { getDate } from 'components/release-section/functions'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'

import styles from './styles'

export const getReleaseDate = (createdAt: string) => {
  const daysElapsed = getDaysElapsed(new Date(createdAt))

  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  return daysElapsed < 8 ? (
    <Text sx={styles.releaseDate}>
      {`${getDaysElapsed(new Date(createdAt))} `}
      {messages['relese-note-days-elapsed']}
    </Text>
  ) : (
    getDate(createdAt, false)
  )
}
