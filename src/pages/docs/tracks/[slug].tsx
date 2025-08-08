import Head from 'next/head'
import { useEffect, useContext, useRef } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next' // MODIFIED: Changed GetServerSideProps to GetStaticProps
import ArticlePagination from 'components/article-pagination'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import Contributors from 'components/contributors'
import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import SeeAlsoSection from 'components/see-also-section'
import { Item, TableOfContents } from '@vtexdocs/components'
import Breadcrumb from 'components/breadcrumb'

import {
  getDocsPaths as getTracksPaths,
  // getStaticPathsForDocType, // Removed unused import
} from 'utils/getDocsPaths'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/documentation-page'
import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import { getParents } from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'

import TimeToRead from 'components/TimeToRead'
import { getBreadcrumbsList } from 'utils/getBreadcrumbsList'
import CopyLinkButton from 'components/copy-link-button'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { getSidebarMetadata } from 'utils/getSidebarMetadata'
import { getPagination } from 'utils/getPagination'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

interface Props {
  sectionSelected: string
  parentsArray: string[]
  breadcrumbList: { slug: string; name: string; type: string }[]
  content: string
  serialized: MDXRemoteSerializeResult
  // ❌ REMOVED: sidebarfallback (navigation now loaded client-side)
  contributors: ContributorsType[]
  path: string
  headingList: Item[]
  seeAlsoData: {
    url: string
    title: string
    category: string
  }[]
  pagination: {
    previousDoc: {
      slug: string | null
      name: string | null
    }
    nextDoc: {
      slug: string | null
      name: string | null
    }
  }
  isListed: boolean
  branch: string
}

const TrackPage: NextPage<Props> = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  slug,
  serialized,
  path,
  headingList,
  contributors,
  seeAlsoData,
  pagination,
  isListed,
  breadcrumbList,
  branch,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setBranchPreview(branch)
  }, [slug])

  return (
    <>
      <Head>
        <meta name="docsearch:doctype" content="tracks" />
        {serialized?.frontmatter?.title && (
          <>
            <title>{serialized?.frontmatter?.title as string}</title>
            <meta
              name="docsearch:doctitle"
              content={serialized?.frontmatter.title as string}
            />
          </>
        )}
        {serialized?.frontmatter?.hidden && (
          <meta name="robots" content="noindex" />
        )}
        {serialized?.frontmatter?.excerpt && (
          <meta
            property="og:description"
            content={serialized?.frontmatter?.excerpt as string}
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
                        {serialized?.frontmatter?.title}
                      </Text>
                      {serialized?.frontmatter?.readingTime && (
                        <TimeToRead
                          minutes={
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (serialized?.frontmatter.readingTime as any)
                              ?.text ||
                            String(serialized?.frontmatter.readingTime)
                          }
                        />
                      )}
                      {/* Adiciona a propriedade justifyContent ao Flex para alinhar o botão à direita */}
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
                  </header>
                  <MarkdownRenderer serialized={serialized} />
                </article>
              </Box>
            </Box>

            <Box sx={styles.bottomContributorsContainer}>
              <Box sx={styles.bottomContributorsDivider} />
              <Contributors contributors={contributors} />
            </Box>

            <FeedbackSection docPath={path} slug={slug} />
            {isListed && (
              <ArticlePagination
                hidePaginationNext={
                  Boolean(serialized?.frontmatter?.hidePaginationNext) || false
                }
                hidePaginationPrevious={
                  Boolean(serialized?.frontmatter?.hidePaginationPrevious) ||
                  false
                }
                pagination={pagination}
              />
            )}
            {serialized?.frontmatter?.seeAlso && (
              <SeeAlsoSection docs={seeAlsoData} />
            )}
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
  // Use getTracksPaths to get all available slugs for tracks
  const docsPaths = await getTracksPaths('tracks')
  // Generate a path for each slug/locale combination
  const paths = Object.entries(docsPaths).flatMap(([slug, entries]) =>
    entries.map(({ locale }) => ({
      params: { slug },
      locale,
    }))
  )
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
  preview,
  previewData,
}) => {
  const logger = getLogger('TracksPage-GetStaticProps') // MODIFIED: More specific logger name
  const {
    sectionSelected,
    branch,
    slug,
    currentLocale,
    docsPaths,
    mdFileExists,
    mdFilePath,
  } = await extractStaticPropsParams({
    sectionSelected: 'tracks',
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
        'tracks'
      )
    }
    return { notFound: true }
  }

  if (mdFileExists) {
    const rawContent = await fetchRawMarkdown(
      sectionSelected,
      branch,
      mdFilePath
    )
    const documentationContent = escapeCurlyBraces(
      replaceHTMLBlocks(rawContent)
    )

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
    const seeAlsoUrls = serialized?.frontmatter?.seeAlso
      ? JSON.parse(JSON.stringify(serialized?.frontmatter.seeAlso as string))
      : []
    await Promise.all(
      seeAlsoUrls.map(async (seeAlsoUrl: string) => {
        const seeAlsoPath = docsPaths[seeAlsoUrl.split('/')[3]].find(
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
              title: serialized?.frontmatter?.title
                ? (serialized?.frontmatter.title as string)
                : seeAlsoUrl.split('/')[3],
              category: serialized?.frontmatter?.category
                ? (serialized?.frontmatter.category as string)
                : seeAlsoUrl.split('/')[2],
            })
          } catch (error) {}
        } else if (seeAlsoUrl.startsWith('/docs')) {
          seeAlsoData.push({
            url: seeAlsoUrl,
            title: seeAlsoUrl.split('/')[3],
            category: seeAlsoUrl.split('/')[2],
          })
        }
      })
    )

    const { pagination, indexOfSlug, docsListName } = getPagination({
      sidebarfallback,
      currentLocale,
      slug,
      logger,
    })

    const isListed = !!keyPath
    const parentsArray: string[] = []
    const parentsArrayName: string[] = []
    const parentsArrayType: string[] = []
    if (isListed) {
      getParents(
        keyPath,
        'name',
        flattenedSidebar,
        currentLocale,
        parentsArrayName
      )
      getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)

      const currentDoc = docsListName[indexOfSlug]
      const currentDocName = currentDoc?.[currentLocale] || currentDoc?.['en']

      if (indexOfSlug >= 0 && currentDocName) {
        parentsArrayName.push(currentDocName)
        logger.info(
          `Added document name to breadcrumbs: ${currentDocName} for slug: ${slug}`
        )
      } else if (indexOfSlug >= 0) {
        logger.warn(
          `Document name not found for slug: ${slug} in locale: ${currentLocale}. Available locales: ${Object.keys(
            currentDoc || {}
          ).join(', ')}`
        )
      }
    }

    // Ensure parentsArray does not contain undefined values
    parentsArray.push(slug)
    const sanitizedParentsArray = parentsArray.map((item) =>
      item === undefined ? null : item
    )

    const breadcrumbList: { slug: string; name: string; type: string }[] =
      getBreadcrumbsList(
        parentsArray,
        parentsArrayName,
        parentsArrayType,
        'tracks'
      )

    return {
      props: {
        sectionSelected,
        parentsArray: sanitizedParentsArray,
        slug,
        serialized: JSON.parse(JSON.stringify(serialized)),
        // ❌ REMOVED: sidebarfallback (3.4MB navigation no longer sent to client)
        headingList,
        contributors,
        path: mdFilePath,
        seeAlsoData,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        locale: currentLocale,
      },
      revalidate: 3600,
    }
  }
  logger.error(`Markdown file does not exist for ${slug}`)
  return { notFound: true }
}

export default TrackPage
