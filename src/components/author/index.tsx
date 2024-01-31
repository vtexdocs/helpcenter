import { Box, Flex, Text } from '@vtex/brand-ui'
import { ContributorsType } from 'utils/getFileContributors'
import Image from 'next/image'
import styles from './styles'

interface Props {
  contributor: ContributorsType
}

const Author = ({ contributor }: Props) => {
  return (
    <Flex sx={styles.container}>
      <Box sx={styles.photo} key={contributor.login}>
        <a key={contributor.login} href={contributor.userPage}>
          <Image
            src={contributor.avatar}
            alt="Photo of the author"
            width={32}
            height={32}
          />
        </a>
      </Box>
      <Text>{contributor.name}</Text>
    </Flex>
  )
}

export default Author
