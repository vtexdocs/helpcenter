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
  const intl = useIntl()

  return (
    <>
      <Head>
        <title>{props.serialized.frontmatter?.title as string}</title>
        <meta name="docsearch:doctype" content="Tutorials & Solutions" />
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
          id: 'tutorial_and_solutions_page.title',
        })}
        description={intl.formatMessage({
          id: 'tutorial_and_solutions_page.description',
        })}
        imageUrl={startHereImage}
        imageAlt={intl.formatMessage({
          id: 'tutorial_and_solutions_page.title',
        })}
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
                <Flex sx={styles.infoContainer}>
                  <Text sx={styles.readingTime}>
                    {intl.formatMessage(
                      {
                        id: 'documentation_reading_time.text',
                        defaultMessage: '',
                      },
                      {
                        minutes: props.serialized.frontmatter?.readingTime,
                      }
                    )}
                  </Text>
                  <CopyLinkButton />
                </Flex>
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
