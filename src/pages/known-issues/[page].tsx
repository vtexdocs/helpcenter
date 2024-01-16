import { Box, Link } from '@vtex/brand-ui'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'

import styles from 'styles/release-notes'
import {
  KnownIssueDataElement,
  KnownIssueStatus,
  UpdateElement,
} from 'utils/typings/types'
import Head from 'next/head'
// import { getMessages } from 'utils/get-messages'
import { PreviewContext } from 'utils/contexts/preview'
import { useContext } from 'react'
import { getDocsPaths as getKnownIssuesPaths } from 'utils/getDocsPaths'
import { serialize } from 'next-mdx-remote/serialize'
import { getLogger } from 'utils/logging/log-util'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  knownIssuesData: UpdateElement[]
  branch: string
  page: number
  totalPages: number
}

// const messages = getMessages()

const docsPathsGLOBAL = await getKnownIssuesPaths('known-issues')

const KnownIssuesPage: NextPage<Props> = ({
  knownIssuesData,
  page,
  totalPages,
  branch,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  console.log(knownIssuesData)
  return (
    <>
      <Head>
        <title>PROBLEMAS CONHECIDOS</title>
        <meta
          property="og:title"
          content={'PROBLEMAS CONHECIDOS SUBTITLE'}
          key="title"
        />
      </Head>
      <Box sx={styles.container}>
        {knownIssuesData.map((issue, id) => {
          return <div key={id}>{issue.title}</div>
        })}
        <div>página atual {page}</div>
        <div>total páginas {totalPages}</div>
        <Link href={`/known-issues/${page + 1}`}>
          <a>próxima página</a>
        </Link>
        <Link href={`/known-issues/${page - 1}`}>
          <a>página anterior</a>
        </Link>
      </Box>
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
