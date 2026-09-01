import Head from 'next/head'
import { Box, Flex, Text } from '@vtex/brand-ui'

import FeedbackSection from 'components/feedback-section'
import SeeAlsoSection from 'components/see-also-section'
import {
  Author,
  Breadcrumb,
  MarkdownRenderer,
  TableOfContents,
  Contributors,
  OnThisPage,
  Tag,
  TimeToRead,
} from '@vtexdocs/components'

import styles from 'styles/documentation-page'
import ArticlePagination from 'components/article-pagination'
import { MarkDownProps } from 'utils/typings/types'
import DateText from 'components/date-text'
import PaymentProvidersTable from 'components/payment-providers-table'
import CopyForLLM from 'components/copy-for-llm'
import DataTable from 'components/datatable'
import { DataTablesProvider } from 'components/datatable/context'
import type { DataTablesData } from 'components/datatable/datatable.types'
import { KnownIssueStatus } from 'utils/typings/unionTypes'
import InsertAccountName from 'components/insert-account-name'

import { useIntl } from 'react-intl'

const ArticleRender = ({
  serialized,
  headings,
  breadcrumbList,
  contributors,
  path,
  seeAlsoData,
  pagination,
  slug,
  type,
}: MarkDownProps) => {
  const intl = useIntl()
  const dataTablesData =
    (serialized.scope as { dataTablesData?: DataTablesData } | undefined)
      ?.dataTablesData ?? {}
  return (
    <>
      <Head>
        <>
          <meta name="docsearch:doctype" content={type} />
          {serialized?.frontmatter?.title && (
            <title>{serialized?.frontmatter?.title as string}</title>
          )}
          {serialized?.frontmatter?.title && (
            <meta
              name="docsearch:doctitle"
              content={serialized?.frontmatter?.title as string}
            />
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
        </>
      </Head>
      <Flex sx={styles.innerContainer}>
        <Box sx={styles.articleBox}>
          <Box sx={styles.contentContainer}>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Breadcrumb breadcrumbList={breadcrumbList} />
            </Flex>
            <Box sx={styles.textContainer}>
              <article>
                <header>
                  <>
                    <Text sx={styles.documentationTitle} className="title">
                      {serialized.frontmatter?.title}
                    </Text>
                    {type == 'announcements' && contributors[0]?.avatar && (
                      <Author contributor={contributors[0]} />
                    )}
                    {serialized.frontmatter?.excerpt && (
                      <Text sx={styles.documentationExcerpt}>
                        {serialized.frontmatter?.excerpt}
                      </Text>
                    )}
                  </>
                </header>

                {type == 'known-issues' && (
                  <Flex
                    sx={{
                      flexDirection: 'column',
                    }}
                  >
                    {/* Top row: ID and Tags */}
                    <Flex
                      sx={{
                        alignItems: 'center',
                        width: '100%',
                        gap: '12px',
                      }}
                    >
                      <Text>{serialized.frontmatter?.productTeam}</Text>
                      <Text>•</Text>
                      <Text>
                        ID: {serialized.frontmatter?.internalReference}
                      </Text>
                      <Tag
                        sx={{ marginLeft: 'auto' }}
                        color={
                          serialized.frontmatter?.kiStatus as KnownIssueStatus
                        }
                      >
                        {intl.formatMessage({
                          id: `known_issues_filter_status.${(
                            serialized.frontmatter?.kiStatus as KnownIssueStatus
                          )
                            .toLowerCase()
                            .replace(' ', '_')}`,
                        })}
                      </Tag>
                    </Flex>
                  </Flex>
                )}
                <Flex
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'self-start',
                    marginBottom: '24px',
                    marginTop: '4px',
                  }}
                >
                  <Box>
                    {type !== 'tracks' && type !== 'tutorials' && (
                      <Flex sx={{ alignItems: 'center' }}>
                        <DateText
                          createdAt={
                            new Date(String(serialized.frontmatter?.createdAt))
                          }
                          updatedAt={
                            new Date(String(serialized.frontmatter?.updatedAt))
                          }
                        />
                      </Flex>
                    )}
                    <Flex sx={{ alignItems: 'center' }}>
                      {serialized?.frontmatter?.readingTime && (
                        <TimeToRead
                          minutes={
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (serialized?.frontmatter?.readingTime as any)
                              ?.text ||
                            String(serialized?.frontmatter?.readingTime)
                          }
                        />
                      )}
                      <CopyForLLM section={type} slug={slug} path={path} />
                    </Flex>
                  </Box>
                </Flex>
                <DataTablesProvider value={dataTablesData}>
                  <MarkdownRenderer
                    serialized={serialized}
                    customComponents={{
                      InsertAccountName,
                      PaymentProvidersTable,
                      DataTable,
                    }}
                    scope={{}}
                  />
                </DataTablesProvider>
              </article>
            </Box>
          </Box>

          {type !== 'announcements' && (
            <Box sx={styles.bottomContributorsContainer}>
              <Box sx={styles.bottomContributorsDivider} />
              <Contributors contributors={contributors} />
            </Box>
          )}

          <FeedbackSection docPath={path} slug={slug} type={type} />
          {pagination && (
            <ArticlePagination
              hidePaginationNext={
                Boolean(serialized.frontmatter?.hidePaginationNext) || false
              }
              hidePaginationPrevious={
                Boolean(serialized.frontmatter?.hidePaginationPrevious) || false
              }
              pagination={pagination}
            />
          )}
          {serialized.frontmatter?.seeAlso && (
            <SeeAlsoSection docs={seeAlsoData} />
          )}
        </Box>
        <Box sx={styles.rightContainer}>
          {type !== 'announcements' && (
            <Contributors contributors={contributors} />
          )}
          <TableOfContents headingList={headings} />
        </Box>
        <OnThisPage headingList={headings} />
      </Flex>
    </>
  )
}

export default ArticleRender
