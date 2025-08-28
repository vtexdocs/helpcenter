import Head from 'next/head'
import { useEffect, useContext, useRef } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import { Item, TableOfContents } from '@vtexdocs/components'

import getNavigation from 'utils/getNavigation'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/announcement-page'
import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import { flattenJSON, getKeyByValue, getParents } from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'
import Author from 'components/author'
import { useIntl } from 'react-intl'
import MoreArticlesSection from 'components/more-articles-section'
import Breadcrumb from 'components/breadcrumb'
import { AnnouncementDataElement } from 'utils/typings/types'
import DateText from 'components/date-text'
import CopyLinkButton from 'components/copy-link-button'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { contentfulAuthor } from 'utils/constants'
import { fetchGitHubUser } from 'utils/fetchGithubUser'
// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

interface Props {
  sectionSelected: string
  parentsArray: string[]
  content: string
  serialized: MDXRemoteSerializeResult
  sidebarfallback: any //eslint-disable-line
  contributor: ContributorsType
  path: string
  headingList: Item[]
  seeAlsoData: AnnouncementDataElement[]
  branch: string
}

const AnnouncementPage: NextPage<Props> = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  slug,
  serialized,
  path,
  headingList,
  contributor,
  seeAlsoData,
  branch,
}) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setBranchPreview(branch)
  }, [slug])

  const breadcrumb = {
    slug: `/announcements`,
    name: intl.formatMessage({ id: 'announcements_page.title' }),
    type: 'markdown',
  }

  const createdAtDate = serialized.frontmatter?.createdAt
    ? new Date(String(serialized.frontmatter?.createdAt))
    : undefined

  const updatedAtDate = serialized.frontmatter?.updatedAt
    ? new Date(String(serialized.frontmatter?.updatedAt))
    : undefined

  return (
    <>
      <Head>
        <meta name="docsearch:doctype" content="announcements" />
        {serialized.frontmatter?.title && (
          <>
            <title>{serialized.frontmatter?.title as string}</title>
            <meta
              name="docsearch:doctitle"
              content={serialized.frontmatter.title as string}
            />
          </>
        )}
      </Head>
      <DocumentContextProvider headings={headingList}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.articleBox}>
            <Box sx={styles.contentContainer}>
              <Box sx={styles.textContainer}>
                <article ref={articleRef}>
                  <header>
                    <Breadcrumb breadcrumbList={[breadcrumb]} />
                    <Text sx={styles.documentationTitle} className="title">
                      {serialized.frontmatter?.title}
                    </Text>
                    <Box sx={styles.divider}></Box>
                    <Flex sx={styles.flexContainer}>
                      <Box>
                        {contributor && <Author contributor={contributor} />}
                        {createdAtDate && updatedAtDate && (
                          <Flex sx={styles.date}>
                            <DateText
                              createdAt={createdAtDate}
                              updatedAt={updatedAtDate}
                            />
                          </Flex>
                        )}
                      </Box>
                      <CopyLinkButton />
                    </Flex>
                  </header>
                  <MarkdownRenderer serialized={serialized} />
                </article>
              </Box>
            </Box>
            <FeedbackSection docPath={path} slug={slug} />
            {serialized.frontmatter?.seeAlso && (
              <MoreArticlesSection docs={seeAlsoData} />
            )}
          </Box>
          <Box sx={styles.rightContainer}>
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
  const logger = getLogger('News')

  const {
    sectionSelected,
    branch,
    slug,
    currentLocale,
    docsPaths,
    mdFileExists,
  } = await extractStaticPropsParams({
    sectionSelected: 'announcements',
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

  const sidebarfallback = await getNavigation()
  const flattenedSidebar = flattenJSON(sidebarfallback)
  const keyPath = getKeyByValue(flattenedSidebar, slug) as string
  const parentsArray: string[] = []
  const path = docsPaths[slug]?.find((e) => e.locale === locale)?.path

  if (!path) {
    logger.warn(
      `Markdown file (slug: ${slug}, locale: ${currentLocale}, branch: ${branch}) exists for another locale. Redirecting to localized version.`
    )
    if (keyPath) {
      return redirectToLocalizedUrl(
        keyPath,
        currentLocale,
        flattenedSidebar,
        'announcements'
      )
    }
    return { notFound: true }
  }

  try {
    if (keyPath) {
      getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
      parentsArray.push(slug)
    }

    const rawContent = await fetchRawMarkdown(sectionSelected, branch, path)
    const documentationContent = escapeCurlyBraces(
      replaceHTMLBlocks(rawContent)
    )

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

    const allowedStatuses = ['PUBLISHED', 'CHANGED']
    const hasAllowedStatus = allowedStatuses.includes(
      serialized.frontmatter.status as string
    )

    if (!hasAllowedStatus) {
      return { notFound: true }
    }
    const authorId = serialized.frontmatter?.author as string
    const githubLogin = contentfulAuthor[authorId]
    const contributor = githubLogin ? await fetchGitHubUser(githubLogin) : null

    logger.info(`Processing ${slug}`)

    const seeAlsoData: AnnouncementDataElement[] = []
    const seeAlsoUrls = serialized?.frontmatter?.seeAlso
      ? JSON.parse(JSON.stringify(serialized.frontmatter.seeAlso as string))
      : []
    await Promise.all(
      seeAlsoUrls.map(async (seeAlsoUrl: string) => {
        const seeAlsoPath = docsPaths[seeAlsoUrl]?.find(
          (e) => e.locale === locale
        )?.path
        if (seeAlsoPath) {
          try {
            const documentationContent =
              (await fetch(
                `https://raw.githubusercontent.com/vtexdocs/help-center-content/main/${seeAlsoPath}`
              )
                .then((res) => res.text())
                .catch((err) => console.log(err))) || ''

            const serialized = await serialize(documentationContent, {
              parseFrontmatter: true,
            })
            seeAlsoData.push({
              url: seeAlsoUrl,
              title: String(serialized.frontmatter?.title) ?? seeAlsoUrl,
              createdAt: String(serialized.frontmatter?.createdAt) ?? '',
              updatedAt: String(serialized.frontmatter?.updatedAt) ?? '',
              status: String(serialized.frontmatter?.status) ?? '',
            })
          } catch (error) {}
        }
      })
    )

    return {
      props: {
        sectionSelected,
        parentsArray,
        slug,
        serialized: JSON.parse(JSON.stringify(serialized)),
        sidebarfallback,
        headingList,
        contributor,
        path,
        seeAlsoData,
        branch,
        locale,
      },
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${path}\n${error}`)
    return { notFound: true }
  }
}

export default AnnouncementPage
