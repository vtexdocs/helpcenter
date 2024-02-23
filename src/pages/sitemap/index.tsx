import { Flex, Box, Text } from '@vtex/brand-ui' //eslint-disable-line
import { Page } from 'utils/typings/types'
import styles from 'styles/sitemap-page'
import LongArrowIcon from 'components/icons/long-arrow-icon'
import { GetStaticProps } from 'next'
import getNavigation from 'utils/getNavigation'
import { localeType } from 'utils/navigation-utils' //eslint-disable-line
import SiteMapSection from 'components/sitemap-section'
import { useIntl } from 'react-intl'

interface Props {
  sections: [
    { documentation: string; children: [{ name: string; slug: string }] }
  ]
} //eslint-disable-line

const SiteMapPage: Page<Props> = ({ sections }) => {
  const intl = useIntl()

  const documentationTitleTranslated: { [key: string]: string } = {
    'Start here': intl.formatMessage({ id: 'documentation_start_here.title' }),
    'Tutorials & Solutions': intl.formatMessage({
      id: 'documentation_tutorials.title',
    }),
  }

  return (
    <>
      <Flex sx={styles.outerContainer}>
        <Box sx={styles.titleContainer}>
          <Text sx={styles.pageTitle}>
            {intl.formatMessage({ id: 'sitemap_page.title' })}
          </Text>
        </Box>
        {sections.map((el) => (
          <SiteMapSection
            documentation={documentationTitleTranslated[el.documentation]}
            children={el.children}
          />
        ))}
        <Box>
          <Flex sx={styles.section}>
            <Box>
              <Text sx={styles.sectionTitle}>
                {intl.formatMessage({
                  id: 'sitemap_page_section_additional_resources.title',
                })}
              </Text>
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

  const sectionDocumentation = ['Start here', 'Tutorials & Solutions']

  const sidebarfallback = await getNavigation()

  const filteredSections = sidebarfallback.filter((elem) =>
    sectionDocumentation.includes(elem.documentation)
  )

  const sections = filteredSections.map((el) => {
    return {
      documentation: el.documentation,
      children: el.categories.map((e) => {
        return {
          name: e.name[currentLocale],
          slug: `${el.slugPrefix}/${e.slug}`,
        }
      }),
    }
  })

  return {
    props: {
      sections,
    },
  }
}

export default SiteMapPage
