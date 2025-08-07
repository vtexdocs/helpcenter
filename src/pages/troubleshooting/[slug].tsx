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
import { getLogger } from 'utils/logging/log-util'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { flattenJSON, getKeyByValue, getParents } from 'utils/navigation-utils'
import getNavigation from 'utils/getNavigation'
import { getMessages } from 'utils/get-messages'
import TimeToRead from 'components/TimeToRead'
import CopyLinkButton from 'components/copy-link-button'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import FeedbackSection from 'components/feedback-section'

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
            <FeedbackSection docPath={path} slug={slug} />

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
  const logger = getLogger('troubleshooting')
  try {
    const {
      sectionSelected,
      branch,
      slug,
      currentLocale,
      docsPaths,
      mdFileExists,
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

    const path = docsPaths[slug]?.find((e) => e.locale === currentLocale)?.path
    const parentsArray: string[] = []
    const sidebarfallback = await getNavigation()
    const filteredSidebar = sidebarfallback.find(
      (item: { documentation: string }) =>
        item.documentation === sectionSelected
    )
    const flattenedSidebar = flattenJSON(filteredSidebar)
    const keyPath = getKeyByValue(flattenedSidebar, slug) as string

    if (!path) {
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

    if (keyPath) {
      getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
      parentsArray.push(slug)
    }

    const rawContent = await fetchRawMarkdown(branch, path)
    const documentationContent = replaceHTMLBlocks(rawContent)

    // Serialize content and parse frontmatter
    const headingList: Item[] = []
    const serialized = await serializeWithFallback({
      content: documentationContent,
      headingList,
      logger,
      path,
    })
    if (!serialized) {
      logger.error(`Serialization failed for ${path}`)
      return { notFound: true }
    }
    // Allow PUBLISHED and CHANGED status documents to be visible
    const status = serialized.frontmatter?.status as string
    if (!['PUBLISHED', 'CHANGED'].includes(status)) {
      logger.warn(
        `Document status is not allowed for ${path}. Status: ${status}.'
        )}`
      )
      return { notFound: true }
    }

    const contributors = await fetchFileContributors(branch, path)

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
        serialized: JSON.parse(JSON.stringify(serialized)),
        sidebarfallback,
        parentsArray,
        headingList,
        contributors,
        path,
        seeAlsoData,
        breadcrumbList,
        branch,
        sectionSelected,
        content: documentationContent,
      },
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${params?.slug}:\n${error}`)
    return { notFound: true }
  }
}

export default TroubleshootingPage
