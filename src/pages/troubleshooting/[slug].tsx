import { Box, Flex, Text } from '@vtex/brand-ui'
import { Item, MarkdownRenderer, TableOfContents } from '@vtexdocs/components'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import Head from 'next/head'
import { useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import DocumentContextProvider from 'utils/contexts/documentContext'
import { ContributorsType } from 'utils/getFileContributors'
import styles from 'styles/documentation-page'
import Breadcrumb from 'components/breadcrumb'
import { PreviewContext } from 'utils/contexts/preview'
import DateText from 'components/date-text'
import Contributors from 'components/contributors'
import OnThisPage from 'components/on-this-page'
import { getDocsPaths as getTroubleshootingPaths } from 'utils/getDocsPaths'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { localeType } from 'utils/navigation-utils'
import { getLogger } from 'utils/logging/log-util'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'
import remarkImages from 'utils/remark_plugins/plaiceholder'
import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'
import getHeadings from 'utils/getHeadings'
import getNavigation from 'utils/getNavigation'
import { getMessages } from 'utils/get-messages'

interface Props {
  sectionSelected: string
  breadcrumbList: { slug: string; name: string; type: string }[]
  content: string
  serialized: MDXRemoteSerializeResult
  contributors: ContributorsType[]
  path: string
  headingList: Item[]
  branch: string
}

const docsPathsGLOBAL = await getTroubleshootingPaths('troubleshooting')

const TroubleshootingPage: NextPage<Props> = ({
  serialized,
  headingList,
  contributors,
  breadcrumbList,
  branch,
}: Props) => {
  const [headings, setHeadings] = useState<Item[]>([])
  const { setBranchPreview } = useContext(PreviewContext)
  const intl = useIntl()
  setBranchPreview(branch)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setHeadings(headingList)
  }, [serialized.frontmatter])

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
        <meta name="docsearch:doctype" content="Start here" />
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
                    <Text sx={styles.readingTime}>
                      {intl.formatMessage(
                        {
                          id: 'documentation_reading_time.text',
                          defaultMessage: '',
                        },
                        { minutes: serialized.frontmatter?.readingTime }
                      )}
                    </Text>
                    {createdAtDate && updatedAtDate && (
                      <DateText
                        createdAt={createdAtDate}
                        updatedAt={updatedAtDate}
                      />
                    )}
                  </Flex>
                </header>
                <MarkdownRenderer serialized={serialized} />
              </article>
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
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const slug = params?.slug as string
  const currentLocale: localeType = (locale ?? 'en') as localeType
  const docsPaths =
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
      ? docsPathsGLOBAL
      : await getTroubleshootingPaths('troubleshooting', branch)

  const logger = getLogger('Start here')

  const path = docsPaths[slug].find((e) => e.locale === currentLocale)?.path

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

  let format: 'md' | 'mdx' = 'mdx'
  try {
    if (path.endsWith('.md')) {
      documentationContent = escapeCurlyBraces(documentationContent)
      documentationContent = replaceHTMLBlocks(documentationContent)
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

    const breadcrumbList: { slug: string; name: string; type: string }[] = [
      {
        slug: '/docs/troubleshooting/',
        name: getMessages()[currentLocale]['troubleshooting_page.title'],
        type: 'category',
      },
      {
        slug,
        name: serialized?.frontmatter?.title ?? '',
        type: '',
      },
    ]

    return {
      props: {
        slug,
        serialized,
        sidebarfallback,
        headingList,
        contributors,
        path,
        seeAlsoData,
        breadcrumbList,
        branch,
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

export default TroubleshootingPage
