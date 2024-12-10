import Head from 'next/head'
import { Box, Flex, Text } from '@vtex/brand-ui'
import Breadcrumb from 'components/breadcrumb'

import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import SeeAlsoSection from 'components/see-also-section'
import startHereImage from '../../../public/images/start-here.png'
import PageHeader from 'components/page-header'
import { getMessages } from 'utils/get-messages'
import { LibraryContext } from '@vtexdocs/components'
import { useContext } from 'react'
import DocumentContextProvider from 'utils/contexts/documentContext'
import { Item, MarkdownRenderer, TableOfContents } from '@vtexdocs/components'

import styles from 'styles/documentation-page'
import ArticlePagination from 'components/article-pagination'
import Contributors from 'components/contributors'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ContributorsType } from 'utils/getFileContributors'
import TimeToRead from 'components/TimeToRead'

interface Props {
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
  // sectionSelected: string
  // sidebarfallback: any //eslint-disable-line
  slug: string
  // parentsArray: string[]
  // path: string
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
}
const TutorialMarkdownRender = (props: Props) => {
  const locale = useContext(LibraryContext).locale
  const messages = getMessages()[locale]

  return (
    <>
      <Head>
        <title>{props.serialized.frontmatter?.title as string}</title>
        <meta name="docsearch:doctype" content="Tutorials" />
        {props.serialized.frontmatter?.hidden && (
          <meta name="robots" content="noindex" />
        )}
        {props.serialized.frontmatter?.excerpt && (
          <meta
            property="og:description"
            content={props.serialized.frontmatter?.excerpt as string}
          />
        )}
      </Head>
      <PageHeader
        title={messages['tutorials_page.title']}
        description={messages['tutorials_page.description']}
        imageUrl={startHereImage}
        imageAlt={messages['tutorials_page.title']}
      />
      <DocumentContextProvider headings={props.headings}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.articleBox}>
            <Box sx={styles.contentContainer}>
              <article>
                <header>
                  <Breadcrumb breadcrumbList={props.breadcrumbList} />
                  <Text sx={styles.documentationTitle} className="title">
                    {props.serialized.frontmatter?.title}
                  </Text>
                  <Text sx={styles.documentationExcerpt}>
                    {props.serialized.frontmatter?.excerpt}
                  </Text>
                </header>
                {props.serialized.frontmatter?.readingTime && (
                  <TimeToRead
                    minutes={props.serialized.frontmatter.readingTime}
                  />
                )}
                <MarkdownRenderer serialized={props.serialized} />
              </article>
            </Box>

            <Box sx={styles.bottomContributorsContainer}>
              <Box sx={styles.bottomContributorsDivider} />
              <Contributors contributors={props.contributors} />
            </Box>

            <FeedbackSection docPath={props.path} slug={props.slug} />
            {props.isListed && (
              <ArticlePagination
                hidePaginationNext={
                  Boolean(props.serialized.frontmatter?.hidePaginationNext) ||
                  false
                }
                hidePaginationPrevious={
                  Boolean(
                    props.serialized.frontmatter?.hidePaginationPrevious
                  ) || false
                }
                pagination={props.pagination}
              />
            )}
            {props.serialized.frontmatter?.seeAlso && (
              <SeeAlsoSection docs={props.seeAlsoData} />
            )}
          </Box>
          <Box sx={styles.rightContainer}>
            <Contributors contributors={props.contributors} />
            <TableOfContents headingList={props.headings} />
          </Box>
          <OnThisPage />
        </Flex>
      </DocumentContextProvider>
    </>
  )
}

export default TutorialMarkdownRender
