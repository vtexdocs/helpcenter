import { useEffect, useContext, startTransition } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import { Item } from '@vtexdocs/components'

import { getDocsPaths as getTutorialsPaths } from 'utils/getDocsPaths'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import { getLogger } from 'utils/logging/log-util'
import { computeParents, getChildren } from 'utils/navigation-utils'

import { getBreadcrumbsList } from 'utils/article-page/getBreadcrumbsList'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import { getSidebarMetadata } from 'utils/article-page/getSidebarMetadata'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { sanitizeArray } from 'utils/sanitizeArrays'
import ArticleIndexing from 'components/article-index'
import ArticleRender from 'components/article-render'
import {
  getPagination,
  isCategoryCover,
} from 'utils/article-page/getPagination'
import { ArticlePageProps } from 'utils/typings/types'
import { getSeeAlsoData } from 'utils/article-page/getSeeAlsoData'
import { getMessages } from 'utils/get-messages'
import type { SectionId } from 'utils/typings/unionTypes'
import {
  checkTroubleshootingFallback,
  createTroubleshootingRedirect,
} from 'utils/checkTroubleshootingFallback'
import {
  getArticleRevalidateTime,
  getCategoryCoverRevalidateTime,
} from 'utils/config'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

const TutorialPage: NextPage<ArticlePageProps> = ({
  mdFileExists,
  sectionSelected,
  slug,
  isListed,
  branch,
  pagination,
  breadcrumbList,
  componentProps,
  headingList,
}) => {
  const { setBranchPreview } = useContext(PreviewContext)

  useEffect(() => {
    // Defer parent state update to avoid interrupting hydration of the Suspense boundary.
    // React recommends wrapping such updates in startTransition.
    startTransition(() => {
      setBranchPreview(branch)
    })
  }, [branch])

  return mdFileExists === true ? (
    <ArticleRender
      type={sectionSelected as SectionId}
      breadcrumbList={breadcrumbList}
      pagination={pagination}
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
    <ArticleIndexing
      breadcrumbList={breadcrumbList}
      name={componentProps?.name ?? ''}
      children={componentProps?.children}
      hidePaginationNext={componentProps?.hidePaginationNext}
      hidePaginationPrevious={componentProps?.hidePaginationPrevious}
      isListed={isListed}
      slug={slug}
      pagination={pagination}
    />
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // getTutorialsPaths returns an object mapping slugs to arrays of { locale, path }
  // We need to flatten this into an array of { params: { slug }, locale }
  const docsPaths = await getTutorialsPaths('tutorials')
  const paths: { params: { slug: string }; locale: string }[] = []
  for (const slug in docsPaths) {
    for (const entry of docsPaths[slug]) {
      paths.push({ params: { slug }, locale: entry.locale })
    }
  }
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
  preview,
  previewData,
}) => {
  const logger = getLogger('TutorialsPage-GetStaticProps')

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
    sectionSelected: 'tutorials',
    params,
    locale,
    preview,
    previewData,
    docsPathsGLOBAL,
  })

  const { keyPath, flattenedSidebar, sidebarfallback } =
    await getSidebarMetadata(sectionSelected, slug, { branch })

  const isTutorialCategory = isCategoryCover(slug, sidebarfallback)

  if (!mdFileExists && isTutorialCategory.length === 0) {
    logger.warn(
      `Markdown file not found: slug=${slug}, locale=${currentLocale}, branch=${branch}`
    )

    const hasTroubleshootingFallback = await checkTroubleshootingFallback(
      slug,
      branch
    )

    if (hasTroubleshootingFallback) {
      logger.info(
        `Redirecting from tutorials to troubleshooting: slug=${slug}, locale=${currentLocale}`
      )
      return createTroubleshootingRedirect(slug, currentLocale)
    }

    return { notFound: true }
  }

  // Fix for Netlify i18n routing bug: when Netlify incorrectly routes a locale-specific
  // slug to the wrong locale handler (e.g., PT slug routed to EN handler), we need to
  // serve the content with the correct locale instead of redirecting (which would cause
  // an infinite loop since Netlify would misroute the redirect too).
  let effectiveLocale = currentLocale
  let effectiveMdFilePath = mdFilePath

  if (!mdFileExistsForCurrentLocale && mdFileExists && docsPaths[slug]) {
    const availableLocale = docsPaths[slug][0]?.locale as
      | 'en'
      | 'pt'
      | 'es'
      | undefined
    if (availableLocale && availableLocale !== currentLocale) {
      logger.info(
        `Netlify i18n bug detected: slug ${slug} belongs to locale ${availableLocale}, ` +
          `but was routed to ${currentLocale} handler. Serving content with correct locale.`
      )
      effectiveLocale = availableLocale
      effectiveMdFilePath = docsPaths[slug][0]?.path || ''
    }
  }

  if (!mdFileExistsForCurrentLocale && isTutorialCategory.length === 0) {
    // If we couldn't find the file for current locale and couldn't fix via locale override
    if (effectiveLocale === currentLocale) {
      logger.warn(
        `Localized path missing for slug=${slug}, redirecting to available locale`
      )
      const redirectResult = keyPath
        ? await redirectToLocalizedUrl(
            keyPath,
            currentLocale,
            flattenedSidebar,
            'tutorials'
          )
        : { notFound: true as const }
      return redirectResult
    }
  }

  const isListed = !!keyPath
  const breadcrumbList: { slug: string; name: string; type: string }[] = [
    {
      slug: `/docs/tutorials`,
      name: getMessages()[effectiveLocale]['documentation_tutorials.title'],
      type: 'markdown',
    },
  ]
  let parentsArray: string[] = []
  let parentsArrayName: string[] = []
  let parentsArrayType: string[] = []
  let categoryTitle = ''
  let pagination = {}

  if (isListed) {
    const {
      parentsArray: p,
      parentsArrayName: pn,
      parentsArrayType: pt,
      categoryTitle: c,
    } = computeParents(keyPath, flattenedSidebar, effectiveLocale, logger)
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
      'docs/tutorials'
    )
    pagination = getPagination({
      contentType: 'docs/tutorials',
      sidebarfallback,
      currentLocale: effectiveLocale,
      slug,
      logger,
    }).pagination

    if (isTutorialCategory.length > 0 && !mdFileExists) {
      if (!isTutorialCategory.includes(effectiveLocale)) {
        logger.warn(
          `Localized path missing for slug=${slug}, redirecting to available locale`
        )
        return keyPath
          ? redirectToLocalizedUrl(
              keyPath,
              effectiveLocale,
              flattenedSidebar,
              'tutorials'
            )
          : { notFound: true }
      }

      const childrenArrayName: string[] = []
      const childrenArraySlug: string[] = []

      getChildren(
        keyPath,
        'name',
        flattenedSidebar,
        effectiveLocale,
        childrenArrayName
      )
      getChildren(
        keyPath,
        'slug',
        flattenedSidebar,
        effectiveLocale,
        childrenArraySlug
      )

      const childrenList = childrenArrayName.map((name, idx) => ({
        slug: `/${effectiveLocale}/docs/tutorials/${childrenArraySlug[idx]}`,
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
          pagination,
          isListed,
          breadcrumbList,
          branch,
          componentProps: {
            name: categoryTitle || slug,
            children: childrenList,
            hidePaginationPrevious: breadcrumbList.length < 2,
            hidePaginationNext: !childrenList.length,
          },
          locale: effectiveLocale,
        },
        revalidate: getCategoryCoverRevalidateTime(),
      }
    }
  }

  if (mdFileExists || effectiveMdFilePath) {
    const rawContent = await fetchRawMarkdown(
      sectionSelected,
      branch,
      effectiveMdFilePath || mdFilePath
    )
    const documentationContent = escapeCurlyBraces(
      replaceHTMLBlocks(rawContent)
    )
    const contributors = await fetchFileContributors(
      sectionSelected,
      branch,
      effectiveMdFilePath || mdFilePath
    )

    const headingList: Item[] = []
    const serialized = await serializeWithFallback({
      content: documentationContent,
      headingList,
      logger,
      path: effectiveMdFilePath || mdFilePath,
    })
    if (!serialized) {
      logger.error(
        `Serialization failed for ${effectiveMdFilePath || mdFilePath}`
      )
      return { notFound: true }
    }

    const seeAlsoData = await getSeeAlsoData(
      serialized?.frontmatter?.seeAlso as string[],
      docsPaths,
      effectiveLocale,
      logger
    )

    logger.info(`Generating markdown file for: ${slug}`)

    // Sanitize arrays to remove any undefined values that might cause JSON serialization errors
    const sanitizedParentsArray = sanitizeArray(
      parentsArray,
      `markdown file parentsArray for slug: ${slug}`,
      logger.warn
    )

    return {
      props: {
        mdFileExists,
        sectionSelected,
        parentsArray: sanitizedParentsArray,
        slug,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        componentProps: {
          content: documentationContent,
          serialized: JSON.parse(JSON.stringify(serialized)),
          headingList,
          contributors,
          path: effectiveMdFilePath || mdFilePath,
          seeAlsoData,
        },
        locale: effectiveLocale,
      },
      revalidate: getArticleRevalidateTime(),
    }
  }

  logger.error(`Markdown file and tutorial category do not exist for ${slug}`)
  return { notFound: true }
}

export default TutorialPage
