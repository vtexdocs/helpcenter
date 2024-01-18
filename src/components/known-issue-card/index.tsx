import { Box, Flex, Text, Link } from '@vtex/brand-ui'

import type { KnownIssueDataElement } from 'utils/typings/types'

import styles from './styles'
import StatusTag from 'components/status-tag'

const KnownIssueCard = ({
  title,
  id,
  module,
  status,
  slug,
}: KnownIssueDataElement) => {
  return (
    <Link href={`known-issues/${slug}`}>
      <Box sx={styles.container}>
        <Flex sx={styles.topContainer}>
          <Text sx={styles.knownIssueModule} className="module">
            {module}
          </Text>
          <StatusTag status={status} />
        </Flex>
        <Text sx={styles.title} className="title">
          {title}
        </Text>
        <Text sx={styles.id}>ID: {id}</Text>
      </Box>
    </Link>
  )
}

export default KnownIssueCard
