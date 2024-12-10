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
import WhatsNextCard from 'components/whats-next-card'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  branch: string
}

const ContentSection = ({ id, length }: { id: string; length: number }) => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]
  const trackTitleIndex = `${id}.title`

  return (
    <>
      <Text sx={styles.contentTitle}>{messages[trackTitleIndex]}</Text>
      <Flex sx={styles.cardsContainer}>
        {Array(length)
          .fill('')
          .map((_, index) => {
            const trackContentIndex = `${id}.content.${index}.title`
            const trackContentDescriptionIndex = `${id}.content.${index}.description`
            const trackContentLinkIndex = `${id}.content.${index}.link`
            if (!messages[trackContentIndex]) return <></>
            return (
              <WhatsNextCard
                title={messages[trackContentIndex]}
                description={messages[trackContentDescriptionIndex]}
                linkTitle={messages['start_here_page.link']}
                linkTo={messages[trackContentLinkIndex]}
                key={messages[trackContentIndex]}
              />
            )
          })}
      </Flex>
    </>
  )
}

const TracksPage: NextPage<Props> = ({ branch }) => {
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
          title={messages['start_here_page.title']}
          description={messages['start_here_page.subtitle']}
          imageUrl={startHereImage}
          imageAlt={messages['start_here_page.title']}
        />
        <Box sx={styles.contentContainer}>
          <ContentSection id={'start_here_page_onboarding'} length={3} />
          <ContentSection id={'start_here_page_modules'} length={12} />
          <ContentSection id={'start_here_page_marketplace'} length={16} />
          <ContentSection id={'start_here_page_omnichannel'} length={4} />
          <ContentSection id={'start_here_page_vtex_io'} length={2} />
          <ContentSection id={'start_here_page_erp'} length={1} />
          <ContentSection id={'start_here_page_payment'} length={3} />
          <ContentSection id={'start_here_page_conversational'} length={1} />
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
  const sectionSelected = 'Start here'

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

export default TracksPage
