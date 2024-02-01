import { useEffect, useState } from 'react'
import styles from './styles'
import { Flex } from '@vtex/brand-ui'

interface Props {
  options: { value: string; content: string }[]
  onSelect: (value: string) => void
  value: string
  label: string
}

const Select = ({ value, label, options, onSelect }: Props) => {
  const [selectedValue, setSelectedValue] = useState(value ?? '')

  useEffect(() => {
    if (
      selectedValue !== value &&
      options.find(({ value }) => value === selectedValue)
    )
      setSelectedValue(value)
  }, [value])

  return (
    <Flex sx={styles.selectContainer}>
      <label htmlFor={label}>{label}</label>
      <select
        id={label}
        style={styles.select}
        placeholder="teste"
        onChange={(e) => {
          setSelectedValue(e.currentTarget.value)
          onSelect(e.currentTarget.value)
        }}
        value={selectedValue}
      >
        <option hidden></option>
        {options.map(({ value, content }, index) => (
          <option key={index} value={value}>
            {content}
          </option>
        ))}
      </select>
    </Flex>
  )
}

export default Select
