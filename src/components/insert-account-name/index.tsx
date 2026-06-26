import { useState } from 'react'
import { Box } from '@vtex/brand-ui'
import Tooltip from 'components/tooltip'
import styles from './styles'

interface InsertAccountNameProps {
  id: string
}

const InsertAccountName = ({ id }: InsertAccountNameProps) => {
  const [accountName, setAccountName] = useState('')
  const [hovered, setHovered] = useState(false)

  const disabled = !accountName.trim()

  const handleNavigate = () => {
    if (disabled) return
    window.open(
      `https://${accountName.trim()}.myvtex.com/admin/docs/${id}`,
      '_blank'
    )
  }

  return (
    <Box sx={styles.container}>
      <input
        placeholder="Account name"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleNavigate()
        }}
        style={styles.input as React.CSSProperties}
      />
      <Tooltip
        label="Go to the documentation page on VTEX Admin"
        placement="top"
      >
        <button
          onClick={handleNavigate}
          disabled={disabled}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            ...(styles.button as React.CSSProperties),
            ...(disabled
              ? (styles.buttonDisabled as React.CSSProperties)
              : hovered
              ? (styles.buttonHover as React.CSSProperties)
              : {}),
          }}
        >
          Go to documentation
        </button>
      </Tooltip>
    </Box>
  )
}

export default InsertAccountName
