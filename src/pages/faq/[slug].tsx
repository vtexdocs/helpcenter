import Head from 'next/head'
import { useEffect, useContext, useRef } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import Contributors from 'components/contributors'
import OnThisPage from 'components/on-this-page'
import { Item, TableOfContents } from '@vtexdocs/components'
import FeedbackSection from 'components/feedback-section'
import Breadcrumb from 'components/breadcrumb'
import TimeToRead from 'components/TimeToRead'

import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/documentation-page'
import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import { getParents } from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'
import { getMessages } from 'utils/get-messages'
import DateText from 'components/date-text'
import CopyLinkButton from 'components/copy-link-button'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { getSidebarMetadata } from 'utils/getSidebarMetadata'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

interface Props {
  breadcrumbList: { slug: string; name: string; type: string }[]
  serialized: MDXRemoteSerializeResult
  contributors: ContributorsType[]
  branch: string
  path: string
  slug: string
  headingList: Item[]
}

const FaqPage: NextPage<Props> = ({
  serialized,
  contributors,
  breadcrumbList,
  branch,
  path,
  slug,
  headingList,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setBranchPreview(branch)
  }, [slug])

  const createdAtDate = serialized.frontmatter?.createdAt
    ? new Date(String(serialized.frontmatter?.createdAt))
    : undefined

  const updatedAtDate = serialized.frontmatter?.updatedAt
    ? new Date(String(serialized.frontmatter?.updatedAt))
    : undefined

  return (
    <>
      <Head>
        <meta name="docsearch:doctype" content="faq" />
        {serialized.frontmatter?.title && (
          <>
            <title>{serialized.frontmatter?.title as string}</title>
            <meta
              name="docsearch:doctitle"
              content={serialized.frontmatter.title as string}
            />
          </>
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

                      {/* Verifica se as datas de criação e atualização estão disponíveis */}
                      {createdAtDate && updatedAtDate && (
                        <Flex sx={{ alignItems: 'center' }}>
                          <DateText
                            createdAt={createdAtDate}
                            updatedAt={updatedAtDate}
                          />

                          {/* Coloca o botão à direita das datas */}
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
  const logger = getLogger('FAQs')
  const {
    sectionSelected,
    branch,
    slug,
    currentLocale,
    mdFileExists,
    mdFilePath,
  } = await extractStaticPropsParams({
    sectionSelected: 'faq',
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

  const { keyPath, flattenedSidebar, sidebarfallback } =
    await getSidebarMetadata(sectionSelected, slug)

  if (!mdFilePath) {
    logger.warn(
      `Markdown file (slug: ${slug}, locale: ${currentLocale}, branch: ${branch}) exists for another locale. Redirecting to localized version.`
    )
    if (keyPath) {
      return redirectToLocalizedUrl(
        keyPath,
        currentLocale,
        flattenedSidebar,
        'faq'
      )
    }
    return { notFound: true }
  }

  if (mdFileExists) {
    const parentsArray: string[] = []

    if (keyPath) {
      getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
      parentsArray.push(slug)
    }

    const rawContent = await fetchRawMarkdown(
      sectionSelected,
      branch,
      mdFilePath
    )
    const documentationContent = escapeCurlyBraces(
      replaceHTMLBlocks(rawContent)
    )

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
        slug: '/faq/',
        name: getMessages()[currentLocale]['landing_page_faq.title'],
        type: 'category',
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
        sidebarfallback,
        headingList,
        contributors,
        path: mdFilePath,
        seeAlsoData,
        breadcrumbList,
        branch,
      },
      revalidate: 600,
    }
  }
  logger.error(`Markdown file does not exist for ${slug}`)
  return { notFound: true }
}

export default FaqPage
