import { Box, Button, Checkbox, Flex, Text } from '@vtex/brand-ui'
import CloseIcon from 'components/icons/close-icon'
import FilterIcon from 'components/icons/filter-icon'
import TrashcanIcon from 'components/icons/trashcan-icon'
import Tag from 'components/tag'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import styles from './styles'

interface Filter {
  name: string
  options: { id: string; name: string }[]
}

interface Props {
  tagFilter: Filter
  checkBoxFilter: Filter
  onApply: (filters: { tag: string[]; checklist: string[] }) => void
}

const Filter = ({ tagFilter, checkBoxFilter, onApply }: Props) => {
  const intl = useIntl()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{
    tag: string[]
    checklist: string[]
  }>({
    tag: [],
    checklist: [],
  })
  const numerOfFilters =
    selectedFilters.tag.length + selectedFilters.checklist.length

  function handleFilterClick(option: string, type: 'tag' | 'checklist') {
    if (selectedFilters[type].includes(option)) {
      const updatedFilters = selectedFilters[type].filter(
        (filter) => filter !== option
      )
      setSelectedFilters((prev) => ({ ...prev, [type]: updatedFilters }))
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [type]: [...prev[type], option],
      }))
    }
  }

  function isFilterSelected(option: string, type: 'tag' | 'checklist') {
    return selectedFilters[type].find((filter) => filter === option)
      ? true
      : false
  }

  const FilterButton = () => {
    return (
      <Flex sx={styles.filterButton} onClick={() => setIsModalOpen(true)}>
        <FilterIcon />
        <Text>{intl.formatMessage({ id: 'filter_modal.title' })}</Text>
        {numerOfFilters > 0 && (
          <Text sx={styles.numberOfFilters}>{numerOfFilters}</Text>
        )}
      </Flex>
    )
  }

  const FilterModal = () => {
    return (
      <Box sx={styles.blanket}>
        <Box sx={styles.container}>
          <Box sx={styles.topContainer}>
            <Text sx={styles.modalTitle}>Filtros</Text>
            <Flex
              sx={styles.closeButtonContainer}
              onClick={() => setIsModalOpen(false)}
            >
              <CloseIcon size={32} />
            </Flex>
          </Box>
          <Box sx={styles.innerContainer}>
            <Box sx={styles.filterContainer}>
              <Text sx={styles.filterTitle}>{tagFilter.name}</Text>
              <Flex sx={styles.tagContainer}>
                {tagFilter.options.map((option, index) => (
                  <Tag
                    sx={styles.tag}
                    key={index}
                    color={
                      isFilterSelected(option.id, 'tag')
                        ? 'Selected'
                        : 'Default'
                    }
                    onClick={() => handleFilterClick(option.id, 'tag')}
                  >
                    {option.name}
                  </Tag>
                ))}
              </Flex>
            </Box>
            <Box sx={styles.sectionDivider}>
              <hr />
            </Box>
            <Box sx={styles.filterContainer}>
              <Text sx={styles.filterTitle}>{checkBoxFilter.name}</Text>
              <Box sx={styles.checkBoxContainer}>
                {checkBoxFilter.options.map((option, index) => (
                  <Checkbox
                    key={index}
                    label={option.name}
                    checked={isFilterSelected(option.id, 'checklist')}
                    onClick={() => handleFilterClick(option.id, 'checklist')}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <Flex sx={styles.buttonsContainer}>
            <Button
              sx={styles.removeButton}
              icon={() => <TrashcanIcon sx={{ mr: '8px' }} size={18} />}
              onClick={() => setSelectedFilters({ tag: [], checklist: [] })}
            >
              {intl.formatMessage({ id: 'filter_modal.remove' })}
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(false)
                onApply(selectedFilters)
              }}
            >
              {intl.formatMessage({ id: 'filter_modal.button' })}
            </Button>
          </Flex>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <FilterButton />
      {isModalOpen && <FilterModal />}
    </>
  )
}

export default Filter
