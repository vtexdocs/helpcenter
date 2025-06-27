import Head from 'next/head'
import { useEffect, useState, useContext, useRef } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next' // MODIFIED: Changed GetServerSideProps to GetStaticProps
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import jp from 'jsonpath'
import ArticlePagination from 'components/article-pagination'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'
import { remarkCodeHike } from '@code-hike/mdx'
import remarkImages from 'utils/remark_plugins/plaiceholder'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import Contributors from 'components/contributors'
import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import SeeAlsoSection from 'components/see-also-section'
import { Item, LibraryContext, TableOfContents } from '@vtexdocs/components'
import Breadcrumb from 'components/breadcrumb'

import getHeadings from 'utils/getHeadings'
import getNavigation from 'utils/getNavigation'
import getGithubFile from 'utils/getGithubFile' // ADDED: Import getGithubFile
import {
  getDocsPaths as getTracksPaths,
  // getStaticPathsForDocType, // Removed unused import
} from 'utils/getDocsPaths'
import replaceMagicBlocks from 'utils/replaceMagicBlocks'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/documentation-page'
import getFileContributors, {
  ContributorsType,
} from 'utils/getFileContributors' // MODIFIED: Import getFileContributors as default

import { getLogger } from 'utils/logging/log-util'
import {
  flattenJSON,
  getKeyByValue,
  getParents,
  localeType,
} from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'

import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'

import theme from 'styles/code-hike-theme'
import TimeToRead from 'components/TimeToRead'
import { getBreadcrumbsList } from 'utils/getBreadcrumbsList'
import CopyLinkButton from 'components/copy-link-button'

// Initialize in getStaticProps
let docsPathsGLOBAL: Record<string, { locale: string; path: string }[]> | null =
  null

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
  const [headings, setHeadings] = useState<Item[]>([])
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const { setActiveSidebarElement } = useContext(LibraryContext)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setActiveSidebarElement(slug)
    setHeadings(headingList)
  }, [serialized.frontmatter])

  return (
    <>
      <Head>
        <title>{serialized.frontmatter?.title as string}</title>
        <meta name="docsearch:doctype" content="tracks" />
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
                  Boolean(serialized.frontmatter?.hidePaginationNext) || false
                }
                hidePaginationPrevious={
                  Boolean(serialized.frontmatter?.hidePaginationPrevious) ||
                  false
                }
                pagination={pagination}
              />
            )}
            {serialized.frontmatter?.seeAlso && (
              <SeeAlsoSection docs={seeAlsoData} />
            )}
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

