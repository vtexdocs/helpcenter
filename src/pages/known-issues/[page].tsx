import { Box, Flex } from '@vtex/brand-ui'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'

import { KnownIssueDataElement, KnownIssueStatus } from 'utils/typings/types'
import Head from 'next/head'
import styles from 'styles/known-issues-page'
import { PreviewContext } from 'utils/contexts/preview'
import { Fragment, useContext, useEffect, useState } from 'react'
import { getDocsPaths as getKnownIssuesPaths } from 'utils/getDocsPaths'
import { serialize } from 'next-mdx-remote/serialize'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/start-here.png'
import KnownIssueCard from 'components/known-issue-card'
import { Router, useRouter } from 'next/router'
import Pagination from 'components/pagination'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  knownIssuesData: KnownIssueDataElement[]
  branch: string
  page: number
  totalPages: number
}

const docsPathsGLOBAL = await getKnownIssuesPaths('known-issues')

const Skeleton = ({ number }: { number: number }) => (
  <Flex sx={styles.cardContainer}>
    {Array(number)
      .fill(0)
      .map((_, index) => (
        <Box sx={styles.skeletonBox} key={index} />
      ))}
  </Flex>
)

const KnownIssuesPage: NextPage<Props> = ({
  knownIssuesData,
  page,
  totalPages,
  branch,
}) => {
  const intl = useIntl()
  const router = useRouter()
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const [isLoading, setLoading] = useState(false)
  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', startLoading)
    Router.events.on('routeChangeComplete', stopLoading)

    return () => {
      Router.events.off('routeChangeStart', startLoading)
      Router.events.off('routeChangeComplete', stopLoading)
    }
  }, [])

  function handleClick(props: { selected: number }) {
    if (props.selected !== undefined && props.selected !== page)
      router.push({
        pathname: '/known-issues/[page]',
        query: { page: props.selected },
      })
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'known_issues_page.title',
          })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'known_issues_page.subtitle',
          })}
          key="title"
        />
      </Head>
      <Fragment>
        <PageHeader
          title={intl.formatMessage({
            id: 'known_issues_page.title',
          })}
          description={intl.formatMessage({
            id: 'known_issues_page.subtitle',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'known_issues_page.title',
          })}
        />
        <Flex sx={styles.container}>
          {isLoading ? (
            <Skeleton number={5} />
          ) : (
            <Flex sx={styles.cardContainer}>
              {knownIssuesData.map((issue, id) => {
                return <KnownIssueCard key={id} {...issue} />
              })}
            </Flex>
          )}
          <Pagination
            initialPage={page}
            pageCount={totalPages}
            onPageChange={handleClick}
          />
        </Flex>
      </Fragment>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
  preview,
  previewData,
}) => {
  const sidebarfallback = await getNavigation()
  const sectionSelected = 'Known issues'
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const logger = getLogger('Known Issues')
  const pageSize = 5
  const totalPages = Math.ceil(Object.keys(docsPathsGLOBAL).length / pageSize)
  const page = parseInt(params?.page as string) ?? 0

  const paths: string[] = []
  if (isNaN(page) || page < 1) {
    console.error('Invalid page number:', params?.page)
  } else {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const slugs = Object.keys(docsPathsGLOBAL).slice(startIndex, endIndex)

    slugs.forEach((slug) => {
      const path = docsPathsGLOBAL[slug].find((e) => e.locale === locale)?.path
      if (path) paths.push(path)
    })
  }

  const fetchFromGithub = async (path: string) => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
      )
      const data = await response.text()
      return data || ''
    } catch (error) {
      console.error(`Error fetching data for path ${path}:`, error)
      return ''
    }
  }

  const fetchPromises = paths.map((path) => fetchFromGithub(path))

  const fetchData = await Promise.all(fetchPromises)

  const knownIssuesData: KnownIssueDataElement[] = []

  fetchData.forEach(async (data) => {
    try {
      const onlyFrontmatter = `---\n${data
        .split('---')[1]
        .replaceAll('"', '')}---\n`

      const { frontmatter } = await serialize(onlyFrontmatter, {
        parseFrontmatter: true,
      })

      if (frontmatter)
        knownIssuesData.push({
          id: frontmatter.id,
          title: frontmatter.title,
          module: frontmatter.tag,
          slug: frontmatter.slug,
          status: frontmatter.kiStatus as KnownIssueStatus,
        })
    } catch (error) {
      logger.error(`${error}`)
    }
  })

  return {
    props: {
      sidebarfallback,
      sectionSelected,
      knownIssuesData,
      page,
      totalPages,
      branch,
    },
  }
}

export default KnownIssuesPage
