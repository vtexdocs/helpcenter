import Head from 'next/head'
import { useEffect, useState, useContext, useRef } from 'react'
import { GetServerSideProps, NextPage } from 'next'
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
import theme from 'styles/code-hike-theme'
import { remarkImages } from 'utils/remark_plugins/remarkImages'
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
import { getDocsPaths as getTracksPaths } from 'utils/getDocsPaths'
import replaceMagicBlocks from 'utils/replaceMagicBlocks'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'
import styles from 'styles/documentation-page'
import { ContributorsType } from 'utils/getFileContributors'
import { getLogger } from 'utils/logging/log-util'
import {
  flattenJSON,
  findSlugInSidebar,
  getParents,
  getLocalizedSlug,
  localeType,
  NavigationItem,
} from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'
import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'
import TimeToRead from 'components/TimeToRead'
import { getBreadcrumbsList } from 'utils/getBreadcrumbsList'
import CopyLinkButton from 'components/copy-link-button'

const docsPathsGLOBAL = await getTracksPaths('tracks')

interface Props {
  sectionSelected: string
  parentsArray: string[]
  breadcrumbList: { slug: string; name: string; type: string }[]
  content: string
  serialized: MDXRemoteSerializeResult
  sidebarfallback: NavigationItem[]
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
  slug: string
}

const TrackPage: NextPage<Props> = ({
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
                          minutes={serialized.frontmatter.readingTime}
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

export const getServerSideProps: GetServerSideProps = async ({
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
  const docsPaths =
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
      ? docsPathsGLOBAL
      : await getTracksPaths('tracks', branch)

  const logger = getLogger('Start here')

  // Check if slug exists in docsPaths
  if (!docsPaths[slug]) {
    logger.warn(`Slug '${slug}' not found in docsPaths for tracks`)
    return {
      notFound: true,
    }
  }

  const path = docsPaths[slug].find((e) => e.locale === locale)?.path

  if (!path) {
    return {
      notFound: true,
    }
  }

  let documentationContent =
    (await fetch(
      `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
    )
      .then((res) => res.text())
      .catch((err) => console.log(err))) || ''

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
      documentationContent = await replaceMagicBlocks(documentationContent)
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

    if (serialized.frontmatter?.status !== 'PUBLISHED') {
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

    // Process the JSONPath query to handle both string slugs and object slugs
    const docsListSlug = jp
      .query(sidebarfallback, `$..[?(@.type=='markdown')]..slug`)
      .map((slugValue) => getLocalizedSlug(slugValue, currentLocale))

    const docsListName = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..name`
    )

    const indexOfSlug = docsListSlug.indexOf(slug)
    const pagination = {
      previousDoc: {
        slug: docsListSlug[indexOfSlug - 1]
          ? docsListSlug[indexOfSlug - 1]
          : null,
        name: docsListName[indexOfSlug - 1]
          ? docsListName[indexOfSlug - 1][locale || 'en']
          : null,
      },
      nextDoc: {
        slug: docsListSlug[indexOfSlug + 1]
          ? docsListSlug[indexOfSlug + 1]
          : null,
        name: docsListName[indexOfSlug + 1]
          ? docsListName[indexOfSlug + 1][locale || 'en']
          : null,
      },
    }

    // Flatten the sidebar and find the slug
    const flattenedSidebar = flattenJSON(
      sidebarfallback as unknown as Record<string, unknown>
    )
    const slugKey = findSlugInSidebar(flattenedSidebar, slug)

    const isListed = Boolean(slugKey)

    // Extract the key path to use with getParents
    const keyPath = slugKey ? slugKey.split('.').slice(0, -1) : null

    const parentsArray: string[] = []
    const parentsArrayName: string[] = []
    const parentsArrayType: string[] = []
    let sectionSelected = ''

    if (keyPath) {
      sectionSelected = flattenedSidebar[
        `${keyPath[0]}.documentation`
      ] as string
      getParents(
        keyPath as string[],
        'name',
        flattenedSidebar,
        currentLocale,
        parentsArrayName
      )
      getParents(
        keyPath as string[],
        'slug',
        flattenedSidebar,
        currentLocale,
        parentsArray
      )

      if (
        docsListName[indexOfSlug] &&
        docsListName[indexOfSlug][currentLocale]
      ) {
        parentsArrayName.push(docsListName[indexOfSlug][currentLocale])
      } else {
        logger.warn(
          `Warning: docsListName or currentLocale not found for slug: ${slug}. Using fallback.`
        )
        // Use a fallback name instead of failing
        const fallbackName = slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        parentsArrayName.push(fallbackName)
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
        serialized,
        sidebarfallback,
        headingList,
        contributors,
        path,
        seeAlsoData,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        locale,
      },
    }
  } catch (error) {
    logger.error(`Error while processing ${path}\n${error}`)
    return {
      notFound: true,
    }
  }
}

export default TrackPage
