import { Box, Text } from '@vtex/brand-ui'
import styles from './styles'

interface IKnownIssuesCallout {
  children: string
}

const KnownIssuesCallout = ({ children }: IKnownIssuesCallout) => {
  return (
    <Box sx={styles.container}>
      <Text sx={styles.text}>{children}</Text>
    </Box>
  )
}

export default KnownIssuesCallout
