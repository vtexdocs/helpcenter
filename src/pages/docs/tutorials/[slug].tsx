import { useEffect, useState, useContext } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps } from 'next' // MODIFIED: Changed GetServerSideProps to GetStaticProps
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import jp from 'jsonpath'

import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'

import remarkImages from 'utils/remark_plugins/plaiceholder'

import { Item, LibraryContext } from '@vtexdocs/components'

import getHeadings from 'utils/getHeadings'
import getNavigation from 'utils/getNavigation'
import getGithubFile from 'utils/getGithubFile' // ADDED: Import getGithubFile
import { getDocsPaths as getTutorialsPaths } from 'utils/getDocsPaths'
import replaceMagicBlocks from 'utils/replaceMagicBlocks'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import getFileContributors, {
  ContributorsType,
} from 'utils/getFileContributors' // ADDED: Import getFileContributors

import { getLogger } from 'utils/logging/log-util'
import {
  flattenJSON,
  getChildren,
  getKeyByValue,
  getParents,
  localeType,
} from 'utils/navigation-utils'

import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'
import { remarkCodeHike } from '@code-hike/mdx'
import TutorialIndexing from 'components/tutorial-index'
import TutorialMarkdownRender from 'components/tutorial-markdown-render'
import theme from 'styles/code-hike-theme'
import { getBreadcrumbsList } from 'utils/getBreadcrumbsList'

