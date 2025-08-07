import { useEffect, useState, useContext } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next' // MODIFIED: Changed GetServerSideProps to GetStaticProps
import jp from 'jsonpath'

import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { Item, LibraryContext } from '@vtexdocs/components'

import getNavigation from 'utils/getNavigation'
import getGithubFile from 'utils/getGithubFile' // ADDED: Import getGithubFile
import { getDocsPaths as getTutorialsPaths } from 'utils/getDocsPaths'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import { ContributorsType } from 'utils/getFileContributors' // ADDED: Import getFileContributors

import { getLogger } from 'utils/logging/log-util'
import {
  flattenJSON,
  getChildren,
  getKeyByValue,
  getParents,
} from 'utils/navigation-utils'

import TutorialIndexing from 'components/tutorial-index'
import TutorialMarkdownRender from 'components/tutorial-markdown-render'
import { getBreadcrumbsList } from 'utils/getBreadcrumbsList'
import { serializeWithFallback } from 'utils/serializeWithFallback'
import { extractStaticPropsParams } from 'utils/extractStaticPropsParams'
import redirectToLocalizedUrl from 'utils/redirectToLocalizedUrl'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { fetchFileContributors } from 'utils/fetchFileContributors'

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
      type: 'markdown'
      componentProps: MarkDownProps
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
      type: 'tutorial-category'
      componentProps: TutorialIndexingProps
    }

const TutorialPage: NextPage<Props> = ({
  type,
  slug,
  isListed,
  branch,
  pagination,
  breadcrumbList,
  componentProps,
}) => {
  const [headings, setHeadings] = useState<Item[]>([])
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const { setActiveSidebarElement } = useContext(LibraryContext)

  useEffect(() => {
    setActiveSidebarElement(slug)
    if (type === 'markdown') {
      setHeadings(componentProps.headingList)
    }
  }, [])

  return type === 'markdown' ? (
    <TutorialMarkdownRender
      breadcrumbList={breadcrumbList}
      pagination={pagination}
      isListed={isListed}
      branch={branch}
      headings={headings}
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

  const { sectionSelected, branch, slug, currentLocale, docsPaths, docExists } =
    await extractStaticPropsParams({
      sectionSelected: 'tutorials',
      params,
      locale,
      preview,
      previewData,
      docsPathsGLOBAL,
    })

  const isCategoryCover = slug.startsWith('category-')

  if (!docExists && !isCategoryCover) {
    logger.warn(
      `Markdown file not found: slug=${slug}, locale=${currentLocale}, branch=${branch}`
    )
    return { notFound: true }
  }

  const pathEntry = docsPaths[slug]?.find((e) => e.locale === currentLocale)
  const path = pathEntry?.path

  const sidebarfallback = await getNavigation()
  const filteredSidebar = sidebarfallback.find(
    (item: { documentation: string }) => item.documentation === sectionSelected
  )
  const flattenedSidebar = flattenJSON(filteredSidebar)
  const keyPath = getKeyByValue(flattenedSidebar, slug) as string

  if (!path && !isCategoryCover) {
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

  const parentsArray: string[] = []
  const parentsArrayName: string[] = []
  const parentsArrayType: string[] = []
  let type = ''
  let categoryTitle = ''

  if (keyPath) {
    const mainKeyPath = keyPath.split('slug')[0]
    const localizedKeyPath = `${mainKeyPath}slug.${currentLocale}`
    type = flattenedSidebar[`${mainKeyPath}type`]

    getParents(
      localizedKeyPath,
      'slug',
      flattenedSidebar,
      currentLocale,
      parentsArray
    )
    const localizedSlug =
      flattenedSidebar[`${mainKeyPath}slug.${currentLocale}`]
    parentsArray.push(localizedSlug)

    const nameKeyPath = `${mainKeyPath}name.${currentLocale}`
    categoryTitle = flattenedSidebar[nameKeyPath]
    parentsArrayName.push(categoryTitle)
    parentsArrayType.push(flattenedSidebar[`${mainKeyPath}type`])
  }

  const isListed = !!keyPath

  logger.info(`Tutorial section selected: ${sectionSelected} for slug: ${slug}`)

  const breadcrumbList = getBreadcrumbsList(
    parentsArray,
    parentsArrayName,
    parentsArrayType,
    'tutorials'
  )

  if (isCategoryCover && isListed) {
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

    return {
      props: {
        type,
        sectionSelected,
        parentsArray,
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

  if (type === 'markdown') {
    const resolvedPath = path!
    const rawContent = await fetchRawMarkdown(branch, resolvedPath)
    const documentationContent = replaceHTMLBlocks(rawContent)
    const contributors = await fetchFileContributors(branch, resolvedPath)

    const headingList: Item[] = []
    const serialized = await serializeWithFallback({
      content: documentationContent,
      headingList,
      logger,
      path: resolvedPath,
    })

    if (!serialized) {
      logger.error(`Serialization failed for ${resolvedPath}`)
      return { notFound: true }
    }

    const status = serialized.frontmatter?.status as string
    if (!['PUBLISHED', 'CHANGED'].includes(status)) {
      logger.warn(`Unauthorized status: ${status} for path ${resolvedPath}`)
      return { notFound: true }
    }

    const seeAlsoData = await Promise.all(
      (Array.isArray(serialized.frontmatter?.seeAlso)
        ? serialized.frontmatter.seeAlso
        : [serialized.frontmatter?.seeAlso]
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

    const docsListSlug = jp
      .query(sidebarfallback, `$..[?(@.type=='markdown')]..slug`)
      .map((s) => (typeof s === 'object' ? s[currentLocale] || s.en : s))
      .filter(Boolean)

    const docsListName = jp
      .query(sidebarfallback, `$..[?(@.type=='markdown')]..name`)
      .map((n) => (typeof n === 'object' ? n : { [currentLocale]: n }))

    const index = docsListSlug.indexOf(slug)
    const pagination = {
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

    return {
      props: {
        type,
        sectionSelected,
        parentsArray,
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
          path: resolvedPath,
          seeAlsoData,
        },
        locale: currentLocale,
      },
      revalidate: 3600,
    }
  }

  logger.error(`Unhandled type: ${type}`)
  return { notFound: true }
}

export default TutorialPage
