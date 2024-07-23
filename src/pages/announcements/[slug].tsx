import Head from 'next/head'
import { useEffect, useState, useContext, useRef } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'

import remarkImages from 'utils/remark_plugins/plaiceholder'

import { Box, Flex, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import { Item, LibraryContext, TableOfContents } from '@vtexdocs/components'

import getHeadings from 'utils/getHeadings'
import getNavigation from 'utils/getNavigation'
import { getDocsPaths as getAnnouncementsPaths } from 'utils/getDocsPaths'
import replaceMagicBlocks from 'utils/replaceMagicBlocks'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/announcement-page'
import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import {
  flattenJSON,
  getKeyByValue,
  getParents,
  localeType,
} from 'utils/navigation-utils'
import { MarkdownRenderer } from '@vtexdocs/components'
import ShareButton from 'components/share-button'
import Author from 'components/author'
import { useIntl } from 'react-intl'
import MoreArticlesSection from 'components/more-articles-section'
import Breadcrumb from 'components/breadcrumb'
import { AnnouncementDataElement } from 'utils/typings/types'
import DateText from 'components/date-text'
const docsPathsGLOBAL = await getAnnouncementsPaths('announcements')

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
  const [headings, setHeadings] = useState<Item[]>([])
  const [url, setUrl] = useState('')
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const { setActiveSidebarElement } = useContext(LibraryContext)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setActiveSidebarElement(slug)
    setHeadings(headingList)
  }, [serialized.frontmatter])

  useEffect(() => {
    if (window) setUrl(window.location.href)
  }, [])

  const breadcrumb = {
    slug: '/announcements',
    name: intl.formatMessage({ id: 'announcements_page.title' }),
    type: 'category',
  }

  const createdAtDate = serialized.frontmatter?.createdAt
    ? new Date(serialized.frontmatter?.createdAt)
    : undefined

  const updatedAtDate = serialized.frontmatter?.updatedAt
    ? new Date(serialized.frontmatter?.updatedAt)
    : undefined

  return (
    <>
      <Head>
        <title>{serialized.frontmatter?.title as string}</title>
        <meta name="docsearch:doctype" content="announcements" />
        <meta name="docsearch:slug" content={slug} />
      </Head>
      <DocumentContextProvider headings={headings}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.articleBox}>
            <Box sx={styles.contentContainer}>
              <article ref={articleRef}>
                <header>
                  <Breadcrumb breadcrumbList={[breadcrumb]} />
                  <Text sx={styles.documentationTitle} className="title">
                    {serialized.frontmatter?.title}
                  </Text>
                  <Box sx={styles.divider}></Box>
                  <Flex sx={styles.flexContainer}>
                    <Box>
                      <Author contributor={contributor} />
                      {createdAtDate && updatedAtDate && (
                        <Flex sx={styles.date}>
                          <DateText
                            createdAt={createdAtDate}
                            updatedAt={updatedAtDate}
                          />
                        </Flex>
                      )}
                    </Box>
                    {url && <ShareButton url={url} />}
                  </Flex>
                </header>
                <MarkdownRenderer serialized={serialized} />
              </article>
            </Box>
            <FeedbackSection docPath={path} slug={slug} />
            {serialized.frontmatter?.seeAlso && (
              <MoreArticlesSection docs={seeAlsoData} />
            )}
          </Box>
          <Box sx={styles.rightContainer}>
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
      : await getAnnouncementsPaths('announcements', branch)

  const logger = getLogger('Announcements')

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

  const contributor = contributors[0]

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
    const seeAlsoData: AnnouncementDataElement[] = []
    const seeAlsoUrls = serialized.frontmatter?.seeAlso
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
              title: serialized.frontmatter?.title ?? seeAlsoUrl,
              createdAt: String(serialized.frontmatter?.createdAt) ?? '',
              updatedAt: String(serialized.frontmatter?.updatedAt) ?? '',
            })
          } catch (error) {}
        }
      })
    )

    const flattenedSidebar = flattenJSON(sidebarfallback)
    const keyPath = getKeyByValue(flattenedSidebar, slug)
    const parentsArray: string[] = []
    let sectionSelected = ''
    if (keyPath) {
      sectionSelected = flattenedSidebar[`${keyPath[0]}.documentation`]
      getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
      parentsArray.push(slug)
    }

    return {
      props: {
        sectionSelected,
        parentsArray,
        slug,
        serialized,
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
    return {
      notFound: true,
    }
  }
}

export default AnnouncementPage
