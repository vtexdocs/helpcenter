import { useState } from 'react'
import { Box, Button, Input } from '@vtex/brand-ui'
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
      <Input
        id="accountNameInput"
        placeholder="Account name"
        value={accountName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAccountName(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') handleNavigate()
        }}
        sx={styles.input}
      />
      <Button onClick={handleNavigate} sx={styles.button}>
        Go to documentation
      </Button>
    </Box>
  )
}

export default InsertAccountName
