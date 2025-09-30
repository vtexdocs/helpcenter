import { useContext, useEffect } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Item } from '@vtexdocs/components'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'

import { getLogger } from 'utils/logging/log-util'
import { computeParents, getChildren } from 'utils/navigation-utils'
// import { ParsedUrlQuery } from 'querystring'

import { getMessages } from 'utils/get-messages'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { resolveSlugFromKiFormat } from 'utils/resolveSlugFromKiFormat'
import { getSidebarMetadata } from 'utils/article-page/getSidebarMetadata'
import ArticleIndex from 'components/article-index'
import ArticleRender from 'components/article-render'
import { ArticlePageProps } from 'utils/typings/types'
import { PreviewContext } from 'utils/contexts/preview'
import { getBreadcrumbsList } from 'utils/article-page/getBreadcrumbsList'
import { isCategoryCover } from 'utils/article-page/getPagination'
import { sanitizeArray } from 'utils/sanitizeArrays'
import { getSeeAlsoData } from 'utils/article-page/getSeeAlsoData'
import type { SectionId } from 'utils/typings/unionTypes'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

const KnownIssuePage: NextPage<ArticlePageProps> = ({
  mdFileExists,
  slug,
  sectionSelected,
  isListed,
  branch,
  pagination,
  breadcrumbList,
  componentProps,
  headingList,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)

  useEffect(() => {
    setBranchPreview(branch)
  }, [slug])

  return mdFileExists === true ? (
    <ArticleRender
      type={sectionSelected as SectionId}
      breadcrumbList={breadcrumbList}
      isListed={isListed}
      branch={branch}
      headings={headingList}
      slug={slug}
      content={componentProps.content}
      serialized={componentProps.serialized}
      headingList={componentProps.headingList}
      contributors={componentProps.contributors}
      seeAlsoData={componentProps.seeAlsoData}
      path={componentProps.path}
    />
  ) : (
    <ArticleIndex
      breadcrumbList={breadcrumbList}
      name={componentProps?.articleData?.name ?? ''}
      children={componentProps?.articleData?.children}
      hidePaginationNext={componentProps?.articleData?.hidePaginationNext}
      hidePaginationPrevious={
        componentProps?.articleData?.hidePaginationPrevious
      }
      isListed={isListed}
      slug={slug}
      pagination={pagination}
    />
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
  locale = 'en',
  preview,
  previewData,
}) => {
  const logger = getLogger('Known Issues')

  const originalSlug = params?.slug as string

  // Check if slug starts with ki-- and get the number
  const resolvedSlug = await resolveSlugFromKiFormat(
    originalSlug,
    locale,
    logger
  )
  if (!resolvedSlug) return { notFound: true }
  if (originalSlug !== resolvedSlug)
    return {
      redirect: {
        destination: `/${locale}/known-issues/${resolvedSlug}`,
        permanent: true,
      },
    }

  const {
    sectionSelected,
    branch,
    slug,
    currentLocale,
    docsPaths,
    mdFileExists,
    mdFileExistsForCurrentLocale,
    mdFilePath,
  } = await extractStaticPropsParams({
    sectionSelected: 'known-issues',
    params: { ...params, slug: resolvedSlug },
    locale,
    preview,
    previewData,
    docsPathsGLOBAL,
  })
  const { keyPath, flattenedSidebar, sidebarfallback } =
    await getSidebarMetadata(sectionSelected, resolvedSlug)
  const isKICover = isCategoryCover(slug, sidebarfallback)

  if (!mdFileExists && !isKICover) {
    logger.warn(
      `Markdown file not found for slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
    )
    return { notFound: true }
  }

  if (!mdFileExistsForCurrentLocale && !isKICover) {
    logger.warn(
      `Markdown file (slug: ${slug}, locale: ${currentLocale}, branch: ${branch}) exists for another locale. Redirecting to localized version.`
    )
    if (keyPath) {
      return redirectToLocalizedUrl(
        keyPath,
        currentLocale,
        flattenedSidebar,
        'known-issues'
      )
    }
    return { notFound: true }
  }

  const isListed = !!keyPath
  const breadcrumbList: { slug: string; name: string; type: string }[] = [
    {
      slug: `/known-issues`,
      name: getMessages()[currentLocale]['sidebar_known_issues.title'],
      type: 'markdown',
    },
  ]
  let parentsArray: string[] = []
  let parentsArrayName: string[] = []
  let parentsArrayType: string[] = []
  let categoryTitle = ''

  if (isListed) {
    const {
      parentsArray: p,
      parentsArrayName: pn,
      parentsArrayType: pt,
      categoryTitle: c,
    } = computeParents(keyPath, flattenedSidebar, currentLocale, logger)
    parentsArray = p
    parentsArrayName = pn
    parentsArrayType = pt
    categoryTitle = c || ''

    parentsArray = p
    parentsArrayName = pn
    parentsArrayType = pt
    categoryTitle = c || ''

    getBreadcrumbsList(
      breadcrumbList,
      parentsArray,
      parentsArrayName,
      parentsArrayType,
      'known-issues'
    )
  }

  if (isKICover && !mdFileExists) {
    const childrenArrayName: string[] = []
    const childrenArraySlug: string[] = []

    getChildren(
      keyPath,
      'name',
      flattenedSidebar,
      currentLocale,
      childrenArrayName
    )
    getChildren(
      keyPath,
      'slug',
      flattenedSidebar,
      currentLocale,
      childrenArraySlug
    )

    const childrenList = childrenArrayName.map((name, idx) => ({
      slug: `/${currentLocale}/known-issues/${childrenArraySlug[idx]}`,
      name,
    }))

    logger.info(`Generating category cover for: ${slug}`)

    // Sanitize arrays to remove any undefined values that might cause JSON serialization errors
    const sanitizedParentsArray = sanitizeArray(
      parentsArray,
      `category cover parentsArray for slug: ${slug}`,
      logger.warn
    )

    return {
      props: {
        mdFileExists,
        sectionSelected,
        parentsArray: sanitizedParentsArray,
        slug,
        breadcrumbList,
        branch,
        componentProps: {
          articleData: {
            name: categoryTitle || slug,
            children: childrenList,
            hidePaginationNext: !childrenList.length,
          },
        },
        locale: currentLocale,
      },
      revalidate: 3600,
    }
  }

  if (mdFileExists) {
    const rawContent = await fetchRawMarkdown(
      sectionSelected,
      branch,
      mdFilePath
    )
    const documentationContent = escapeCurlyBraces(
      replaceHTMLBlocks(rawContent)
    )

    const headingList: Item[] = []
    const serialized = await serializeWithFallback({
      content: documentationContent,
      headingList,
      logger,
      path: mdFilePath,
    })
    if (!serialized) {
      logger.error(`Serialization failed for ${mdFilePath}`)
      return { notFound: true }
    }

    const contributors = await fetchFileContributors(
      sectionSelected,
      branch,
      mdFilePath
    )

    logger.info(`Processing ${slug}`)

    const seeAlsoData = await getSeeAlsoData(
      serialized?.frontmatter?.seeAlso as string[],
      docsPaths,
      currentLocale,
      logger
    )
    const sanitizedParentsArray = parentsArray.map((item) =>
      item === undefined ? null : item
    )

    return {
      props: {
        mdFileExists,
        sectionSelected,
        parentsArray: sanitizedParentsArray,
        slug,
        isListed,
        breadcrumbList,
        branch,
        componentProps: {
          content: documentationContent,
          serialized: JSON.parse(JSON.stringify(serialized)),
          headingList,
          contributors,
          path: mdFilePath,
          seeAlsoData,
        },
        locale: currentLocale,
      },
      revalidate: 600,
    }
  }
  logger.error(`Error while processing ${params?.slug}`)
  return { notFound: true }
}

export default KnownIssuePage
