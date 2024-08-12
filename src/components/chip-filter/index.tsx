import styles from './styles'

import { useIntl } from 'react-intl'

import { useRef, useState } from 'react'

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

  const [displayLeftArrow, setDisplayLeftArrow] = useState<boolean>(false)

  function handleLeftArrowClick() {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200
    }
  }

  function handleRightArrowClick() {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200
    }
  }

  function handleContainerScroll() {
    if (containerRef.current?.scrollLeft === 0) {
      return setDisplayLeftArrow(false)
    }
    setDisplayLeftArrow(true)
  }

  return (
    <div style={styles.chipButtonWrapper}>
      {displayLeftArrow && (
        <button style={styles.leftArrowButton} onClick={handleLeftArrowClick}>
          {`<`}
        </button>
      )}

      <div
        style={styles.chipsContainer}
        ref={containerRef}
        onScroll={handleContainerScroll}
      >
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
      </div>
      <button
        style={styles.rightArrowButton}
        onClick={handleRightArrowClick}
      >{`>`}</button>
    </div>
  )
}
