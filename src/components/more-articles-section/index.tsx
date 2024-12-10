import { Button, Flex, Text } from '@vtex/brand-ui'
import AnnouncementCard from 'components/announcement-card'
import styles from './styles'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'
import { AnnouncementDataElement } from 'utils/typings/types'
import Link from 'next/link'

interface Props {
  docs: AnnouncementDataElement[]
}

const MoreArticlesSection = ({ docs }: Props) => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  return (
    <Flex sx={styles.container}>
      <Text sx={styles.title}>
        {messages['announcements_page.access_more']}
      </Text>
      <Flex sx={styles.innerContainer}>
        {docs.map((doc) => (
          <AnnouncementCard key={doc.title} announcement={doc} />
        ))}
      </Flex>
      <Button sx={styles.button}>
        <Link href={'/announcements'} style={{ color: 'white' }}>
          {messages['announcements_page.see_more']}
        </Link>
      </Button>
    </Flex>
  )
}

export default MoreArticlesSection
