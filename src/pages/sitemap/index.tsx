import { Flex, Box, Text } from '@vtex/brand-ui'
import { Page } from 'utils/typings/types'
import styles from 'styles/sitemap-page'
import LongArrowIcon from 'components/icons/long-arrow-icon'

interface Props {} //eslint-disable-line

const siteMapPage: Page<Props> = () => {
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
            <Flex sx={styles.outerItemsContainer}>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
              <Flex sx={styles.innerItemsContainer}>
                <Text>ERP</Text>
                <Text>Soluções de pagamento</Text>
                <Text>Conversational Commerce</Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Flex sx={styles.section}>
            <Box>
              <Text sx={styles.sectionTitle}>Tutoriais & Soluções</Text>
            </Box>
            <Flex sx={styles.outerItemsContainer}>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
              <Flex sx={styles.innerItemsContainer}>
                <Text>MarketPlace</Text>
                <Text>Módulos VTEX: Primeiros Passos</Text>
                <Text>Omnichannel</Text>
                <Text>VTEX IO</Text>
              </Flex>
            </Flex>
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

siteMapPage.hideSidebar = true

export default siteMapPage