interface PreviewData {
  branch?: string
}

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
  preview,
  previewData,
}) => {
  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as PreviewData).branch || 'main'
      : 'main'
  const branch = preview ? previewBranch : 'main'

  const slug = params?.slug as string
  const langFromParams = params?.lang as string | undefined
  const currentLocale: localeType = (langFromParams ||
    locale ||
    'en') as localeType

  if (!docsPathsGLOBAL) {
    docsPathsGLOBAL = await getTracksPaths('tracks')
  }
  const docsPaths =
    preview || process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
      ? await getTracksPaths('tracks', branch)
      : docsPathsGLOBAL

  const logger = getLogger('TracksPage-GetStaticProps') // MODIFIED: More specific logger name

  const pathEntry = docsPaths[slug]?.find((e) => e.locale === currentLocale)

  if (!pathEntry?.path) {
    logger.info(
      `Path not found for slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
    )
    return { notFound: true, revalidate: 3600 }
  }
  const resolvedPath = pathEntry.path

  // MODIFIED: Use getGithubFile to fetch documentation content
  let documentationContent: string | null = null
  try {
    documentationContent = await getGithubFile(
      'vtexdocs',
      'help-center-content',
      branch,
      resolvedPath
    )
  } catch (err) {
    logger.error(
      `Error fetching content for ${resolvedPath} on branch ${branch}: ${err}`
    )
    return { notFound: true, revalidate: 3600 }
  }

  documentationContent = documentationContent || ''

  // MODIFIED: Use getFileContributors to fetch contributors
  let contributors: ContributorsType[] = []
  try {
    const fetchedContributors = await getFileContributors(
      'vtexdocs',
      'help-center-content',
      branch,
      resolvedPath
    )
    // Ensure fetchedContributors is an array before assigning
    if (Array.isArray(fetchedContributors)) {
      contributors = fetchedContributors
    } else {
      logger.info(
        `Fetched contributors is not an array for ${resolvedPath} on branch ${branch}. Received: ${typeof fetchedContributors}`
      )
    }
  } catch (err) {
    logger.info(
      `Error fetching contributors for ${resolvedPath} on branch ${branch}: ${err}`
    )
  }

  let format: 'md' | 'mdx' = 'mdx'

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

    // Allow PUBLISHED and CHANGED status documents to be visible
    const allowedStatuses = ['PUBLISHED', 'CHANGED']
    const status = serialized.frontmatter?.status as string

    if (status && !allowedStatuses.includes(status)) {
      logger.info(
        `Document status is not allowed for ${resolvedPath}. Status: ${status}, Allowed: ${allowedStatuses.join(
          ', '
        )}`
      )
      return {
        notFound: true,
      }
    }

    const sidebarfallback = await getNavigation()
    serialized = JSON.parse(JSON.stringify(serialized))

    logger.info(`Processing ${slug}`)
    const seeAlsoData: {
      url: string
      title: string
      category: string
    }[] = []
    const seeAlsoUrls = serialized.frontmatter?.seeAlso
      ? JSON.parse(JSON.stringify(serialized.frontmatter.seeAlso as string))
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
              title: serialized.frontmatter?.title
                ? (serialized.frontmatter.title as string)
                : seeAlsoUrl.split('/')[3],
              category: serialized.frontmatter?.category
                ? (serialized.frontmatter.category as string)
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

    // Extract slug strings for the current locale from navigation
    const docsListSlugObjects = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..slug`
    )
    const docsListNameObjects = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..name`
    )

    // Convert slug objects to strings for the current locale
    const docsListSlug = docsListSlugObjects
      .map((slugObj: Record<string, string> | string) => {
        if (typeof slugObj === 'object' && slugObj[currentLocale]) {
          return slugObj[currentLocale]
        } else if (typeof slugObj === 'string') {
          return slugObj
        }
        // Fallback to 'en' if current locale not found
        return (slugObj as Record<string, string>)?.en || null
      })
      .filter(Boolean)

    const docsListName = docsListNameObjects.map(
      (nameObj: Record<string, string> | string) => {
        if (typeof nameObj === 'object') {
          return nameObj
        }
        // If it's already a string, wrap it in an object for consistency
        return { [currentLocale]: nameObj as string }
      }
    )

    const indexOfSlug = docsListSlug.indexOf(slug)

    logger.info(
      `Slug matching for ${slug}: found at index ${indexOfSlug} in ${docsListSlug.length} total docs`
    )

    const pagination = {
      previousDoc: {
        slug:
          indexOfSlug > 0 && docsListSlug[indexOfSlug - 1]
            ? docsListSlug[indexOfSlug - 1]
            : null,
        name:
          indexOfSlug > 0 && docsListName[indexOfSlug - 1]
            ? docsListName[indexOfSlug - 1][currentLocale] ||
              docsListName[indexOfSlug - 1]['en']
            : null,
      },
      nextDoc: {
        slug:
          indexOfSlug >= 0 &&
          indexOfSlug < docsListSlug.length - 1 &&
          docsListSlug[indexOfSlug + 1]
            ? docsListSlug[indexOfSlug + 1]
            : null,
        name:
          indexOfSlug >= 0 &&
          indexOfSlug < docsListSlug.length - 1 &&
          docsListName[indexOfSlug + 1]
            ? docsListName[indexOfSlug + 1][currentLocale] ||
              docsListName[indexOfSlug + 1]['en']
            : null,
      },
    }

    const flattenedSidebar = flattenJSON(sidebarfallback)
    const isListed: boolean = getKeyByValue(flattenedSidebar, slug)
      ? true
      : false
    const keyPath = getKeyByValue(flattenedSidebar, slug)
    const parentsArray: string[] = []
    const parentsArrayName: string[] = []
    const parentsArrayType: string[] = []
    let sectionSelected = ''
    if (keyPath) {
      sectionSelected = flattenedSidebar[`${keyPath[0]}.documentation`]
      getParents(
        keyPath,
        'name',
        flattenedSidebar,
        currentLocale,
        parentsArrayName
      )
      getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
      if (indexOfSlug >= 0 && docsListName[indexOfSlug]) {
        const currentDocName =
          docsListName[indexOfSlug][currentLocale] ||
          docsListName[indexOfSlug]['en']
        if (currentDocName) {
          parentsArrayName.push(currentDocName)
          logger.info(
            `Added document name to breadcrumbs: ${currentDocName} for slug: ${slug}`
          )
        } else {
          logger.warn(
            `Document name not found for slug: ${slug} in locale: ${currentLocale}. Available locales: ${Object.keys(
              docsListName[indexOfSlug] || {}
            ).join(', ')}`
          )
        }
      } else {
        logger.warn(
          `Document not found in navigation for slug: ${slug} (index: ${indexOfSlug})`
        )
      }
    }

    try {
      if (resolvedPath.endsWith('.md')) {
        documentationContent = escapeCurlyBraces(documentationContent)
        documentationContent = replaceHTMLBlocks(documentationContent)
        documentationContent = await replaceMagicBlocks(documentationContent)
      }
    } catch (error) {
      logger.error(`Error processing markdown for ${resolvedPath}: ${error}`) // MODIFIED: Improved error logging
      format = 'md'
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
        serialized,
        // ❌ REMOVED: sidebarfallback (3.4MB navigation no longer sent to client)
        headingList,
        contributors,
        path: resolvedPath,
        seeAlsoData,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        locale: currentLocale,
      },
      revalidate: 3600,
    }
  } catch (error) {
    logger.error(`Error while processing ${resolvedPath}\\n${error}`)
    return {
      notFound: true,
      revalidate: 3600,
    }
  }
}

export default TrackPage
