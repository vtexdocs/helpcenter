import Head from 'next/head'
import { useEffect, useState, useContext, useRef } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'
import { remarkCodeHike } from '@code-hike/mdx'
import theme from 'styles/code-hike-theme'
import remarkImages from 'utils/remark_plugins/plaiceholder'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import Contributors from 'components/contributors'
import OnThisPage from 'components/on-this-page'
import { Item } from '@vtexdocs/components'
import Breadcrumb from 'components/breadcrumb'
import TableOfContentsWrapper from 'components/table-of-contents-wrapper'
import TimeToRead from 'components/TimeToRead'

import getHeadings from 'utils/getHeadings'
import getNavigation from 'utils/getNavigation'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/documentation-page'
import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import { localeType } from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'

import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'
import { getDocsPaths as getKnownIssuesPaths } from 'utils/getDocsPaths'
import { getMessages } from 'utils/get-messages'
import Tag from 'components/tag'
import DateText from 'components/date-text'
import CopyLinkButton from 'components/copy-link-button'

let docsPathsGLOBAL: Record<string, { locale: string; path: string }[]> | null =
  null

interface Props {
  sectionSelected: string
  breadcrumbList: { slug: string; name: string; type: string }[]
  content: string
  serialized: MDXRemoteSerializeResult
  contributors: ContributorsType[]
  path: string
  headingList: Item[]
  branch: string
}

