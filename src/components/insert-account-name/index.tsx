import { useState } from 'react'
import { Box, Button } from '@vtex/brand-ui'
import styles from './styles'

interface InsertAccountNameProps {
  id: string
}

const InsertAccountName = ({ id }: InsertAccountNameProps) => {
  const [accountName, setAccountName] = useState('')

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
      <Button onClick={handleNavigate} sx={styles.button}>
        Go to documentation
      </Button>
    </Box>
  )
}

export default InsertAccountName
