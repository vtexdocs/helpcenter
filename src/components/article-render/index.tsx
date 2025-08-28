import Head from 'next/head'
import { Box, Flex, Text } from '@vtex/brand-ui'
import Breadcrumb from 'components/breadcrumb'

import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import SeeAlsoSection from 'components/see-also-section'
import DocumentContextProvider from 'utils/contexts/documentContext'
import { Item, MarkdownRenderer, TableOfContents } from '@vtexdocs/components'

import styles from 'styles/documentation-page'
import ArticlePagination from 'components/article-pagination'
import Contributors from 'components/contributors'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ContributorsType } from 'utils/getFileContributors'
import CopyLinkButton from 'components/copy-link-button'
import TimeToRead from 'components/TimeToRead'

export interface MarkDownProps {
  content: string
  serialized: MDXRemoteSerializeResult
  contributors: ContributorsType[]
  path: string
  headingList: Item[]
  seeAlsoData: {
    url: string
    title: string
    category: string
  }[]
  slug: string
  isListed: boolean
  branch: string
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
  breadcrumbList: { slug: string; name: string; type: string }[]
  headings: Item[]
  type: string
}

const ArticleRender = ({
  serialized,
  isListed,
  headings,
  breadcrumbList,
  contributors,
  path,
  seeAlsoData,
  pagination,
  slug,
  type,
}: MarkDownProps) => {
  return (
    <>
      <Head>
        <meta name="docsearch:doctype" content={type} />
        {serialized?.frontmatter?.title && (
          <>
            <title>{serialized?.frontmatter?.title as string}</title>
            <meta
              name="docsearch:doctitle"
              content={serialized?.frontmatter?.title as string}
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
      <DocumentContextProvider headings={headings}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.articleBox}>
            <Box sx={styles.contentContainer}>
              <Box sx={styles.textContainer}>
                <article>
                  <header>
                    <Breadcrumb breadcrumbList={breadcrumbList} />
                    <Text sx={styles.documentationTitle} className="title">
                      {serialized.frontmatter?.title}
                    </Text>
                    <Text sx={styles.documentationExcerpt}>
                      {serialized.frontmatter?.excerpt}
                    </Text>
                    <Flex
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '16px',
                      }}
                    >
                      <CopyLinkButton />
                    </Flex>
                  </header>
                  {serialized.frontmatter?.readingTime && (
                    <TimeToRead
                      minutes={
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (serialized.frontmatter.readingTime as any)?.text ||
                        String(serialized.frontmatter.readingTime)
                      }
                    />
                  )}
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

export default ArticleRender
