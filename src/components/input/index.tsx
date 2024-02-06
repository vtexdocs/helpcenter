import { useState, useEffect } from 'react'
import styles from './styles'
import { Flex } from '@vtex/brand-ui'
import { IconComponent } from 'utils/typings/types'

interface InputProps {
  value: string
  Icon?: IconComponent
  placeholder?: string
  onChange: (value: string) => void
}

const Input = ({ value, onChange, placeholder = '', Icon }: InputProps) => {
  const [inputValue, setInputValue] = useState(value ?? '')

  useEffect(() => {
    if (inputValue !== value) setInputValue(value)
  }, [value])

  return (
    <Flex sx={styles.container}>
      {Icon && <Icon sx={styles.icon} />}
      <input
        style={styles.input}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => {
          setInputValue(e.currentTarget.value)
          onChange(e.currentTarget.value)
        }}
      />
    </Flex>
  )
}

export default Input
