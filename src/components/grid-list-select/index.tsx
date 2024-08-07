import { Dispatch, SetStateAction } from 'react'
import styles from './styles'
import { Button, Flex } from '@vtex/brand-ui'
import GridViewIcon from 'components/icons/grid-view-icon'
import ListViewIcon from 'components/icons/list-view-icon'

interface GridLineSelectProps {
  isGrid: boolean
  setIsGrid: Dispatch<SetStateAction<boolean>>
}

const GridLineSelect = ({ isGrid, setIsGrid }: GridLineSelectProps) => {
  return (
    <Flex sx={styles.selectContainer}>
      <Button sx={styles.button} onClick={() => setIsGrid(false)}>
        <ListViewIcon
          sx={styles.selected}
          size={16}
          fill={!isGrid ? '#CCCED8' : 'white'}
        />
      </Button>
      <Button
        sx={{ ...styles.button, ml: '4px' }}
        onClick={() => setIsGrid(true)}
      >
        <GridViewIcon
          sx={styles.selected}
          size={16}
          fill={isGrid ? '#CCCED8' : 'white'}
        />
      </Button>
    </Flex>
  )
}

export default GridLineSelect
