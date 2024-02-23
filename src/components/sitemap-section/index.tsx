import { Box, Flex, Text } from '@vtex/brand-ui'
import styles from './styles'

interface Props {
  documentation: string
  children: [{ name: string; slug: string }]
}

const SiteMapSection = (props: Props) => {
  const resize = (arr: any[], batchSize: number) => {
    //eslint-disable-line
    const retArr = []
    while (arr.length > 0) {
      retArr.push(arr.splice(0, batchSize))
    }

    return retArr
  }

  const render = (arr: any[][]) => {
    //eslint-disable-line
    //eslint-disable-line
    // console.log(arr)
    return (
      <Flex sx={styles.outerItemsContainer}>
        {arr.map((el, idx) => {
          return (
            <Flex sx={styles.innerItemsContainer} key={idx}>
              {el.map((e, id) => {
                return <Text key={id}>{e.name}</Text>
              })}
            </Flex>
          )
        })}
      </Flex>
    )
  }

  return (
    <>
      <Flex sx={styles.section}>
        <Box>
          <Text sx={styles.sectionTitle}>{props.documentation}</Text>
        </Box>
        {render(resize(props.children.slice(), 4))}
      </Flex>
    </>
  )
}

export default SiteMapSection
