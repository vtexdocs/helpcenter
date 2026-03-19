import { SxStyleProp, Text } from '@vtex/brand-ui'

import styles from './styles'
import { KnownIssueStatus } from 'utils/typings/unionTypes'

const Tag = ({
  sx = {},
  children,
  color = 'Default',
  onClick,
}: {
  sx?: SxStyleProp
  children: React.ReactNode
  color?:
    | KnownIssueStatus
    | 'Default'
    | 'Selected'
    | 'New'
    | 'Gray'
<<<<<<< HEAD
    | 'Deprecation'
=======
    | 'Blue'
    | 'Green'
>>>>>>> 71e495e4 (feat: improve troubleshooting filters and card UI)
  onClick?: () => void
}) => {
  return (
    <Text
      sx={{ ...styles.tag, ...sx, ...styles.statusColors[color] }}
      onClick={onClick}
    >
      {children}
    </Text>
  )
}

export default Tag
