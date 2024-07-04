import { Box, Flex, Text } from '@vtex/brand-ui'
import { Item, MarkdownRenderer, TableOfContents } from '@vtexdocs/components'
import type { GetStaticPaths, NextPage } from 'next'
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

export default TroubleshootingPage
