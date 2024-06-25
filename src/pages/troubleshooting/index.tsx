import PageHeader from 'components/page-header'
import troubleshooting from '../../../public/images/troubleshooting.png'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import type { GetStaticPropsContext, NextPage } from 'next'
import { useContext } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import { getDocsPaths as getTroubleshootingPaths } from 'utils/getDocsPaths'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'
import { getLogger } from 'utils/logging/log-util'
import { localeType } from 'utils/navigation-utils'
import { serialize } from 'next-mdx-remote/serialize'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  branch: string
  troubleshootingData: troubleshootingCardData[]
  page: number
  totalPages: number
}

interface troubleshootingCardData {
  title: string
}

const docsPathsGLOBAL = await getTroubleshootingPaths('troubleshooting')

const TroubleshootingPage: NextPage<Props> = ({
  troubleshootingData,
  branch,
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

export async function getStaticProps({
  locale,
  preview,
  previewData,
}: GetStaticPropsContext) {
  const batchSize = 100
  const sidebarFallback = await getNavigation()
  const sectionSelected = 'troubleshooting'
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'

  const branch: string = preview ? previewBranch : 'main'
  const logger = getLogger('troubleshooting')
  const currentLocale: localeType = (locale ?? 'en') as localeType

  const slugs = Object.keys(docsPathsGLOBAL)

  async function fetchFromGithub(path: string, slug: string) {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
      )
      const data = await response.text()
      return { content: data, slug }
    } catch (error) {
      logger.error(`Error fetching data for path ${path}` + ' ' + error)
      return { content: '', slug }
    }
  }

  const fetchBatch = async (batch: string[]) => {
    const promises = batch.map(async (slug) => {
      const path = docsPathsGLOBAL[slug]?.find(
        (e) => e.locale === currentLocale
      )?.path

      if (path) return fetchFromGithub(path, slug)

      return { content: '', slug }
    })

    return Promise.all(promises)
  }

  const troubleshootingData: troubleshootingCardData[] = []

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize)
    const batchResults = await fetchBatch(batch)

    for (const data of batchResults) {
      if (data?.content) {
        try {
          const onlyFrontmatter = `---\n${data.content.split('---')[1]}---\n`

          const { frontmatter } = await serialize(onlyFrontmatter, {
            parseFrontmatter: true,
          })

          if (frontmatter)
            troubleshootingData.push({
              title: frontmatter.title,
            })
        } catch (error) {
          logger.error(`${error}`)
        }
      }
    }
  }

  return {
    props: {
      sidebarFallback,
      sectionSelected,
      troubleshootingData,
      branch,
    },
  }
}

export default TroubleshootingPage
