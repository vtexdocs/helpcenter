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
import { remarkImages } from 'utils/remark_plugins/remarkImages'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import Contributors from 'components/contributors'
import OnThisPage from 'components/on-this-page'
import { Item, TableOfContents } from '@vtexdocs/components'
import Breadcrumb from 'components/breadcrumb'
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
import { retryWithRateLimit } from 'utils/retry-util'
import { fetchContentSafely } from 'utils/githubBatchFetch'

const docsPathsGLOBAL = await getKnownIssuesPaths('known-issues')

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

const KnownIssuePage: NextPage<Props> = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
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
    ? new Date(serialized.frontmatter?.createdAt)
    : undefined

  const updatedAtDate = serialized.frontmatter?.updatedAt
    ? new Date(serialized.frontmatter?.updatedAt)
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
                          minutes={serialized.frontmatter.readingTime}
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

                      {/* Reorganizado para colocar o botão após as datas */}
                      {createdAtDate && updatedAtDate && (
                        <Flex sx={{ alignItems: 'center' }}>
                          <DateText
                            createdAt={createdAtDate}
                            updatedAt={updatedAtDate}
                          />
                          {/* Adicionando o botão à direita das datas */}
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
            <TableOfContents headingList={headings} />
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
  const slug = params?.slug as string
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)
  const logger = getLogger('Known Issues')

  try {
    // Get docsPaths with error handling
    let docsPaths: Record<string, { locale: string; path: string }[]>

    try {
      docsPaths =
        process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
          ? docsPathsGLOBAL
          : await getKnownIssuesPaths('known-issues', branch)
    } catch (pathError) {
      logger.error(
        `Failed to fetch doc paths: ${
          pathError instanceof Error ? pathError.message : String(pathError)
        }`
      )
      return { notFound: true }
    }

    // Check if slug exists in docsPaths
    if (!docsPaths[slug]) {
      logger.warn(`Slug '${slug}' not found in docsPaths for known-issues`)
      return { notFound: true }
    }

    const path = docsPaths[slug].find((e) => e.locale === currentLocale)?.path

    if (!path) {
      return { notFound: true }
    }

    // Fetch document content with proper retry handling
    let documentationContent = ''
    try {
      // Use fetchContentSafely from githubBatchFetch instead of direct fetch
      const fetchResult = await fetchContentSafely(path, slug, branch)

      if (fetchResult.error) {
        throw new Error(`Failed to fetch content: ${fetchResult.error}`)
      }

      documentationContent = fetchResult.content

      if (!documentationContent) {
        logger.warn(`Empty content for ${path}`)
        return { notFound: true }
      }
    } catch (fetchError) {
      logger.error(
        `Error fetching documentation content: ${
          fetchError instanceof Error ? fetchError.message : String(fetchError)
        }`
      )
      return { notFound: true }
    }

    // Serialize content and parse frontmatter
    let serialized
    try {
      serialized = await serialize(documentationContent, {
        parseFrontmatter: true,
      })
    } catch (serializeError) {
      logger.error(
        `Error serializing markdown: ${
          serializeError instanceof Error
            ? serializeError.message
            : String(serializeError)
        }`
      )
      return { notFound: true }
    }

    // Check if status is "PUBLISHED"
    const isPublished = serialized?.frontmatter?.status === 'PUBLISHED'
    if (!isPublished) {
      return { notFound: true }
    }

    // Get contributors with retry handling
    let contributors: ContributorsType[] = []
    try {
      // Use retryWithRateLimit from retry-util.ts for GitHub API calls
      contributors = await retryWithRateLimit(
        async () => {
          const contributorsResponse = await fetch(
            `https://github.com/vtexdocs/help-center-content/file-contributors/${branch}/${path}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          )

          if (!contributorsResponse.ok) {
            throw new Error(
              `Failed to fetch contributors: ${contributorsResponse.status}`
            )
          }

          const { users } = await contributorsResponse.json()
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
        },
        {
          maxRetries: 3,
          operationName: `fetch-contributors:${slug}`,
          handleRateLimit: true,
        }
      )
    } catch (contributorsError) {
      logger.warn(
        `Error fetching contributors (non-critical): ${
          contributorsError instanceof Error
            ? contributorsError.message
            : String(contributorsError)
        }`
      )
      // Continue with empty contributors rather than failing
    }

    let format: 'md' | 'mdx' = 'mdx'
    try {
      if (path.endsWith('.md')) {
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

      logger.info(`Processing ${slug}`)
      const seeAlsoData: {
        url: string
        title: string
        category: string
      }[] = []
      const breadcrumbList: { slug: string; name: string; type: string }[] = [
        {
          slug: '/docs/known-issues/',
          name: getMessages()[currentLocale]['known_issues_page.title'],
          type: 'category',
        },
        {
          slug,
          name: serialized?.frontmatter?.title ?? '',
          type: 'markdown',
        },
      ]

      return {
        props: {
          slug,
          serialized,
          sidebarfallback,
          headingList,
          contributors,
          path,
          seeAlsoData,
          breadcrumbList,
          branch,
        },
        revalidate: 600,
      }
    } catch (error) {
      logger.error(`Error while processing ${path}\n${error}`)
      return {
        notFound: true,
      }
    }
  } catch (error) {
    logger.error(
      `Unhandled error in getStaticProps: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
    return {
      notFound: true,
    }
  }
}

export default KnownIssuePage
