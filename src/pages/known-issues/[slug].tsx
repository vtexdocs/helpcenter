import Head from 'next/head'
import { useEffect, useState, useContext, useRef } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import Contributors from 'components/contributors'
import OnThisPage from 'components/on-this-page'
import { Item, TableOfContents } from '@vtexdocs/components'
import Breadcrumb from 'components/breadcrumb'
import TimeToRead from 'components/TimeToRead'

import getNavigation from 'utils/getNavigation'
// import getGithubFile from 'utils/getGithubFile'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/documentation-page'
import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import {
  flattenJSON,
  getArticleParentsArray,
  getKeyByValue,
} from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'
// import { ParsedUrlQuery } from 'querystring'

import { getMessages } from 'utils/get-messages'
import Tag from 'components/tag'
import DateText from 'components/date-text'
import CopyLinkButton from 'components/copy-link-button'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { fetchFileContributors } from 'utils/fetchFileContributors'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

interface Props {
  breadcrumbList: { slug: string; name: string; type: string }[]
  serialized: MDXRemoteSerializeResult
  contributors: ContributorsType[]
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
    ? new Date(String(serialized.frontmatter?.createdAt))
    : undefined

  const updatedAtDate = serialized.frontmatter?.updatedAt
    ? new Date(String(serialized.frontmatter?.updatedAt))
    : undefined

  return (
    <>
      <Head>
        <title>{serialized.frontmatter?.title as string}</title>
        <meta name="docsearch:doctype" content="known-issues" />
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
  const logger = getLogger('Known Issues')
  const {
    sectionSelected,
    branch,
    slug,
    currentLocale,
    docsPaths,
    mdFileExists,
  } = await extractStaticPropsParams({
    sectionSelected: 'known-issues',
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
  try {
    const path = docsPaths[slug]?.find((e) => e.locale === currentLocale)?.path
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
          'known-issues'
        )
      }
      return { notFound: true }
    }

    const rawContent = await fetchRawMarkdown(branch, path)
    const documentationContent = replaceHTMLBlocks(rawContent)

    let parentsArray: string[] = []

    if (keyPath) {
      parentsArray = getArticleParentsArray(
        keyPath,
        flattenedSidebar,
        currentLocale,
        slug
      )
    }

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

    const seeAlsoData: { url: string; title: string; category: string }[] = []

    const breadcrumbList: { slug: string; name: string; type: string }[] = [
      {
        slug: '/docs/known-issues/',
        name: getMessages()[currentLocale]['known_issues_page.title'],
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
        slug,
        serialized: JSON.parse(JSON.stringify(serialized)),
        sidebarfallback,
        headingList,
        parentsArray,
        contributors,
        path,
        seeAlsoData,
        breadcrumbList,
        branch,
      },
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${params?.slug}:\n${error}`)
    return { notFound: true }
  }
}

export default KnownIssuePage