// Initialize in getStaticProps
let docsPathsGLOBAL: Record<string, { locale: string; path: string }[]> | null =
  null

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
    if (type === 'markdown') {
      setActiveSidebarElement(slug)
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
      name={componentProps.tutorialData.name}
      children={componentProps.tutorialData.children}
      hidePaginationNext={componentProps.tutorialData.hidePaginationNext}
      hidePaginationPrevious={
        componentProps.tutorialData.hidePaginationPrevious
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

// ADDED: PreviewData interface
interface PreviewData {
  branch?: string
}

// MODIFIED: Changed getServerSideProps to GetStaticProps
export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
  preview,
  previewData,
}) => {
  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as PreviewData).branch || 'main'
      : 'main'
  const branch = preview ? previewBranch : 'main'

  const slug = params?.slug as string
  // MODIFIED: currentLocale to use params.lang first
  const langFromParams = params?.lang as string | undefined
  const currentLocale: localeType = (langFromParams ||
    locale ||
    'en') as localeType

  const logger = getLogger('TutorialsPage-GetStaticProps') // MODIFIED: Logger name

  const sidebarfallback = await getNavigation()
  const flattenedSidebar = flattenJSON(sidebarfallback)
  const keyPath = getKeyByValue(flattenedSidebar, slug)

  if (!keyPath) {
    logger.warn(
      `File exists in the repo but not in navigation: slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
    )
    return { notFound: true, revalidate: 3600 }
  }

  const keyPathType = keyPath.split('slug')[0].concat('type')
  const type = flattenedSidebar[keyPathType]

  const parentsArray: string[] = []
  const parentsArrayName: string[] = []
  const parentsArrayType: string[] = []

  const isListed = !(keyPath === undefined)

  getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
  parentsArray.push(slug)

  const sanitizedParentsArray = parentsArray.map((item) =>
    item === undefined ? null : item
  )

  getParents(keyPath, 'name', flattenedSidebar, currentLocale, parentsArrayName)
  const mainKeyPath = keyPath.split('slug')[0]
  const nameKeyPath = mainKeyPath.concat(`name.${currentLocale}`) // MODIFIED: use currentLocale
  const categoryTitle = flattenedSidebar[nameKeyPath]
  parentsArrayName.push(categoryTitle)

  getParents(keyPath, 'type', flattenedSidebar, currentLocale, parentsArrayType)
  const typeKeyPath = mainKeyPath.concat('type')
  parentsArrayType.push(flattenedSidebar[typeKeyPath])

  const sectionSelected = flattenedSidebar[`${keyPath[0]}.documentation`]
  logger.info(
    // MODIFIED: console.log to logger.info
    `Tutorial section selected: ${sectionSelected} for slug: ${slug}`
  )

  const breadcrumbList: { slug: string; name: string; type: string }[] =
    getBreadcrumbsList(
      parentsArray,
      parentsArrayName,
      parentsArrayType,
      'tutorials'
    )

  if (type === 'tutorial-category') {
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

    const childrenList: { slug: string; name: string }[] = []
    childrenArrayName.forEach((_el: string, idx: number) => {
      childrenList.push({
        // MODIFIED: Use currentLocale in slug
        slug: `/${currentLocale}/docs/tutorials/${childrenArraySlug[idx]}`,
        name: childrenArrayName[idx],
      })
    })

    const previousDoc: { slug: string | null; name: string | null } = // MODIFIED: Allow null
      breadcrumbList.length > 1 && breadcrumbList[breadcrumbList.length - 2]
        ? {
            slug: breadcrumbList[breadcrumbList.length - 2].slug,
            name: breadcrumbList[breadcrumbList.length - 2].name,
          }
        : {
            slug: null, // MODIFIED: Use null for consistency
            name: null,
          }
    const nextDoc: { slug: string | null; name: string | null } = // MODIFIED: Allow null
      childrenList.length > 0 && childrenList[0]
        ? {
            slug: childrenList[0].slug,
            name: childrenList[0].name,
          }
        : {
            slug: null, // MODIFIED: Use null if no children
            name: null,
          }

    const pagination = { previousDoc, nextDoc }
    const componentProps = {
      tutorialData: {
        name: categoryTitle || slug, // Fallback to slug if categoryTitle is undefined
        children: childrenList,
        hidePaginationPrevious: breadcrumbList.length < 2,
        hidePaginationNext: !childrenList.length,
      },
    }

    return {
      props: {
        type,
        sectionSelected,
        // ❌ REMOVED: sidebarfallback (3.4MB navigation no longer sent to client)
        parentsArray: sanitizedParentsArray,
        slug,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        componentProps,
        locale: currentLocale, // ADDED: locale prop
      },
      revalidate: 3600, // ADDED: revalidate
    }
  }

  // Handle 'markdown' type
  if (!docsPathsGLOBAL) {
    docsPathsGLOBAL = await getTutorialsPaths('tutorials')
  }
  const docsPaths =
    preview || process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
      ? await getTutorialsPaths('tutorials', branch)
      : docsPathsGLOBAL

  const pathEntry = docsPaths[slug]?.find((e) => e.locale === currentLocale)

  if (!pathEntry?.path) {
    logger.info(
      `Path not found for slug: ${slug}, locale: ${currentLocale}, branch: ${branch}`
    )
    // REMOVED: redirectToLocalizedUrl call
    return { notFound: true, revalidate: 3600 } // ADDED: revalidate
  }
  const resolvedPath = pathEntry.path

  let documentationContent: string | null = null
  try {
    // MODIFIED: Use getGithubFile to fetch documentation content
    documentationContent = await getGithubFile(
      'vtexdocs',
      'help-center-content',
      branch,
      resolvedPath
    )
  } catch (err) {
    // MODIFIED: Add type to err
    logger.error(
      `Error fetching content for ${resolvedPath} on branch ${branch}: ${
        err instanceof Error ? err.message : err
      }`
    )
    return { notFound: true, revalidate: 3600 } // ADDED: revalidate
  }
  documentationContent = documentationContent || ''

  // MODIFIED: Use getFileContributors to fetch contributors
  let contributors: ContributorsType[] = []
  try {
    const fetchedContributors = await getFileContributors(
      'vtexdocs',
      'help-center-content',
      branch,
      resolvedPath
    )
    if (Array.isArray(fetchedContributors)) {
      contributors = fetchedContributors
    } else {
      logger.info(
        `Fetched contributors is not an array for ${resolvedPath} on branch ${branch}. Received: ${typeof fetchedContributors}`
      )
    }
  } catch (err) {
    // MODIFIED: Add type to err and use logger.info
    logger.info(
      `Error fetching contributors for ${resolvedPath} on branch ${branch}: ${
        err instanceof Error ? err.message : err
      }`
    )
  }

  let format: 'md' | 'mdx' = 'mdx'
  try {
    if (resolvedPath.endsWith('.md')) {
      // MODIFIED: Use resolvedPath
      documentationContent = escapeCurlyBraces(documentationContent)
      documentationContent = replaceHTMLBlocks(documentationContent)
      documentationContent = await replaceMagicBlocks(documentationContent)
    }
  } catch (error) {
    // MODIFIED: Add type to error
    logger.error(
      `Error processing markdown for ${resolvedPath}: ${
        error instanceof Error ? error.message : error
      }`
    )
    format = 'md'
  }

  try {
    const headingList: Item[] = []
    let serialized = await serialize(documentationContent, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          [remarkCodeHike, theme],
          remarkGFM,
          remarkImages,
          [getHeadings, { headingList }],
          remarkBlockquote,
          remarkReadingTime,
        ],
        useDynamicImport: true,
        rehypePlugins: [
          [rehypeHighlight, { languages: { hljsCurl }, ignoreMissing: true }],
        ],
        format,
      },
    })

    // Allow PUBLISHED and CHANGED status documents to be visible
    const allowedStatuses = ['PUBLISHED', 'CHANGED']
    const status = serialized.frontmatter?.status as string

    if (status && !allowedStatuses.includes(status)) {
      logger.info(
        `Document status is not allowed for ${resolvedPath}. Status: ${status}, Allowed: ${allowedStatuses.join(
          ', '
        )}`
      )
      return { notFound: true, revalidate: 3600 }
    }

    serialized = JSON.parse(JSON.stringify(serialized))

    logger.info(`Processing markdown for ${slug} (path: ${resolvedPath})`)
    const seeAlsoData: {
      url: string
      title: string
      category: string
    }[] = []

    // Handle seeAlso frontmatter which could be string or string[]
    let seeAlsoUrls: string[] = []
    if (serialized.frontmatter?.seeAlso) {
      const seeAlsoValue = serialized.frontmatter.seeAlso
      if (Array.isArray(seeAlsoValue)) {
        seeAlsoUrls = seeAlsoValue
      } else if (typeof seeAlsoValue === 'string') {
        try {
          seeAlsoUrls = JSON.parse(seeAlsoValue)
        } catch {
          seeAlsoUrls = [seeAlsoValue]
        }
      }
    }

    await Promise.all(
      seeAlsoUrls.map(async (seeAlsoUrl: string) => {
        // MODIFIED: Use currentLocale for finding seeAlsoPath
        const seeAlsoPathEntry = docsPaths[seeAlsoUrl.split('/')[3]]?.find(
          (e) => e.locale === currentLocale
        )
        const seeAlsoPath = seeAlsoPathEntry?.path

        if (seeAlsoPath) {
          try {
            // MODIFIED: Use getGithubFile for seeAlso content, assuming 'main' branch for linked content
            const seeAlsoContent = await getGithubFile(
              'vtexdocs',
              'help-center-content',
              'main', // Or 'branch' if seeAlso should respect current branch
              seeAlsoPath
            )

            if (seeAlsoContent) {
              const seeAlsoSerialized = await serialize(seeAlsoContent, {
                parseFrontmatter: true,
              })
              seeAlsoData.push({
                url: seeAlsoUrl,
                title: seeAlsoSerialized.frontmatter?.title
                  ? (seeAlsoSerialized.frontmatter.title as string)
                  : seeAlsoUrl.split('/')[3],
                category: seeAlsoSerialized.frontmatter?.category
                  ? (seeAlsoSerialized.frontmatter.category as string)
                  : seeAlsoUrl.split('/')[2],
              })
            } else {
              logger.info(`No content found for seeAlsoPath: ${seeAlsoPath}`)
            }
          } catch (error) {
            // MODIFIED: Add type to error
            logger.error(
              `Error fetching or serializing seeAlso content for ${seeAlsoPath}: ${
                error instanceof Error ? error.message : error
              }`
            )
          }
        } else if (seeAlsoUrl.startsWith('/docs')) {
          seeAlsoData.push({
            url: seeAlsoUrl,
            title: seeAlsoUrl.split('/')[3],
            category: seeAlsoUrl.split('/')[2],
          })
        }
      })
    )

    // Extract slug strings for the current locale from navigation
    const docsListSlugObjects = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..slug`
    )
    const docsListNameObjects = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..name`
    )

    // Convert slug objects to strings for the current locale
    const docsListSlug = docsListSlugObjects
      .map((slugObj: Record<string, string> | string) => {
        if (typeof slugObj === 'object' && slugObj[currentLocale]) {
          return slugObj[currentLocale]
        } else if (typeof slugObj === 'string') {
          return slugObj
        }
        // Fallback to 'en' if current locale not found
        return (slugObj as Record<string, string>)?.en || null
      })
      .filter(Boolean)

    const docsListName = docsListNameObjects.map(
      (nameObj: Record<string, string> | string) => {
        if (typeof nameObj === 'object') {
          return nameObj
        }
        // If it's already a string, wrap it in an object for consistency
        return { [currentLocale]: nameObj as string }
      }
    )

    const indexOfSlug = docsListSlug.indexOf(slug)

    logger.info(
      `Slug matching for ${slug}: found at index ${indexOfSlug} in ${docsListSlug.length} total docs`
    )

    // Log pagination status for debugging
    if (indexOfSlug >= 0) {
      logger.info(
        `Pagination for ${slug}: previous=${
          indexOfSlug > 0 ? docsListSlug[indexOfSlug - 1] : 'none'
        }, next=${
          indexOfSlug < docsListSlug.length - 1
            ? docsListSlug[indexOfSlug + 1]
            : 'none'
        }`
      )
    } else {
      logger.warn(`Document not found in navigation for slug: ${slug}`)
    }

    const pagination = {
      previousDoc: {
        slug:
          indexOfSlug > 0 && docsListSlug[indexOfSlug - 1]
            ? docsListSlug[indexOfSlug - 1]
            : null,
        name:
          indexOfSlug > 0 && docsListName[indexOfSlug - 1]
            ? docsListName[indexOfSlug - 1][currentLocale] ||
              docsListName[indexOfSlug - 1]['en']
            : null,
      },
      nextDoc: {
        slug:
          indexOfSlug >= 0 &&
          indexOfSlug < docsListSlug.length - 1 &&
          docsListSlug[indexOfSlug + 1]
            ? docsListSlug[indexOfSlug + 1]
            : null,
        name:
          indexOfSlug >= 0 &&
          indexOfSlug < docsListSlug.length - 1 &&
          docsListName[indexOfSlug + 1]
            ? docsListName[indexOfSlug + 1][currentLocale] ||
              docsListName[indexOfSlug + 1]['en']
            : null,
      },
    }

    const componentProps = {
      content: documentationContent, // ADDED: content prop for MarkdownRender
      serialized,
      headingList,
      contributors,
      path: resolvedPath, // MODIFIED: use resolvedPath
      seeAlsoData,
    }

    return {
      props: {
        type, // ADDED: type for markdown pages
        sectionSelected,
        // ❌ REMOVED: sidebarfallback (3.4MB navigation no longer sent to client)
        parentsArray: sanitizedParentsArray,
        slug,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        componentProps,
        locale: currentLocale, // ADDED: locale prop
      },
      revalidate: 3600, // ADDED: revalidate
    }
  } catch (error) {
    // MODIFIED: Add type to error
    logger.error(
      `Error processing markdown page ${slug} (path: ${
        resolvedPath || 'unknown'
      }): ${error instanceof Error ? error.message : error}`
    )
    return { notFound: true, revalidate: 3600 } // ADDED: revalidate
  }
}

export default TutorialPage
