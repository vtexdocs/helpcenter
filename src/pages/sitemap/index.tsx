import { Flex, Box, Text, Link } from '@vtex/brand-ui' //eslint-disable-line
import { Page } from 'utils/typings/types'
import styles from 'styles/sitemap-page'
import LongArrowIcon from 'components/icons/long-arrow-icon'
import { GetStaticProps } from 'next'
import getNavigation from 'utils/getNavigation'
import { flattenJSON, getKeyByValue, localeType } from 'utils/navigation-utils' //eslint-disable-line

interface Props {
  startHereItems: [{ name: string; slug: string }]
  tutorialItems: [{ name: string; slug: string }]
} //eslint-disable-line

const SiteMapPage: Page<Props> = ({ startHereItems, tutorialItems }) => {
  const resize = (arr: any[], batchSize: number) => {
    //eslint-disable-line
    //eslint-disable-line
    const retArr = []
    while (arr.length > 0) {
      retArr.push(arr.splice(0, batchSize))
    }

    return retArr
  }

  const render = (arr: any[][]) => {
    //eslint-disable-line
    console.log(arr)
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

  const startHereBatched = resize(startHereItems.slice(), 4)
  const tutorialItemsBatched = resize(tutorialItems.slice(), 4)
  console.log('HERE', startHereItems)

  return (
    <>
      <Flex sx={styles.outerContainer}>
        <Box sx={styles.titleContainer}>
          <Text sx={styles.pageTitle}>Mapa do Site</Text>
        </Box>
        <Box>
          <Flex sx={styles.section}>
            <Box>
              <Text sx={styles.sectionTitle}>Comece aqui</Text>
            </Box>
            {render(startHereBatched)}
          </Flex>
        </Box>
        <Box>
          <Flex sx={styles.section}>
            <Box>
              <Text sx={styles.sectionTitle}>Tutorial & Solutions</Text>
            </Box>
            {render(tutorialItemsBatched)}
          </Flex>
        </Box>
        <Box>
          <Flex sx={styles.section}>
            <Box>
              <Text sx={styles.sectionTitle}>Recursos Adicionais</Text>
            </Box>
            <Flex sx={styles.outerItemsContainer}>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
              <Flex sx={styles.innerItemsContainer}>
                <Flex sx={{ gap: '8px' }}>
                  <Text>Developers Portal</Text>
                  <LongArrowIcon size={16} />
                </Flex>
                <Flex sx={{ gap: '8px' }}>
                  <Text>suporte</Text>
                  <LongArrowIcon size={16} />
                </Flex>
                <Flex sx={{ gap: '8px' }}>
                  <Text>Comunidade</Text>
                  <LongArrowIcon size={16} />
                </Flex>
                <Flex sx={{ gap: '8px' }}>
                  <Text>Feedback</Text>
                  <LongArrowIcon size={16} />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

SiteMapPage.hideSidebar = true

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)

  // console.log('SITEMAP', currentLocale)

  const sections = ['Start here', 'Tutorials & Solutions']

  const sidebarfallback = await getNavigation()

  // console.log('SITEMAP', sidebarfallback)
  const arr = sidebarfallback.filter((elem) =>
    sections.includes(elem.documentation)
  )
  const startHerearr = arr[0]
  const tutorialsArr = arr[1]

  const startHereItems = startHerearr.categories.map((elem) => {
    return { name: elem.name[currentLocale], slug: elem.slug }
  })

  const tutorialItems = tutorialsArr.categories.map((elem) => {
    return { name: elem.name[currentLocale], slug: elem.slug }
  })

  // console.log('SITEMAP', startHereItems)
  return {
    props: {
      tutorialItems,
      startHereItems,
    },
  }
}

export default SiteMapPage
