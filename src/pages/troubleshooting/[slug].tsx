import { Item } from '@vtexdocs/components'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useContext, useEffect } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import { getLogger } from 'utils/logging/log-util'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { computeParents, getChildren } from 'utils/navigation-utils'
import { getMessages } from 'utils/get-messages'
import type { SectionId } from 'utils/typings/unionTypes'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { getSidebarMetadata } from 'utils/article-page/getSidebarMetadata'
import { getSeeAlsoData } from 'utils/article-page/getSeeAlsoData'
import { isCategoryCover } from 'utils/article-page/getPagination'
import ArticleRender from 'components/article-render'
import ArticleIndex from 'components/article-index'
import { ArticlePageProps } from 'utils/typings/types'
import { getBreadcrumbsList } from 'utils/article-page/getBreadcrumbsList'
import { sanitizeArray } from 'utils/sanitizeArrays'
import {
  getArticleRevalidateTime,
  getCategoryCoverRevalidateTime,
} from 'utils/config'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

const TroubleshootingPage: NextPage<ArticlePageProps> = ({
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
  }, [headingList])

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
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
  preview,
  previewData,
}) => {
  const logger = getLogger('troubleshooting')
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
    sectionSelected: 'troubleshooting',
    params,
    locale,
    preview,
    previewData,
    docsPathsGLOBAL,
  })

  const { keyPath, flattenedSidebar, sidebarfallback } =
    await getSidebarMetadata(sectionSelected, slug, { branch })
  const isTroubleshootingCover = isCategoryCover(slug, sidebarfallback)

  if (!mdFileExists && isTroubleshootingCover.length === 0) {
    logger.warn(
      `Markdown file not found for slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
    )
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

  if (!mdFileExistsForCurrentLocale && isTroubleshootingCover.length === 0) {
    if (effectiveLocale === currentLocale) {
      logger.warn(
        `Localized path missing for slug=${slug}, redirecting to available locale`
      )
      const redirectResult = keyPath
        ? await redirectToLocalizedUrl(
            keyPath,
            currentLocale,
            flattenedSidebar,
            'troubleshooting'
          )
        : { notFound: true as const }
      return redirectResult
    }
  }

  const isListed = !!keyPath
  const breadcrumbList: { slug: string; name: string; type: string }[] = [
    {
      slug: `/troubleshooting`,
      name: getMessages()[effectiveLocale]['troubleshooting_page.title'],
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
      'troubleshooting'
    )
  }

  if (isTroubleshootingCover.length > 0 && !mdFileExists) {
    if (!isTroubleshootingCover.includes(effectiveLocale)) {
      logger.warn(
        `Localized path missing for slug=${slug}, redirecting to available locale`
      )
      return keyPath
        ? redirectToLocalizedUrl(
            keyPath,
            effectiveLocale,
            flattenedSidebar,
            'troubleshooting'
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
      slug: `/${effectiveLocale}/troubleshooting/${childrenArraySlug[idx]}`,
      name,
    }))

    logger.info(`Generating category cover for: ${slug}`)

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
          name: categoryTitle || slug,
          children: childrenList,
          hidePaginationNext: !childrenList.length,
        },
        locale: effectiveLocale,
      },
      revalidate: getCategoryCoverRevalidateTime(),
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

    const contributors = await fetchFileContributors(
      sectionSelected,
      branch,
      effectiveMdFilePath || mdFilePath
    )

    logger.info(`Processing ${slug}`)
    const seeAlsoData = await getSeeAlsoData(
      serialized?.frontmatter?.seeAlso as string[],
      docsPaths,
      effectiveLocale,
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
          path: effectiveMdFilePath || mdFilePath,
          seeAlsoData,
        },
        locale: effectiveLocale,
      },
      revalidate: getArticleRevalidateTime(),
    }
  }
  logger.error(`Markdown file does not exist for ${slug}`)
  return { notFound: true }
}

export default TroubleshootingPage
