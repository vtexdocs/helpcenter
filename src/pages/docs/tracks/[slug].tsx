import Head from 'next/head'
import { useEffect, useState, useContext, useRef } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import jp from 'jsonpath'
import ArticlePagination from 'components/article-pagination'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'

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
// import getGithubFile from 'utils/getGithubFile'
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
  getKeyByValue,
  getParents,
  localeType,
} from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'
// import { ParsedUrlQuery } from 'querystring'
import { useIntl } from 'react-intl'
import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'
import CopyLinkButton from 'components/copy-link-button'

const docsPathsGLOBAL = await getTracksPaths('tracks')

interface Props {
  sectionSelected: string
  parentsArray: string[]
  breadcrumbList: { slug: string; name: string; type: string }[]
  content: string
  serialized: MDXRemoteSerializeResult
  sidebarfallback: any //eslint-disable-line
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
  const intl = useIntl()
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
              <article ref={articleRef}>
                <header>
                  <Breadcrumb breadcrumbList={breadcrumbList} />
                  <Flex sx={styles.flexContainer}>
                    <Text sx={styles.documentationTitle} className="title">
                      {serialized.frontmatter?.title}
                    </Text>

                    <Flex sx={styles.infoContainer}>
                      <Text sx={styles.readingTime}>
                        {intl.formatMessage(
                          {
                            id: 'documentation_reading_time.text',
                            defaultMessage: '',
                          },
                          { minutes: serialized.frontmatter?.readingTime }
                        )}
                      </Text>
                      <CopyLinkButton />
                    </Flex>
                  </Flex>
                </header>
                <MarkdownRenderer serialized={serialized} />
              </article>
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
  // const slugs: { [slug: string]: { locale: string; path: string }[] } =
  //   await getTracksPaths('tracks')

  // const paths: (
  //   | string
  //   | {
  //       params: ParsedUrlQuery
  //       locale?: string | undefined
  //     }
  // )[] = []
  // Object.entries(slugs).forEach(([slug, locales]) => {
  //   locales.forEach(({ locale }) => {
  //     paths.push({ params: { slug }, locale })
  //   })
  // })
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
  const docsPaths =
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
      ? docsPathsGLOBAL
      : await getTracksPaths('tracks', branch)

  const logger = getLogger('Start here')

  const path = docsPaths[slug].find((e) => e.locale === locale)?.path

  if (!path) {
    return {
      notFound: true,
    }
  }

  // let documentationContent = await getGithubFile(
  //   'vtexdocs',
  //   'help-center-content',
  //   branch,
  //   path
  // )
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

  // const contributors = []
  // const contributors =
  //   (await getFileContributors(
  //     'vtexdocs',
  //     'help-center-content',
  //     branch,
  //     path
  //   ).catch((err) => {
  //     console.log(err)
  //   })) || []

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

            // const documentationContent = await getGithubFile(
            //   'vtexdocs',
            //   'help-center-content',W
            //   'main',
            //   seeAlsoPath
            // )

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

    const docsListSlug = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..slug`
    )
    const docsListName = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..name`
    )
    const docsListType = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..type`
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
      getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
      parentsArray.push(slug)
      getParents(
        keyPath,
        'name',
        flattenedSidebar,
        currentLocale,
        parentsArrayName
      )
      parentsArrayName.push(docsListName[indexOfSlug][currentLocale])
      getParents(
        keyPath,
        'type',
        flattenedSidebar,
        currentLocale,
        parentsArrayType
      )
      parentsArrayType.push(docsListType[indexOfSlug])

      if (serialized.frontmatter) {
        serialized.frontmatter.title = `${
          docsListName[indexOfSlug][currentLocale].split(' ')[0]
        } ${serialized.frontmatter.title}`
      }
    }

    const breadcrumbList: { slug: string; name: string; type: string }[] = []
    parentsArrayName.forEach((_el: string, idx: number) => {
      breadcrumbList.push({
        slug: `/docs/tracks/${parentsArray[idx]}`,
        name: parentsArrayName[idx],
        type: parentsArrayType[idx],
      })
    })

    return {
      props: {
        sectionSelected,
        parentsArray,
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
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${path}\n${error}`)
    return {
      notFound: true,
    }
  }
}

export default TrackPage
