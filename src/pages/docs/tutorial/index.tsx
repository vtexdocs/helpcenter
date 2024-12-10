import { Fragment, useContext } from 'react'
import { Box, Flex, Text } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'
import getNavigation from 'utils/getNavigation'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import PageHeader from 'components/page-header'
import startHereImage from '../../../../public/images/start-here.png'
import styles from 'styles/documentation-landing-page'
import Head from 'next/head'
import { PreviewContext } from 'utils/contexts/preview'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import WhatsNextCardTutorial from 'components/whats-next-card/tutorials'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  branch: string
}

const ContentSection = ({ id, length }: { id: string; length: number }) => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]
  const tutorialTitleIndex = `${id}.title`

  return (
    <>
      <Text sx={styles.contentTitle}>{messages[tutorialTitleIndex]}</Text>
      <Flex sx={styles.cardsContainer}>
        {Array(length)
          .fill('')
          .map((_, index) => {
            const tutorialContentIndex = `${id}.content.${index}.title`
            const tutorialContentLinkIndex = `${id}.content.${index}.link`
            if (!messages[tutorialContentIndex]) return <></>
            return (
              <WhatsNextCardTutorial
                title={messages[tutorialContentIndex]}
                linkTitle={messages['start_here_page.link']}
                linkTo={messages[tutorialContentLinkIndex]}
                key={messages[tutorialContentIndex]}
              />
            )
          })}
      </Flex>
    </>
  )
}

const TutorialsPage: NextPage<Props> = ({ branch }) => {
  const { setBranchPreview } = useContext(PreviewContext)
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]
  setBranchPreview(branch)
  return (
    <>
      <Head>
        <title>{messages['start_here_page.title']}</title>
        <meta
          property="og:title"
          content={messages['start_here_page.subtitle']}
          key="title"
        />
      </Head>
      <Fragment>
        <PageHeader
          title={messages['start_here_tutorials_page.title']}
          description={messages['start_here_tutorials_page.subtitle']}
          imageUrl={startHereImage}
          imageAlt={messages['app_development_page.title']}
        />
        <Box sx={styles.contentContainer}>
          <ContentSection id={'tutorials_main_page'} length={40} />
        </Box>
      </Fragment>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({
  preview,
  previewData,
}) => {
  const sidebarfallback = await getNavigation()
  const sectionSelected = 'Tutorials'

  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'

  return {
    props: {
      sidebarfallback,
      sectionSelected,
      branch,
    },
  }
}

export default TutorialsPage
