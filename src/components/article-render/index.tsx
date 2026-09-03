import { ArticleRender as ArticleLayout } from '@vtexdocs/components'

import SeeAlsoSection from 'components/see-also-section'
import PaymentProvidersTable from 'components/payment-providers-table'
import DataTable from 'components/datatable'
import { DataTablesProvider } from 'components/datatable/context'
import type { DataTablesData } from 'components/datatable/datatable.types'
import { ArticleRenderProps } from 'utils/typings/types'
import { SectionId } from 'utils/typings/unionTypes'

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

const articleCustomComponents = {
  PaymentProvidersTable,
  DataTable,
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
  children,
  showReadingTime,
  showAskAIMenu,
  showAuthor,
  showContributors,
  showFeedbackSection,
  showSuggestEdits,
  showArticlePagination,
  showTableOfContents,
  showDateText,
}: ArticleRenderProps) => {
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
    <ArticleLayout
      serialized={serialized}
      headings={headings}
      headingList={headingList}
      breadcrumbList={breadcrumbList}
      contributors={contributors}
      path={path}
      pagination={pagination}
      slug={slug}
      type={type}
      pageUrl={pageUrl}
      urlToEdit={urlToEdit}
      rawContentBaseUrl={rawContentBaseUrl}
      customComponents={articleCustomComponents}
      renderMarkdown={(markdown) => (
        <DataTablesProvider value={dataTablesData}>
          {markdown}
        </DataTablesProvider>
      )}
      seeAlso={
        serialized.frontmatter?.seeAlso ? (
          <SeeAlsoSection docs={seeAlsoData} />
        ) : undefined
      }
      showReadingTime={showReadingTime}
      showAskAIMenu={showAskAIMenu}
      showAuthor={showAuthor}
      showContributors={showContributors}
      showFeedbackSection={showFeedbackSection}
      showSuggestEdits={showSuggestEdits}
      showArticlePagination={showArticlePagination}
      showTableOfContents={showTableOfContents}
      showDateText={showDateText}
    >
      {children}
    </ArticleLayout>
  )
}

export default ArticleRender
