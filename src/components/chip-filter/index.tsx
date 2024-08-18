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

  const [shouldDisplayArrows, setShouldDisplayArrows] = useState<{
    left: boolean
    right: boolean
  }>({ left: false, right: true })

  function handleLeftArrowClick() {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 180
    }
  }

  function handleRightArrowClick() {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 180
    }
  }

  function handleContainerScroll() {
    if (containerRef.current) {
      const offsetWidth = 50

      const isLeftmostScroll: boolean = containerRef.current.scrollLeft === 0
      const isRightmostScroll: boolean =
        containerRef.current.scrollLeft +
          containerRef.current.clientWidth +
          offsetWidth >=
        containerRef.current.scrollWidth

      if (isLeftmostScroll) {
        return setShouldDisplayArrows({ ...shouldDisplayArrows, left: false })
      }
      if (isRightmostScroll) {
        return setShouldDisplayArrows({ ...shouldDisplayArrows, right: false })
      }

      return setShouldDisplayArrows({ right: true, left: true })
    }
  }

  return (
    <div style={styles.chipButtonWrapper}>
      {shouldDisplayArrows.left && (
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
      {shouldDisplayArrows.right && (
        <button
          style={styles.rightArrowButton}
          onClick={handleRightArrowClick}
        >{`>`}</button>
      )}
    </div>
  )
}
