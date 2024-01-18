import { Flex } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'

import { KnownIssueDataElement, KnownIssueStatus } from 'utils/typings/types'
import Head from 'next/head'
import styles from 'styles/known-issues-page'
import { PreviewContext } from 'utils/contexts/preview'
import { Fragment, useContext, useMemo, useState } from 'react'
import { getDocsPaths as getKnownIssuesPaths } from 'utils/getDocsPaths'
import { serialize } from 'next-mdx-remote/serialize'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/start-here.png'
import KnownIssueCard from 'components/known-issue-card'
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

const KnownIssuesPage: NextPage<Props> = ({ knownIssuesData, branch }) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const itemsPerPage = 5
  const [page, setPage] = useState({ curr: 1, total: 1 })
  const [statusFilter] = useState(['Fixed'])
  const [moduleFilter] = useState([])
  const [ordering] = useState('')

  const filteredResult = useMemo(() => {
    const data = knownIssuesData.filter((knownIssue) => {
      return (
        (statusFilter.find((filter) => knownIssue.status === filter) ||
          statusFilter.length === 0) &&
        (moduleFilter.find((filter) => knownIssue.module === filter) ||
          moduleFilter.length === 0)
      )
    })

    setPage({ curr: 1, total: Math.ceil(data.length / itemsPerPage) })

    return data
  }, [statusFilter, moduleFilter, ordering])

  const paginatedResult = useMemo(() => {
    return filteredResult.slice(
      (page.curr - 1) * itemsPerPage,
      page.curr * itemsPerPage
    )
  }, [page])

  function handleClick(props: { selected: number }) {
    if (props.selected !== undefined && props.selected !== page.curr)
      setPage({ ...page, curr: props.selected })
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
          <Flex sx={styles.cardContainer}>
            {paginatedResult.map((issue, id) => {
              return <KnownIssueCard key={id} {...issue} />
            })}
          </Flex>
          <Pagination
            initialPage={page.curr}
            pageCount={page.total}
            onPageChange={handleClick}
          />
        </Flex>
      </Fragment>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({
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

  const paths: string[] = []
  const slugs = Object.keys(docsPathsGLOBAL)

  slugs.forEach((slug) => {
    const path = docsPathsGLOBAL[slug].find((e) => e.locale === locale)?.path
    if (path) paths.push(path)
  })

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
          createdAt: frontmatter.createdAt,
          updatedAt: frontmatter.updatedAt,
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
      branch,
    },
  }
}

export default KnownIssuesPage
