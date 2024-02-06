import { Button, Flex, Text } from '@vtex/brand-ui'
import AnnouncementCard from 'components/announcement-card'
import styles from './styles'
import { useIntl } from 'react-intl'
import { AnnouncementDataElement } from 'utils/typings/types'
import Link from 'next/link'

interface Props {
  docs: AnnouncementDataElement[]
}

const MoreArticlesSection = ({ docs }: Props) => {
  const intl = useIntl()

  return (
    <Flex sx={styles.container}>
      <Text sx={styles.title}>
        {intl.formatMessage({ id: 'announcements_page.access_more' })}
      </Text>
      <Flex sx={styles.innerContainer}>
        {docs.map((doc) => (
          <AnnouncementCard key={doc.title} announcement={doc} />
        ))}
      </Flex>
      <Button sx={styles.button}>
        <Link href={'/announcements'} style={{ color: 'white' }}>
          {intl.formatMessage({ id: 'announcements_page.see_more' })}
        </Link>
      </Button>
    </Flex>
  )
}

export default MoreArticlesSection
