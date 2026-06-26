import { useState } from 'react'
import { Box, Text } from '@vtex/brand-ui'
import { useIntl } from 'react-intl'
import Tooltip from 'components/tooltip'
import styles from './styles'

interface InsertAccountNameProps {
  id: string
}

const InsertAccountName = ({ id }: InsertAccountNameProps) => {
  const intl = useIntl()
  const [accountName, setAccountName] = useState('')
  const [showError, setShowError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleNavigate = () => {
    if (!accountName.trim()) {
      setShowError(true)
      return
    }
    window.open(
      `https://${accountName.trim()}.myvtex.com/admin/docs/${id}`,
      '_blank'
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(e.target.value)
    if (showError) setShowError(false)
  }

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.container}>
        <input
          placeholder={intl.formatMessage({
            id: 'insert_account_name.placeholder',
          })}
          value={accountName}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleNavigate()
          }}
          style={{
            ...(styles.input as React.CSSProperties),
            ...(showError ? (styles.inputError as React.CSSProperties) : {}),
          }}
        />
        <Tooltip
          label={intl.formatMessage({ id: 'insert_account_name.tooltip' })}
          placement="top"
        >
          <button
            onClick={handleNavigate}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              ...(styles.button as React.CSSProperties),
              ...(hovered ? (styles.buttonHover as React.CSSProperties) : {}),
            }}
          >
            {intl.formatMessage({ id: 'insert_account_name.button' })}
          </button>
        </Tooltip>
      </Box>
      {showError && (
        <Text sx={styles.errorText}>
          {intl.formatMessage({ id: 'insert_account_name.error' })}
        </Text>
      )}
    </Box>
  )
}

export default InsertAccountName
