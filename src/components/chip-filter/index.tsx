import styles from './styles'

import { Box, Flex, Button, Text } from '@vtex/brand-ui'

import { useIntl } from 'react-intl'

import { useRef, useState } from 'react'

interface ChipFilterProps {
  filters: string[]
  handleChipClick: (option: string) => void
  selectedCategory: string
  selectedCategoryAmount: number
}

export default function ChipFilter({
  filters,
  handleChipClick,
  selectedCategory,
  selectedCategoryAmount,
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
      <Box style={styles.leftArrowContainer}>
        {shouldDisplayArrows.left && (
          <Button
            variant="tertiary"
            size="small"
            sx={styles.arrowButton}
            onClick={handleLeftArrowClick}
          >
            {`<`}
          </Button>
        )}
        <Box style={styles.leftArrowBlur}></Box>
      </Box>
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
            sx={
              selectedCategory === '' ? styles.activeChip : styles.inactiveChip
            }
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
              sx={
                selectedCategory === filter
                  ? styles.activeChip
                  : styles.inactiveChip
              }
              onClick={() => handleChipClick(filter)}
            >
              {filter}
              {selectedCategory === filter && (
                <Text style={styles.articlesAmount}>
                  {selectedCategoryAmount}
                </Text>
              )}
            </Button>
          ))}
        </Box>
      </Box>
      <Box style={styles.rightArrowContainer}>
        {shouldDisplayArrows.right && (
          <Button
            variant="tertiary"
            size="small"
            sx={styles.arrowButton}
            onClick={handleRightArrowClick}
          >{`>`}</Button>
        )}
        <Box style={styles.rightArrowBlur}></Box>
      </Box>
    </Flex>
  )
}
