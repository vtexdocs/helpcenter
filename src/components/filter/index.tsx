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
  tagFilter?: Filter
  checkBoxFilter?: Filter
  selectedCheckboxes?: string[]
  selectedTags?: string[]
  onApply: (filters: { tag: string[]; checklist: string[] }) => void
}

interface SelectedFilters {
  tag: string[]
  checklist: string[]
}

const Filter = ({
  tagFilter,
  checkBoxFilter,
  onApply,
  selectedCheckboxes,
  selectedTags,
}: Props) => {
  const intl = useIntl()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<SelectedFilters>({
    tag: [],
    checklist: [],
  })
  const numberOfFilters =
    getSelectedFiltersLength(selectedTags) +
    getSelectedFiltersLength(selectedCheckboxes)

  function getSelectedFiltersLength(filters: string[] | undefined) {
    if (!filters) {
      return 0
    }
    return filters.length
  }

  function handleFilterClick(option: string, type: 'tag' | 'checklist') {
    if (tempFilters[type].includes(option)) {
      const updatedFilters = tempFilters[type].filter(
        (filter) => filter !== option
      )
      setTempFilters((prev) => ({ ...prev, [type]: updatedFilters }))
    } else {
      setTempFilters((prev) => ({
        ...prev,
        [type]: [...prev[type], option],
      }))
    }
  }

  function isFilterSelected(option: string, type: 'tag' | 'checklist') {
    return tempFilters[type].find((filter) => filter === option) ? true : false
  }

  const FilterButton = () => {
    return (
      <Flex
        sx={styles.filterButton}
        onClick={() => {
          setTempFilters({
            checklist: selectedCheckboxes ?? [],
            tag: selectedTags ?? [],
          })
          setIsModalOpen(true)
        }}
      >
        <FilterIcon size={16} />
        <Text sx={styles.filterButtonText}>
          {intl.formatMessage({ id: 'filter_modal.title' })}
        </Text>
        {numberOfFilters > 0 && (
          <Text sx={styles.numberOfFilters}>{numberOfFilters}</Text>
        )}
      </Flex>
    )
  }

  const TagFilter = () => {
    if (!tagFilter) return <></>
    return (
      <Box sx={styles.filterContainer}>
        <Text sx={styles.filterTitle}>{tagFilter.name}</Text>
        <Flex sx={styles.tagContainer}>
          {tagFilter.options.map((option, index) => (
            <Tag
              sx={styles.tag}
              key={index}
              color={
                isFilterSelected(option.id, 'tag') ? 'Selected' : 'Default'
              }
              onClick={() => handleFilterClick(option.id, 'tag')}
            >
              {option.name}
            </Tag>
          ))}
        </Flex>
      </Box>
    )
  }

  const CheckboxFilter = () => {
    if (!checkBoxFilter) return <></>
    return (
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
    )
  }

  const Divider = () => {
    return (
      <Box sx={styles.sectionDivider}>
        <hr />
      </Box>
    )
  }

  const FilterModal = () => {
    return (
      <>
        <Box sx={styles.blanket} onClick={() => setIsModalOpen(false)} />
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
            <TagFilter />
            {checkBoxFilter && tagFilter && <Divider />}
            <CheckboxFilter />
          </Box>
          <Flex sx={styles.buttonsContainer}>
            <Button
              sx={styles.removeButton}
              icon={() => <TrashcanIcon sx={{ mr: '8px' }} size={18} />}
              onClick={() => setTempFilters({ tag: [], checklist: [] })}
            >
              {intl.formatMessage({ id: 'filter_modal.remove' })}
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(false)
                onApply(tempFilters)
              }}
            >
              {intl.formatMessage({ id: 'filter_modal.button' })}
            </Button>
          </Flex>
        </Box>
      </>
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