const KnownIssueByIdPage: NextPage<Props> = ({
  serialized,
  headingList,
  contributors,
  breadcrumbList,
  branch,
}) => {
  const [headings, setHeadings] = useState<Item[]>([])
  const { setBranchPreview } = useContext(PreviewContext)

  setBranchPreview(branch)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setHeadings(headingList)
  }, [serialized.frontmatter])

  const createdAtDate = serialized.frontmatter?.createdAt
    ? new Date(String(serialized.frontmatter?.createdAt))
    : undefined

  const updatedAtDate = serialized.frontmatter?.updatedAt
    ? new Date(String(serialized.frontmatter?.updatedAt))
    : undefined

  return (
    <>
      <Head>
        <title>{serialized.frontmatter?.title as string}</title>
        <meta name="docsearch:doctype" content="Start here" />
        {serialized.frontmatter?.hidden && (
          <meta name="robots" content="noindex" />
        )}
        {serialized.frontmatter?.excerpt && (
          <meta
            property="og:description"
            content={serialized.frontmatter?.excerpt as string}
          />
        )}
      </Head>
      <DocumentContextProvider headings={headings}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.articleBox}>
            <Box sx={styles.contentContainer}>
              <Box sx={styles.textContainer}>
                <article ref={articleRef}>
                  <header>
                    <Breadcrumb breadcrumbList={breadcrumbList} />
                    <Flex sx={styles.flexContainer}>
                      <Text sx={styles.documentationTitle} className="title">
                        {serialized.frontmatter?.title}
                      </Text>
                      {serialized.frontmatter?.readingTime && (
                        <TimeToRead
                          minutes={
                            typeof serialized.frontmatter.readingTime ===
                              'object' &&
                            serialized.frontmatter.readingTime !== null
                              ? String(
                                  (
                                    serialized.frontmatter.readingTime as {
                                      text?: unknown
                                    }
                                  ).text ?? ''
                                )
                              : String(serialized.frontmatter.readingTime)
                          }
                        />
                      )}
                    </Flex>
                    <Box sx={styles.divider}></Box>
                    <Flex sx={styles.detailedInfo}>
                      <Flex sx={styles.id}>
                        <Text>
                          ID: {serialized.frontmatter?.internalReference}
                        </Text>
                        <Tag>{serialized.frontmatter?.kiStatus}</Tag>
                      </Flex>
                      {createdAtDate && updatedAtDate && (
                        <Flex sx={{ alignItems: 'center' }}>
                          <DateText
                            createdAt={createdAtDate}
                            updatedAt={updatedAtDate}
                          />
                          <Flex
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              ml: 2,
                            }}
                          >
                            <CopyLinkButton />
                          </Flex>
                        </Flex>
                      )}
                    </Flex>
                  </header>
                  <MarkdownRenderer serialized={serialized} />
                </article>
              </Box>
            </Box>
            <Box sx={styles.bottomContributorsContainer}>
              <Box sx={styles.bottomContributorsDivider} />
              <Contributors contributors={contributors} />
            </Box>
          </Box>
          <Box sx={styles.rightContainer}>
            <Contributors contributors={contributors} />
            <TableOfContentsWrapper headingList={headings} />
          </Box>
          <OnThisPage />
        </Flex>
      </DocumentContextProvider>
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
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  let id = params?.id as string
  // Remove 'ki--' prefix if present
  if (id && id.startsWith('ki--')) {
    id = id.slice(4)
  }
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)
  if (!docsPathsGLOBAL) {
    docsPathsGLOBAL = await getKnownIssuesPaths('known-issues')
  }
  const docsPaths =
    preview || process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
      ? await getKnownIssuesPaths('known-issues', branch)
      : docsPathsGLOBAL

  const logger = getLogger('Known Issue by ID')

  // Prefer the file in the requested locale for the given ID, but fall back to any locale if not found
  let foundPath: string | undefined
  let foundSlug: string | undefined
  // 1. Try to find the file in the requested locale
  outer: for (const slug of Object.keys(docsPaths)) {
    for (const entry of docsPaths[slug]) {
      const fileUrl = `https://raw.githubusercontent.com/vtexdocs/known-issues/${branch}/${entry.path}`
      const content = await fetch(fileUrl).then((res) => res.text())
      let frontmatter
      try {
        ;({ frontmatter } = await serialize(content, {
          parseFrontmatter: true,
        }))
      } catch (err) {
        console.error(`Error parsing file ${entry.path}:`, err)
        continue
      }
      // Debug log for ID matching
      console.log('[KnownIssueByIdPage] Comparing', {
        id,
        internalReference: frontmatter?.internalReference,
        entryLocale: entry.locale,
        currentLocale,
      })
      if (
        frontmatter &&
        String(frontmatter.internalReference) === id &&
        entry.locale === currentLocale
      ) {
        foundPath = entry.path
        foundSlug = slug
        break outer
      }
    }
  }

  // 2. If not found, fall back to any locale
  if (!foundPath) {
    outer: for (const slug of Object.keys(docsPaths)) {
      for (const entry of docsPaths[slug]) {
        const fileUrl = `https://raw.githubusercontent.com/vtexdocs/known-issues/${branch}/${entry.path}`
        const content = await fetch(fileUrl).then((res) => res.text())
        let frontmatter
        try {
          ;({ frontmatter } = await serialize(content, {
            parseFrontmatter: true,
          }))
        } catch (err) {
          console.error(`Error parsing file ${entry.path}:`, err)
          continue
        }
        // Debug log for ID matching (fallback)
        console.log('[KnownIssueByIdPage][fallback] Comparing', {
          id,
          internalReference: frontmatter?.internalReference,
          entryLocale: entry.locale,
          currentLocale,
        })
        if (frontmatter && String(frontmatter.internalReference) === id) {
          foundPath = entry.path
          foundSlug = slug
          break outer
        }
      }
    }
  }

  if (!foundPath) {
    logger.warn(
      `No known issue found with internalReference: ${id}, locale: ${currentLocale}, branch: ${branch}`
    )
    return {
      notFound: true,
    }
  }

  let documentationContent =
    (await fetch(
      `https://raw.githubusercontent.com/vtexdocs/known-issues/${branch}/${foundPath}`
    )
      .then((res) => res.text())
      .catch((err) => console.log(err))) || ''

  const serialized = await serialize(documentationContent, {
    parseFrontmatter: true,
  })

  const allowedStatuses = ['PUBLISHED', 'CHANGED']
  const hasAllowedStatus = allowedStatuses.includes(
    serialized?.frontmatter?.status as string
  )
  if (!hasAllowedStatus) {
    return {
      notFound: true,
    }
  }

  const contributors =
    (await fetch(
      `https://github.com/vtexdocs/known-issues/file-contributors/${branch}/${foundPath}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then(({ users }) => {
        const result: ContributorsType[] = []
        for (let i = 0; i < users.length; i++) {
          const user = users[i]
          if (user.id === '41898282') continue
          result.push({
            name: user.login,
            login: user.login,
            avatar: user.primaryAvatarUrl,
            userPage: `https://github.com${user.profileLink}`,
          })
        }
        return result
      })
      .catch((err) => console.log(err))) || []

  let format: 'md' | 'mdx' = 'mdx'
  try {
    if (foundPath.endsWith('.md')) {
      documentationContent = escapeCurlyBraces(documentationContent)
      documentationContent = replaceHTMLBlocks(documentationContent)
    }
  } catch (error) {
    logger.error(`${error}`)
    format = 'md'
  }

  try {
    const headingList: Item[] = []
    let serialized = await serialize(documentationContent, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          [remarkCodeHike, theme],
          remarkGFM,
          remarkImages,
          [getHeadings, { headingList }],
          remarkBlockquote,
          remarkReadingTime,
        ],
        useDynamicImport: true,
        rehypePlugins: [
          [rehypeHighlight, { languages: { hljsCurl }, ignoreMissing: true }],
        ],
        format,
      },
    })

    const sidebarfallback = await getNavigation()
    serialized = JSON.parse(JSON.stringify(serialized))

    const breadcrumbList: { slug: string; name: string; type: string }[] = [
      {
        slug: '/docs/known-issues/',
        name: getMessages()[currentLocale]['known_issues_page.title'],
        type: 'category',
      },
      {
        slug: foundSlug || id,
        name: String(serialized?.frontmatter?.title) ?? '',
        type: 'markdown',
      },
    ]

    return {
      props: {
        id,
        serialized,
        sidebarfallback,
        headingList,
        contributors,
        path: foundPath,
        breadcrumbList,
        branch,
      },
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${foundPath}\n${error}`)
    return {
      notFound: true,
    }
  }
}

export default KnownIssueByIdPage
