import { useEffect, useContext } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next' // MODIFIED: Changed GetServerSideProps to GetStaticProps
import { Item } from '@vtexdocs/components'
import jp from 'jsonpath'

import {
  getDocsPaths as getTracksPaths,
  // getStaticPathsForDocType, // Removed unused import
} from 'utils/getDocsPaths'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import { getLogger } from 'utils/logging/log-util'
import { getChildren, getParents } from 'utils/navigation-utils'

import { getBreadcrumbsList } from 'utils/article-page/getBreadcrumbsList'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { getSidebarMetadata } from 'utils/article-page/getSidebarMetadata'
import { getPagination } from 'utils/article-page/getPagination'
import { sanitizeArray } from 'utils/sanitizeArrays'
import ArticleIndex from 'components/article-index'
import ArticleRender from 'components/article-render'
import { ArticlePageProps } from 'utils/typings/types'
import { getSeeAlsoData } from 'utils/article-page/getSeeAlsoData'
import { getMessages } from 'utils/get-messages'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

const TrackPage: NextPage<ArticlePageProps> = ({
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
      type={sectionSelected}
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
  // Use getTracksPaths to get all available slugs for tracks
  const docsPaths = await getTracksPaths('tracks')
  // Generate a path for each slug/locale combination
  const paths = Object.entries(docsPaths).flatMap(([slug, entries]) =>
    entries.map(({ locale }) => ({
      params: { slug },
      locale,
    }))
  )
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
  const logger = getLogger('TracksPage-GetStaticProps') // MODIFIED: More specific logger name
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
    sectionSelected: 'tracks',
    params,
    locale,
    preview,
    previewData,
    docsPathsGLOBAL,
  })

  const { keyPath, flattenedSidebar, sidebarfallback } =
    await getSidebarMetadata(sectionSelected, slug)

  const trackCategories = jp.query(
    sidebarfallback,
    `$..[?(@.type=="category")].slug.*`
  )
  const isCategoryCover = trackCategories.includes(slug)

  if (!mdFileExists && !isCategoryCover) {
    logger.warn(
      `Markdown file not found for slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
    )
    return { notFound: true }
  }

  if (!mdFileExistsForCurrentLocale && !isCategoryCover) {
    logger.warn(
      `Markdown file (slug: ${slug}, locale: ${currentLocale}, branch: ${branch}) exists for another locale. Redirecting to localized version.`
    )
    if (keyPath) {
      return redirectToLocalizedUrl(
        keyPath,
        currentLocale,
        flattenedSidebar,
        'tracks'
      )
    }
    return { notFound: true }
  }

  const isListed = !!keyPath
  const parentsArray: string[] = []
  const parentsArrayName: string[] = []
  const parentsArrayType: string[] = []
  const breadcrumbList: { slug: string; name: string; type: string }[] = [
    {
      slug: `/docs/tracks`,
      name: getMessages()[currentLocale]['documentation_start_here.title'],
      type: 'markdown',
    },
  ]
  let pagination2 = {}

  if (isListed) {
    const mainKeyPath = keyPath.split('slug')[0]
    const localizedKeyPath = `${mainKeyPath}slug.${currentLocale}`

    const { pagination } = getPagination({
      sidebarfallback,
      currentLocale,
      slug,
      logger,
    })

    pagination2 = pagination

    getParents(
      keyPath,
      'name',
      flattenedSidebar,
      currentLocale,
      parentsArrayName
    )
    getParents(
      localizedKeyPath,
      'slug',
      flattenedSidebar,
      currentLocale,
      parentsArray
    )

    const localizedSlugKey = `${mainKeyPath}slug.${currentLocale}`
    const localizedSlug = flattenedSidebar[localizedSlugKey]

    // Debug logging for localization issues
    if (localizedSlug === undefined) {
      logger.warn(
        `DEBUG: localizedSlug is undefined for keyPath: ${localizedSlugKey}, slug: ${slug}`
      )
      // Log available keys that start with mainKeyPath to help debug
      const availableKeys = Object.keys(flattenedSidebar)
        .filter((key) => key.startsWith(mainKeyPath))
        .slice(0, 10) // Limit to first 10 to avoid spam
      logger.warn(
        `DEBUG: Available keys starting with ${mainKeyPath}: ${JSON.stringify(
          availableKeys
        )}`
      )
      // Also log what keyPath was found
      logger.warn(`DEBUG: Original keyPath found: ${keyPath}`)
    }

    // Only push if localizedSlug is not undefined to avoid JSON serialization errors
    if (localizedSlug !== undefined) {
      parentsArray.push(localizedSlug)
    } else {
      logger.warn(
        `localizedSlug is undefined for keyPath: ${localizedSlugKey}, slug: ${slug}`
      )
    }

    const nameKeyPath = `${mainKeyPath}name.${currentLocale}`
    const categoryTitle = flattenedSidebar[nameKeyPath]

    getBreadcrumbsList(
      breadcrumbList,
      parentsArray,
      parentsArrayName,
      parentsArrayType,
      'tracks'
    )

    if (isCategoryCover && !mdFileExists) {
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
        slug: `/${currentLocale}/docs/tracks/${childrenArraySlug[idx]}`,
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
          breadcrumbList,
          isListed,
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

    // Ensure parentsArray does not contain undefined values
    parentsArray.push(slug)
    const sanitizedParentsArray = parentsArray.map((item) =>
      item === undefined ? null : item
    )

    return {
      props: {
        mdFileExists,
        sectionSelected,
        parentsArray: sanitizedParentsArray,
        slug,
        pagination: pagination2,
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
      revalidate: 3600,
    }
  }

  logger.error(`Markdown file does not exist for ${slug}`)
  return { notFound: true }
}

export default TrackPage
