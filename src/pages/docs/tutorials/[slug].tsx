import { useEffect, useContext } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import jp from 'jsonpath'

import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { Item } from '@vtexdocs/components'

import getGithubFile from 'utils/getGithubFile'
import { getDocsPaths as getTutorialsPaths } from 'utils/getDocsPaths'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import { getChildren, getParents } from 'utils/navigation-utils'

import TutorialIndexing from 'components/tutorial-index'
import TutorialMarkdownRender from 'components/tutorial-markdown-render'
import { getBreadcrumbsList } from 'utils/getBreadcrumbsList'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { fetchFileContributors } from 'utils/fetchFileContributors'
import { getSidebarMetadata } from 'utils/getSidebarMetadata'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import { sanitizeArray } from 'utils/sanitizeArrays'

// Initialize in getStaticProps
const docsPathsGLOBAL: Record<
  string,
  { locale: string; path: string }[]
> | null = null

interface TutorialIndexingDataI {
  name: string
  children: { name: string; slug: string }[]
  hidePaginationPrevious: boolean
  hidePaginationNext: boolean
}

interface TutorialIndexingProps {
  tutorialData: TutorialIndexingDataI
}

interface MarkDownProps {
  // sectionSelected: string
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
}

type Props =
  | {
      sectionSelected: string
      slug: string
      parentsArray: string[] | null[]
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
      mdFileExists: true
      componentProps: MarkDownProps
      headingList: Item[]
    }
  | {
      sectionSelected: string
      slug: string
      parentsArray: string[] | null[]
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
      mdFileExists: false
      componentProps: TutorialIndexingProps
      headingList?: Item[]
    }

const TutorialPage: NextPage<Props> = ({
  mdFileExists,
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
    setBranchPreview(branch)
  }, [componentProps])

  return mdFileExists === true ? (
    <TutorialMarkdownRender
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
    <TutorialIndexing
      breadcrumbList={breadcrumbList}
      name={componentProps?.tutorialData?.name ?? ''}
      children={componentProps?.tutorialData?.children}
      hidePaginationNext={componentProps?.tutorialData?.hidePaginationNext}
      hidePaginationPrevious={
        componentProps?.tutorialData?.hidePaginationPrevious
      }
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

  const isCategoryCover = slug.startsWith('category-')

  //Se não existe o arquivo md para a slug e não é capa de categoria, retorna 404
  if (!mdFileExists && !isCategoryCover) {
    logger.warn(
      `Markdown file not found: slug=${slug}, locale=${currentLocale}, branch=${branch}`
    )
    return { notFound: true }
  }

  const { keyPath, flattenedSidebar, sidebarfallback } =
    await getSidebarMetadata(sectionSelected, slug)

  //Se existe o arquivo md, mas apenas para outro locale, redireciona
  if (!mdFileExistsForCurrentLocale && !isCategoryCover) {
    logger.warn(
      `Localized path missing for slug=${slug}, redirecting to available locale`
    )
    return keyPath
      ? redirectToLocalizedUrl(
          keyPath,
          currentLocale,
          flattenedSidebar,
          'tutorials'
        )
      : { notFound: true }
  }

  const isListed = !!keyPath
  const parentsArray: string[] = []
  const parentsArrayName: string[] = []
  const parentsArrayType: string[] = []
  let categoryTitle = ''
  let breadcrumbList: { slug: string; name: string; type: string }[] = []
  let pagination = {}

  if (isListed) {
    const mainKeyPath = keyPath.split('slug')[0]
    const localizedKeyPath = `${mainKeyPath}slug.${currentLocale}`

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
    categoryTitle = flattenedSidebar[nameKeyPath]
    // Only push if categoryTitle is not undefined
    if (categoryTitle !== undefined) {
      parentsArrayName.push(categoryTitle)
    } else {
      logger.warn(
        `categoryTitle is undefined for keyPath: ${nameKeyPath}, slug: ${slug}`
      )
    }
    const typeValue = flattenedSidebar[`${mainKeyPath}type`]
    // Only push if typeValue is not undefined
    if (typeValue !== undefined) {
      parentsArrayType.push(typeValue)
    } else {
      logger.warn(
        `typeValue is undefined for keyPath: ${mainKeyPath}type, slug: ${slug}`
      )
    }

    breadcrumbList = getBreadcrumbsList(
      parentsArray,
      parentsArrayName,
      parentsArrayType,
      'tutorials'
    )
    const docsListSlug = jp
      .query(sidebarfallback, `$..[?(@.type=='markdown')]..slug`)
      .map((s) => (typeof s === 'object' ? s[currentLocale] || s.en : s))
      .filter(Boolean)

    const docsListName = jp
      .query(sidebarfallback, `$..[?(@.type=='markdown')]..name`)
      .map((n) => (typeof n === 'object' ? n : { [currentLocale]: n }))

    const index = docsListSlug.indexOf(slug)
    pagination = {
      previousDoc:
        index > 0
          ? {
              slug: docsListSlug[index - 1],
              name:
                docsListName[index - 1]?.[currentLocale] ||
                docsListName[index - 1]?.en,
            }
          : { slug: null, name: null },
      nextDoc:
        index < docsListSlug.length - 1
          ? {
              slug: docsListSlug[index + 1],
              name:
                docsListName[index + 1]?.[currentLocale] ||
                docsListName[index + 1]?.en,
            }
          : { slug: null, name: null },
    }

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
        slug: `/${currentLocale}/docs/tutorials/${childrenArraySlug[idx]}`,
        name,
      }))

      const previousDoc = breadcrumbList[breadcrumbList.length - 2] ?? {
        slug: null,
        name: null,
      }
      const nextDoc = childrenList[0] ?? { slug: null, name: null }

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
          pagination: { previousDoc, nextDoc },
          isListed,
          breadcrumbList,
          branch,
          componentProps: {
            tutorialData: {
              name: categoryTitle || slug,
              children: childrenList,
              hidePaginationPrevious: breadcrumbList.length < 2,
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
    const contributors = await fetchFileContributors(
      sectionSelected,
      branch,
      mdFilePath
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

    const seeAlsoData = await Promise.all(
      (Array.isArray(serialized?.frontmatter?.seeAlso)
        ? serialized?.frontmatter.seeAlso
        : [serialized?.frontmatter?.seeAlso]
      )
        .filter(Boolean)
        .map(async (url: string) => {
          const key = url.split('/')[3]
          const seeAlsoPath = docsPaths[key]?.find(
            (e) => e.locale === currentLocale
          )?.path

          if (!seeAlsoPath) {
            return {
              url,
              title: key,
              category: url.split('/')[2],
            }
          }

          try {
            const seeAlsoContent = await getGithubFile(
              'vtexdocs',
              'help-center-content',
              'main',
              seeAlsoPath
            )
            const seeAlsoSerialized = await serialize(seeAlsoContent, {
              parseFrontmatter: true,
            })
            return {
              url,
              title: seeAlsoSerialized.frontmatter?.title || key,
              category:
                seeAlsoSerialized.frontmatter?.category || url.split('/')[2],
            }
          } catch (error) {
            logger.error(
              `Failed to load seeAlso content for ${seeAlsoPath}: ${error}`
            )
            return {
              url,
              title: key,
              category: url.split('/')[2],
            }
          }
        })
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
          path: mdFilePath,
          seeAlsoData,
        },
        locale: currentLocale,
      },
      revalidate: 3600,
    }
  }

  logger.error(`Markdown file and tutorial category do not exist for ${slug}`)
  return { notFound: true }
}

export default TutorialPage
