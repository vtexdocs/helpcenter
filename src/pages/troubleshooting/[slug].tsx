import { Box, Flex, Text } from '@vtex/brand-ui'
import { Item, MarkdownRenderer, TableOfContents } from '@vtexdocs/components'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import Head from 'next/head'
import { useContext, useEffect, useRef } from 'react'
import DocumentContextProvider from 'utils/contexts/documentContext'
import { ContributorsType } from 'utils/getFileContributors'
import styles from 'styles/documentation-page'
import Breadcrumb from 'components/breadcrumb'
import { PreviewContext } from 'utils/contexts/preview'
import DateText from 'components/date-text'
import Contributors from 'components/contributors'
import OnThisPage from 'components/on-this-page'
import { getLogger } from 'utils/logging/log-util'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { getParents } from 'utils/navigation-utils'
import { getMessages } from 'utils/get-messages'
import TimeToRead from 'components/TimeToRead'
import CopyLinkButton from 'components/copy-link-button'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import FeedbackSection from 'components/feedback-section'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { getSidebarMetadata } from 'utils/article-page/getSidebarMetadata'

interface Props {
  breadcrumbList: { slug: string; name: string; type: string }[]
  serialized: MDXRemoteSerializeResult
  contributors: ContributorsType[]
  headingList: Item[]
  branch: string
  path: string
  slug: string
}

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

const TroubleshootingPage: NextPage<Props> = ({
  serialized,
  headingList,
  contributors,
  breadcrumbList,
  branch,
  path,
  slug,
}: Props) => {
  const { setBranchPreview } = useContext(PreviewContext)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setBranchPreview(branch)
  }, [headingList])

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
        <meta name="docsearch:doctype" content="troubleshooting" />
        {serialized.frontmatter?.title && (
          <meta
            name="docsearch:doctitle"
            content={serialized.frontmatter.title as string}
          />
        )}
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
      <DocumentContextProvider headings={headingList}>
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
            <FeedbackSection docPath={path} slug={slug} />

            <Box sx={styles.bottomContributorsContainer}>
              <Box sx={styles.bottomContributorsDivider} />
              <Contributors contributors={contributors} />
            </Box>
          </Box>
          <Box sx={styles.rightContainer}>
            <Contributors contributors={contributors} />
            <TableOfContents headingList={headingList} />
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
  const logger = getLogger('troubleshooting')
  const {
    sectionSelected,
    branch,
    slug,
    currentLocale,
    mdFileExists,
    mdFileExistsForCurrentLocale,
    mdFilePath,
  } = await extractStaticPropsParams({
    sectionSelected: 'troubleshooting',
    params,
    locale,
    preview,
    previewData,
    docsPathsGLOBAL,
  })

  if (!mdFileExists) {
    logger.warn(
      `Markdown file not found for slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
    )
    return { notFound: true }
  }

  const { keyPath, flattenedSidebar } = await getSidebarMetadata(
    sectionSelected,
    slug
  )

  if (!mdFileExistsForCurrentLocale) {
    logger.warn(
      `Markdown file (slug: ${slug}, locale: ${currentLocale}, branch: ${branch}) exists for another locale. Redirecting to localized version.`
    )
    if (keyPath) {
      return redirectToLocalizedUrl(
        keyPath,
        currentLocale,
        flattenedSidebar,
        'troubleshooting'
      )
    }
    return { notFound: true }
  }

  const isListed = !!keyPath
  const parentsArray: string[] = []

  if (isListed) {
    getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
    parentsArray.push(slug)
  }

  if (!mdFileExists) {
    logger.error(`Markdown file does not exist for ${slug}`)
    return { notFound: true }
  }

  const rawContent = await fetchRawMarkdown(sectionSelected, branch, mdFilePath)
  const documentationContent = escapeCurlyBraces(replaceHTMLBlocks(rawContent))

  // Serialize content and parse frontmatter
  const headingList: Item[] = []
  const serialized = await serializeWithFallback({
    content: documentationContent,
    headingList,
    logger,
    path: mdFilePath,
  })
  if (!serialized) {
    logger.error(`Serialization failed for ${mdFilePath}`)
    return { notFound: true }
  }

  const contributors = await fetchFileContributors(
    sectionSelected,
    branch,
    mdFilePath
  )

  logger.info(`Processing ${slug}`)
  const seeAlsoData: {
    url: string
    title: string
    category: string
  }[] = []

  const breadcrumbList: { slug: string; name: string; type: string }[] = [
    {
      slug: '/troubleshooting/',
      name: getMessages()[currentLocale]['troubleshooting_page.title'],
      type: 'markdown',
    },
    {
      slug,
      name: String(serialized?.frontmatter?.title) ?? '',
      type: 'markdown',
    },
  ]

  return {
    props: {
      sectionSelected,
      parentsArray,
      slug,
      serialized: JSON.parse(JSON.stringify(serialized)),
      headingList,
      contributors,
      path: mdFilePath,
      isListed,
      seeAlsoData,
      breadcrumbList,
      branch,
    },
    revalidate: 600,
  }
}

export default TroubleshootingPage
