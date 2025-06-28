import { Fragment, useContext } from 'react'
import { Box, Flex, Text } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import PageHeader from 'components/page-header'
import startHereImage from '../../../../public/images/start-here.png'
import styles from 'styles/documentation-landing-page'
import Head from 'next/head'
import { PreviewContext } from 'utils/contexts/preview'
import { useIntl } from 'react-intl'
import WhatsNextCard from 'components/whats-next-card'
import { getISRRevalidateTime } from 'utils/config'

interface Props {
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  branch: string
}

const ContentSection = ({ id, length }: { id: string; length: number }) => {
  const intl = useIntl()

  return (
    <>
      <Text sx={styles.contentTitle}>
        {intl.formatMessage({ id: `${id}.title` })}
      </Text>
      <Flex sx={styles.cardsContainer}>
        {Array(length)
          .fill('')
          .map((_, index) => {
            if (!intl.messages[`${id}.content.${index}.title`]) return <></>
            return (
              <WhatsNextCard
                title={intl.formatMessage({
                  id: `${id}.content.${index}.title`,
                })}
                description={intl.formatMessage({
                  id: `${id}.content.${index}.description`,
                })}
                linkTitle={intl.formatMessage({
                  id: 'start_here_page.link',
                })}
                linkTo={intl.formatMessage({
                  id: `${id}.content.${index}.link`,
                })}
                key={intl.formatMessage({ id: `${id}.content.${index}.title` })}
              />
            )
          })}
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
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/images/start-here.png" />
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
          priority
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
  const sectionSelected = 'Start here'

  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as { branch: string }).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'

  return {
    props: {
      sectionSelected,
      branch,
    },
    revalidate: getISRRevalidateTime(),
  }
}

export default TracksPage
