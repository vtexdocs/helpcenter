import Head from 'next/head'
import { Box, Flex, Text, Link } from '@vtex/brand-ui'

import SeeAlsoSection from 'components/see-also-section'
import {
  AskAIMenu,
  Author,
  Breadcrumb,
  MarkdownRenderer,
  TableOfContents,
  Contributors,
  OnThisPage,
  Tag,
  TimeToRead,
  EditIcon,
  FeedbackSection,
  FeedbackModal,
  CopyHeadingLink,
} from '@vtexdocs/components'

import styles from 'styles/documentation-page'
import ArticlePagination from 'components/article-pagination'
import { MarkDownProps } from 'utils/typings/types'
import DateText from 'components/date-text'
import PaymentProvidersTable from 'components/payment-providers-table'
import DataTable from 'components/datatable'
import { DataTablesProvider } from 'components/datatable/context'
import type { DataTablesData } from 'components/datatable/datatable.types'
import { KnownIssueStatus, SectionId } from 'utils/typings/unionTypes'
import InsertAccountName from 'components/insert-account-name'
import { useState } from 'react'

import { useIntl } from 'react-intl'

const HELP_CENTER_ORIGIN = 'https://help.vtex.com'
const HELP_CENTER_CONTENT_RAW_BASE =
  'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/'
const KNOWN_ISSUES_RAW_BASE =
  'https://raw.githubusercontent.com/vtexdocs/known-issues/main/'
const HELP_CENTER_PAGE_PATH: Record<SectionId, string> = {
  tracks: 'docs/tracks',
  tutorials: 'docs/tutorials',
  faq: 'faq',
  announcements: 'announcements',
  'known-issues': 'known-issues',
  troubleshooting: 'troubleshooting',
}

const ArticleRender = ({
  serialized,
  headings,
  headingList,
  breadcrumbList,
  contributors,
  path,
  seeAlsoData,
  pagination,
  slug,
  type,
}: MarkDownProps) => {
  const intl = useIntl()
  const tocHeadings = headingList?.length ? headingList : headings
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dataTablesData =
    (serialized.scope as { dataTablesData?: DataTablesData } | undefined)
      ?.dataTablesData ?? {}
  const contentRepo =
    type === 'known-issues' ? 'known-issues' : 'help-center-content'
  const urlToEdit = `https://github.com/vtexdocs/${contentRepo}/edit/main/${path}`
  const pageUrl = `${HELP_CENTER_ORIGIN}/${HELP_CENTER_PAGE_PATH[type]}/${slug}`
  const rawContentBaseUrl =
    type === 'known-issues'
      ? KNOWN_ISSUES_RAW_BASE
      : HELP_CENTER_CONTENT_RAW_BASE

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
            <Flex sx={styles.breadcrumbRow}>
              <Breadcrumb breadcrumbList={breadcrumbList} />
            </Flex>
            <Box sx={styles.textContainer}>
              <article>
                <header>
                  <>
                    <Text sx={styles.documentationTitle} className="title">
                      {serialized.frontmatter?.title}
                      <CopyHeadingLink />
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
                  <Flex sx={styles.knownIssueMeta}>
                    <Text>{serialized.frontmatter?.productTeam}</Text>
                    <Text>•</Text>
                    <Text>ID: {serialized.frontmatter?.internalReference}</Text>
                    <Tag
                      sx={{ marginLeft: ['0', 'auto'] }}
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
                )}
                <Flex sx={styles.articleMeta}>
                  {type !== 'tracks' && type !== 'tutorials' && (
                    <Flex sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
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
                  <Flex sx={styles.readingTimeRow}>
                    {serialized?.frontmatter?.readingTime && (
                      <TimeToRead
                        minutes={
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (serialized?.frontmatter?.readingTime as any)?.text ||
                          String(serialized?.frontmatter?.readingTime)
                        }
                      />
                    )}
                    <Flex sx={styles.articleActions}>
                      <Box
                        as="button"
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        sx={styles.articleFeedbackButton}
                      >
                        <i className="fa-regular fa-comment"></i>{' '}
                        {intl.formatMessage({ id: 'feedback_modal.button' })}
                      </Box>
                      <AskAIMenu
                        filePath={path}
                        pageUrl={pageUrl}
                        rawContentBaseUrl={rawContentBaseUrl}
                      />
                    </Flex>
                  </Flex>
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
              <Box sx={styles.bottomContributors}>
                <Contributors contributors={contributors} />
              </Box>
              <FeedbackSection
                slug={slug}
                urlToEdit={urlToEdit}
                pageUrl={pageUrl}
              />
            </Box>
          )}

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
          <TableOfContents headingList={tocHeadings}>
            <Box sx={styles.divider}>
              <FeedbackSection slug={slug} small suggestEdits={false} />
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={urlToEdit}
                sx={styles.editContainer}
              >
                <EditIcon size={18} />
                <Text>
                  {intl.formatMessage({ id: 'feedback_section.edit' })}
                </Text>
              </Link>
            </Box>
          </TableOfContents>
        </Box>
        <OnThisPage headingList={tocHeadings} />
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pageUrl={pageUrl}
        />
      </Flex>
    </>
  )
}

export default ArticleRender
