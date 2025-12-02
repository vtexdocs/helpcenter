import { Box, Flex, Text } from '@vtex/brand-ui'
import { ContributorsType } from 'utils/typings/types'
import Image from 'next/image'
import styles from './styles'

interface Props {
  contributor: ContributorsType
}

const Author = ({ contributor }: Props) => {
  return (
    <Flex sx={styles.container}>
      <Box sx={styles.photo} key={contributor?.login}>
        <Image
          src={contributor?.avatar}
          alt="Photo of the author"
          width={32}
          height={32}
        />
      </Box>
      <Text>{contributor?.name}</Text>
    </Flex>
  )
}

export default Author
