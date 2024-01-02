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
import { useIntl } from 'react-intl'
import WhatsNextCard from 'components/whats-next-card'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  branch: string
}

type Content = {
  title: string
  description: string
  link: string
}

const ContentSection = ({ id }: { id: string }) => {
  const intl = useIntl()

  return (
    <>
      <Text sx={styles.contentTitle}>
        {intl.formatMessage({ id: `${id}.title` })}
      </Text>
      <Flex sx={styles.cardsContainer}>
        {((intl.messages[`${id}.content`] as unknown as Content[]) || []).map(
          (item) => {
            return (
              <WhatsNextCard
                title={item.title}
                description={item.description}
                linkTitle={intl.formatMessage({
                  id: 'start_here_page.link',
                })}
                linkTo={item.link}
                key={item.title}
              />
            )
          }
        )}
      </Flex>
    </>
  )
}

const TracksPage: NextPage<Props> = ({ branch }) => {
  const { setBranchPreview } = useContext(PreviewContext)
  const intl = useIntl()
  setBranchPreview(branch)
  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'start_here_page.title',
          })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'start_here_page.subtitle',
          })}
          key="title"
        />
      </Head>
      <Fragment>
        <PageHeader
          title={intl.formatMessage({
            id: 'start_here_page.title',
          })}
          description={intl.formatMessage({
            id: 'start_here_page.subtitle',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'start_here_page.title',
          })}
        />
        <Box sx={styles.contentContainer}>
          <ContentSection id={'start_here_page_marketplace'} />
          <ContentSection id={'start_here_page_modules'} />
          <ContentSection id={'start_here_page_omnichannel'} />
          <ContentSection id={'start_here_page_vtex_io'} />
          <ContentSection id={'start_here_page_erp'} />
          <ContentSection id={'start_here_page_payment'} />
          <ContentSection id={'start_here_page_conversational'} />
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
