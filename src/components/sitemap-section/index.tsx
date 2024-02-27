import { Box, Flex, Text, Link } from '@vtex/brand-ui'
import LongArrowIcon from 'components/icons/long-arrow-icon'
import styles from './styles'

interface Props {
  documentation: string
  children: { name: string; link: string; icon: boolean }[]
}

const SiteMapSection = (props: Props) => {
  //eslint-disable-next-line
  const resize = (arr: any[], batchSize: number) => {
    const retArr = []
    while (arr.length > 0) {
      retArr.push(arr.splice(0, batchSize))
    }

    return retArr
  }

  //eslint-disable-next-line
  const render = (arr: any[][]) => {
    return (
      <Flex sx={styles.outerItemsContainer}>
        {arr.map((el, idx) => {
          return (
            <Flex sx={styles.innerItemsContainer} key={idx}>
              {el.map((e, id) => {
                return (
                  <Flex sx={{ flexDirection: 'row' }}>
                    <Link sx={styles.link} href={e.link}>
                      <Text sx={{ pr: '8px' }} key={id}>
                        {e.name}
                      </Text>
                    </Link>
                    {e.icon ? <LongArrowIcon size={16} /> : <></>}
                  </Flex>
                )
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
