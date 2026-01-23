import { useEffect, useContext } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { Item } from '@vtexdocs/components'

import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import { getLogger } from 'utils/logging/log-util'
import { computeParents, getChildren } from 'utils/navigation-utils'
import { ArticlePageProps } from 'utils/typings/types'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { contentfulAuthor } from 'utils/constants'
import { fetchGitHubUser } from 'utils/fetchGithubUser'
import ArticleRender from 'components/article-render'
import ArticleIndex from 'components/article-index'
import { getSidebarMetadata } from 'utils/article-page/getSidebarMetadata'
import {
  getPagination,
  isCategoryCover,
} from 'utils/article-page/getPagination'
import { getBreadcrumbsList } from 'utils/article-page/getBreadcrumbsList'
import { sanitizeArray } from 'utils/sanitizeArrays'
import { getSeeAlsoData } from 'utils/article-page/getSeeAlsoData'
import { getMessages } from 'utils/get-messages'
import type { SectionId } from 'utils/typings/unionTypes'
import { getCategoryCoverRevalidateTime } from 'utils/config'
// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

const AnnouncementPage: NextPage<ArticlePageProps> = ({
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
  const logger = getLogger('News')

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
    sectionSelected: 'announcements',
    params,
    locale,
    preview,
    previewData,
    docsPathsGLOBAL,
  })

  const { keyPath, flattenedSidebar, sidebarfallback } =
    await getSidebarMetadata(sectionSelected, slug, { branch })

  const isAnnouncementCategory = isCategoryCover(slug, sidebarfallback)

  if (!mdFileExists && isAnnouncementCategory.length === 0) {
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

  // Fix for markdown files: detect when slug belongs to a different locale
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

  // Fix for category pages: detect when the category slug belongs to a different locale
  if (
    isAnnouncementCategory.length > 0 &&
    !isAnnouncementCategory.includes(currentLocale)
  ) {
    const categoryLocale = isAnnouncementCategory[0] as 'en' | 'pt' | 'es'
    logger.info(
      `Netlify i18n bug detected for category: slug ${slug} belongs to locale ${categoryLocale}, ` +
        `but was routed to ${currentLocale} handler. Serving content with correct locale.`
    )
    effectiveLocale = categoryLocale
  }

  if (!mdFileExistsForCurrentLocale && isAnnouncementCategory.length === 0) {
    if (effectiveLocale === currentLocale) {
      logger.warn(
        `Localized path missing for slug=${slug}, redirecting to available locale`
      )
      const redirectResult = keyPath
        ? await redirectToLocalizedUrl(
            keyPath,
            currentLocale,
            flattenedSidebar,
            'announcements'
          )
        : { notFound: true as const }
      return redirectResult
    }
  }

  const isListed = !!keyPath
  const breadcrumbList: { slug: string; name: string; type: string }[] = [
    {
      slug: `/announcements`,
      name: getMessages()[effectiveLocale]['announcements_page.title'],
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
      'announcements'
    )
    pagination = getPagination({
      contentType: 'announcements',
      sidebarfallback,
      currentLocale: effectiveLocale,
      slug,
      logger,
    }).pagination

    if (isAnnouncementCategory.length > 0 && !mdFileExists) {
      //Se existe a categoria, mas a slug está em outro locale, redireciona
      //Verifica se a slug não existe para o locale atual antes de redirecionar
      if (!isAnnouncementCategory.includes(effectiveLocale)) {
        logger.warn(
          `Localized path missing for slug=${slug}, redirecting to available locale`
        )
        return keyPath
          ? redirectToLocalizedUrl(
              keyPath,
              effectiveLocale,
              flattenedSidebar,
              'announcements'
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
        slug: `/${effectiveLocale}/announcements/${childrenArraySlug[idx]}`,
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

    const authorId = serialized.frontmatter?.author as string
    const githubLogin = contentfulAuthor[authorId]
    const contributor = githubLogin ? await fetchGitHubUser(githubLogin) : null
    const contributors = [contributor]
    logger.info(`Processing ${slug}`)
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
      revalidate: getCategoryCoverRevalidateTime(),
    }
  }

  logger.error(`Error while processing ${mdFilePath}`)
  return { notFound: true }
}

export default AnnouncementPage
