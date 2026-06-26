import { useState } from 'react'
import { Box } from '@vtex/brand-ui'
import styles from './styles'

interface InsertAccountNameProps {
  id: string
}

const InsertAccountName = ({ id }: InsertAccountNameProps) => {
  const [accountName, setAccountName] = useState('')
  const [hovered, setHovered] = useState(false)

  const handleNavigate = () => {
    if (!accountName.trim()) return
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
      <button
        onClick={handleNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...(styles.button as React.CSSProperties),
          background: hovered ? '#F8F7FC' : 'transparent',
          borderColor: hovered ? '#5E6E84' : '#ccc',
        }}
      >
        Go to documentation
      </button>
    </Box>
  )
}

export default InsertAccountName
