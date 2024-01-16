import { Text } from '@vtex/brand-ui'

import type { KnownIssueStatus } from 'utils/typings/types'
import styles from './styles'

const StatusTag = ({ status }: { status: KnownIssueStatus }) => {
  return (
    <Text sx={{ ...styles.tag, ...styles.statusColors[status] }}>{status}</Text>
  )
}

export default StatusTag
