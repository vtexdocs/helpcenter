import Head from 'next/head'
import { Box, Flex, Text } from '@vtex/brand-ui'
import Breadcrumb from 'components/breadcrumb'

import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import SeeAlsoSection from 'components/see-also-section'
import startHereImage from '../../../public/images/start-here.png'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import DocumentContextProvider from 'utils/contexts/documentContext'
import { Item, MarkdownRenderer, TableOfContents } from '@vtexdocs/components'

import styles from 'styles/documentation-page'
import ArticlePagination from 'components/article-pagination'
import Contributors from 'components/contributors'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ContributorsType } from 'utils/getFileContributors'
import CopyLinkButton from 'components/copy-link-button'
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
}

const TutorialMarkdownRender = (props: Props) => {
  const intl = useIntl()

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
        title={intl.formatMessage({
          id: 'documentation_tutorials.title',
        })}
        description={intl.formatMessage({
          id: 'documentation_tutorials.description',
        })}
        imageUrl={startHereImage}
        imageAlt={intl.formatMessage({
          id: 'documentation_tutorials.title',
        })}
      />
      <DocumentContextProvider headings={props.headings}>
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.articleBox}>
            <Box sx={styles.contentContainer}>
              <Box sx={styles.textContainer}>
                <article>
                  <header>
                    <Breadcrumb breadcrumbList={props.breadcrumbList} />
                    <Text sx={styles.documentationTitle} className="title">
                      {props.serialized.frontmatter?.title}
                    </Text>
                    <Text sx={styles.documentationExcerpt}>
                      {props.serialized.frontmatter?.excerpt}
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
                  {props.serialized.frontmatter?.readingTime && (
                    <TimeToRead
                      minutes={
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (props.serialized.frontmatter.readingTime as any)
                          ?.text ||
                        String(props.serialized.frontmatter.readingTime)
                      }
                    />
                  )}
                  <MarkdownRenderer serialized={props.serialized} />
                </article>
              </Box>
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
