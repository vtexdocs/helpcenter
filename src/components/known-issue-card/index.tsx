import { Flex, Text, Link } from '@vtex/brand-ui'

import type { KnownIssueDataElement } from 'utils/typings/types'

import styles from './styles'
import Tag from 'components/tag'
import DateText from 'components/date-text'
import { useIntl } from 'react-intl'

const KnownIssueCard = ({
  title,
  id,
  module,
  kiStatus,
  slug,
  createdAt,
  updatedAt,
}: KnownIssueDataElement) => {
  const intl = useIntl()
  const createdAtDate = new Date(createdAt)
  const updatedAtDate = new Date(updatedAt)

  return (
    <Link href={`known-issues/${slug}`}>
      <Flex sx={styles.container}>
        <Flex sx={styles.topContainer}>
          <Tag color={kiStatus}>
            {intl.formatMessage({
              id: `known_issues_filter_status.${kiStatus
                .toLowerCase()
                .replace(' ', '_')}`,
            })}
          </Tag>
          <Text sx={styles.knownIssueModule} className="module">
            {module}
          </Text>
        </Flex>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <DateText createdAt={createdAtDate} updatedAt={updatedAtDate} />
        <Text sx={styles.id}>ID: {id}</Text>
      </Flex>
    </Link>
  )
}

export default KnownIssueCard
