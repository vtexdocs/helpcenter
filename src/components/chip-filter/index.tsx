import styles from './styles'

import { Box, Flex, Button, Text } from '@vtex/brand-ui'

import { useIntl } from 'react-intl'

import { useRef, useState } from 'react'

interface ChipFilterProps {
  filters: string[]
  categories: string[]
  applyCategory: (option: string) => void
  resetFilters: () => void
  removeCategory: (option: string) => void
  getCategoryAmount: (category: string) => number
}

export default function ChipFilter({
  filters,
  categories,
  applyCategory,
  resetFilters,
  removeCategory,
  getCategoryAmount,
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

  function isCategoryActive(category: string) {
    return filters.includes(category)
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
          <MainChip
            value={intl.formatMessage({ id: 'chip.all_results' })}
            isActive={!filters.length}
            applyCategory={() => resetFilters()}
          />
          {categories.map((filter: string) => (
            <Chip
              removeCategory={() => removeCategory(filter)}
              value={filter}
              categoryAmount={getCategoryAmount(filter)}
              applyCategory={() => applyCategory(filter)}
              isActive={isCategoryActive(filter)}
            />
          ))}
        </Box>
      </Box>
      <Box style={styles.rightArrowContainer}>
        {shouldDisplayArrows.right && (
          <>
            <Button
              variant="tertiary"
              size="small"
              sx={styles.arrowButton}
              onClick={handleRightArrowClick}
            >{`>`}</Button>{' '}
            <Box style={styles.rightArrowBlur}></Box>
          </>
        )}
      </Box>
    </Flex>
  )
}

interface ChipProps {
  value: string
  isActive: boolean
  applyCategory: () => void
  categoryAmount: number
  removeCategory: () => void
}

function Chip({
  value,
  isActive,
  applyCategory,
  categoryAmount,
  removeCategory,
}: ChipProps) {
  function handleChipClick(active: boolean) {
    if (active) {
      return removeCategory()
    }
    applyCategory()
  }

  return (
    <Button
      variant="tertiary"
      size="small"
      type="button"
      sx={isActive ? styles.activeChip : styles.inactiveChip}
      onClick={() => handleChipClick(isActive)}
    >
      {value}
      {isActive && categoryAmount !== undefined && (
        <Text style={styles.articlesAmount}>{categoryAmount}</Text>
      )}
    </Button>
  )
}

interface MainChipProps {
  value: string
  isActive: boolean
  applyCategory: () => void
}

function MainChip({ value, isActive, applyCategory }: MainChipProps) {
  return (
    <Button
      variant="tertiary"
      size="small"
      type="button"
      sx={isActive ? styles.activeChip : styles.inactiveChip}
      onClick={() => applyCategory()}
    >
      {value}
    </Button>
  )
}
