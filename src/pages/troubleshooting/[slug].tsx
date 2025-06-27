import { Box, Flex, Text } from '@vtex/brand-ui'
import { Item, MarkdownRenderer, TableOfContents } from '@vtexdocs/components'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import Head from 'next/head'
import { useContext, useEffect, useRef, useState } from 'react'
import DocumentContextProvider from 'utils/contexts/documentContext'
import { ContributorsType } from 'utils/getFileContributors'
import styles from 'styles/documentation-page'
import Breadcrumb from 'components/breadcrumb'
import { PreviewContext } from 'utils/contexts/preview'
import DateText from 'components/date-text'
import Contributors from 'components/contributors'
import OnThisPage from 'components/on-this-page'
import { getDocsPaths as getTroubleshootingPaths } from 'utils/getDocsPaths'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { getLogger } from 'utils/logging/log-util'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'
import remarkImages from 'utils/remark_plugins/plaiceholder'
import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'
import getHeadings from 'utils/getHeadings'
import { flattenJSON, getKeyByValue, localeType } from 'utils/navigation-utils'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import getNavigation from 'utils/getNavigation'
import { getMessages } from 'utils/get-messages'
import TimeToRead from 'components/TimeToRead'
import CopyLinkButton from 'components/copy-link-button'

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

// Initialize in getStaticProps
let docsPathsGLOBAL: Record<string, { locale: string; path: string }[]> | null =
  null

const TroubleshootingPage: NextPage<Props> = ({
  serialized,
  headingList,
  contributors,
  breadcrumbList,
  branch,
}: Props) => {
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
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (serialized.frontmatter.readingTime as any)?.text ||
                            String(serialized.frontmatter.readingTime)
                          }
                        />
                      )}

                      {/* Reorganizado para colocar o botão após as datas */}
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

export const getStaticProps: GetStaticProps<Props> = async ({
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
  const currentLocale: localeType = (locale ?? 'en') as localeType
  if (!docsPathsGLOBAL) {
    docsPathsGLOBAL = await getTroubleshootingPaths('troubleshooting')
  }
  const docsPaths =
    preview || process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
      ? await getTroubleshootingPaths('troubleshooting', branch)
      : docsPathsGLOBAL

  const logger = getLogger('Start here')

  const path = docsPaths[slug].find((e) => e.locale === currentLocale)?.path

  if (!path) {
    const sidebarfallback = await getNavigation()
    const flattenedSidebar = flattenJSON(sidebarfallback)
    const keyPath = getKeyByValue(flattenedSidebar, slug)

    if (!keyPath) {
      logger.warn(
        `File exists in the repo but not in navigation: slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
      )
      return {
        notFound: true,
      }
    }

    // If the path is not found, the function below redirects the user to the localized URL. If the localized URL is not found, it returns a 404 page.
    return redirectToLocalizedUrl(
      keyPath,
      currentLocale,
      flattenedSidebar,
      'troubleshooting'
    )
  }

  let documentationContent =
    (await fetch(
      `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
    )
      .then((res) => res.text())
      .catch((err) => console.log(err))) || ''

  // Serialize content and parse frontmatter
  const serialized = await serialize(documentationContent, {
    parseFrontmatter: true,
  })

  // Allow PUBLISHED and CHANGED status documents to be visible
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
      `https://github.com/vtexdocs/help-center-content/file-contributors/${branch}/${path}`,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          remarkGFM,
          remarkImages,
          [getHeadings, { headingList }],
          remarkBlockquote,
          remarkReadingTime,
        ],
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
        slug: '/docs/troubleshooting/',
        name: getMessages()[currentLocale]['troubleshooting_page.title'],
        type: 'category',
      },
      {
        slug,
        name: String(serialized?.frontmatter?.title) ?? '',
        type: '',
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
        sectionSelected: 'troubleshooting',
        content: documentationContent,
      },
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${path}\n${error}`)
    return {
      notFound: true,
    }
  }
}

export default TroubleshootingPage
