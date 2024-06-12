import PageHeader from 'components/page-header'
import troubleshooting from '../../../public/images/troubleshooting.png'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import { NextPage } from 'next'
import { useContext } from 'react'
import { PreviewContext } from 'utils/contexts/preview'

interface Props {
  branch: string
  troubleshootingData: string[]
}

const tsdata = ['problema explosivo']

const TroubleshootingPage: NextPage<Props> = ({
  branch,
  troubleshootingData = tsdata,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const intl = useIntl()

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'troubleshooting_page.title' })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'troubleshooting_page.description',
          })}
          key="title"
        />
      </Head>
      <>
        <PageHeader
          title={intl.formatMessage({
            id: 'troubleshooting_page.title',
          })}
          description={intl.formatMessage({
            id: 'troubleshooting_page.description',
          })}
          imageUrl={troubleshooting}
          imageAlt={intl.formatMessage({ id: 'troubleshooting_page.title' })}
        />
        {troubleshootingData.map((troubleshooting) => (
          <p>{troubleshooting}</p>
        ))}
      </>
    </>
  )
}

export default TroubleshootingPage
