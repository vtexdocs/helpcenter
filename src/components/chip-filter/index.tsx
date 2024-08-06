import styles from './styles'

import { useIntl } from 'react-intl'

import { useRef } from 'react'

interface ChipFilterProps {
  filters: string[]
  handleChipClick: (option: string) => void
}

export default function ChipFilter({
  filters,
  handleChipClick,
}: ChipFilterProps) {
  const intl = useIntl()

  const containerRef = useRef<HTMLDivElement | null>(null)

  function handleLeftArrowClick() {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 50
    }
  }

  function handleRightArrowClick() {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 50
    }
  }

  return (
    <div style={styles.chipsContainer} ref={containerRef}>
      <button onClick={handleLeftArrowClick}>{`<`}</button>
      <div style={styles.optionsContainer}>
        <button
          type="button"
          value="all"
          style={styles.chip}
          onClick={() => handleChipClick('')}
        >
          {intl.formatMessage({ id: 'chip.all_results' })}
        </button>
        {filters.map((filter: string) => (
          <button
            type="button"
            value={filter}
            style={styles.chip}
            onClick={() => handleChipClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <button onClick={handleRightArrowClick}>{`>`}</button>
    </div>
  )
}
