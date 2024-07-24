import styles from './styles'

import { useIntl } from 'react-intl'

interface ChipFilterProps {
  filters: string[]
  handleChipClick: (option: string) => void
}

export default function ChipFilter({ filters }: ChipFilterProps) {
  const intl = useIntl()

  return (
    <div style={styles.chipsContainer}>
      <div style={styles.optionsContainer}>
        <button type="button" value="all" style={styles.chip}>
          {intl.formatMessage({ id: 'chip.all_results' })}
        </button>
        {filters.map((filter: string) => (
          <button type="button" value={filter} style={styles.chip}>
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}
