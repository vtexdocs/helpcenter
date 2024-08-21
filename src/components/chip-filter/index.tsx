import styles from './styles'

import { Box, Flex, Button } from '@vtex/brand-ui'

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
      const offsetWidth = 20

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
    <Flex style={styles.chipButtonWrapper}>
      {shouldDisplayArrows.left && (
        <Button
          variant="tertiary"
          size="small"
          sx={styles.leftArrowButton}
          onClick={handleLeftArrowClick}
        >
          {`<`}
        </Button>
      )}

      <Box
        style={styles.chipsContainer}
        ref={containerRef}
        onScroll={handleContainerScroll}
      >
        <Box style={styles.optionsContainer}>
          <Button
            variant="tertiary"
            size="small"
            value="all"
            sx={styles.chip}
            onClick={() => handleChipClick('')}
          >
            {intl.formatMessage({ id: 'chip.all_results' })}
          </Button>
          {filters.map((filter: string) => (
            <Button
              variant="tertiary"
              size="small"
              type="button"
              value={filter}
              sx={styles.chip}
              onClick={() => handleChipClick(filter)}
            >
              {filter}
            </Button>
          ))}
        </Box>
      </Box>
      {shouldDisplayArrows.right && (
        <Button
          variant="tertiary"
          size="small"
          sx={styles.rightArrowButton}
          onClick={handleRightArrowClick}
        >{`>`}</Button>
      )}
    </Flex>
  )
}
