import { useEffect, useState, useContext } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
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
// import getGithubFile from 'utils/getGithubFile'
import { getDocsPaths as getTutorialsPaths } from 'utils/getDocsPaths'
import replaceMagicBlocks from 'utils/replaceMagicBlocks'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import { ContributorsType } from 'utils/getFileContributors'

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

// import { ParsedUrlQuery } from 'querystring'

const docsPathsGLOBAL = await getTutorialsPaths('tutorials')

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
      sidebarfallback: any //eslint-disable-line
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
      sidebarfallback: any //eslint-disable-line
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
  const slugs: { [slug: string]: { locale: string; path: string }[] } =
    await getTutorialsPaths('tutorials')

  const paths = Object.entries(slugs).flatMap(([slug, locales]) =>
    locales.map(({ locale }) => ({
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
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const slug = params?.slug as string
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)
  const logger = getLogger('Tutorials & Solutions')

  const sidebarfallback = await getNavigation()
  const flattenedSidebar = flattenJSON(sidebarfallback)
  const keyPath = getKeyByValue(flattenedSidebar, slug)

  if (!keyPath) {
    return {
      notFound: true,
    }
  }

  const keyPathType = keyPath.split('slug')[0].concat('type')
  const type = flattenedSidebar[keyPathType]

  const parentsArray: string[] = []
  const parentsArrayName: string[] = []
  const parentsArrayType: string[] = []

  const isListed = !(keyPath === undefined)

  getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
  parentsArray.push(slug)

  getParents(keyPath, 'name', flattenedSidebar, currentLocale, parentsArrayName)
  const mainKeyPath = keyPath.split('slug')[0]
  const nameKeyPath = mainKeyPath.concat(`name.${locale}`)
  const categoryTitle = flattenedSidebar[nameKeyPath]
  parentsArrayName.push(categoryTitle)

  getParents(keyPath, 'type', flattenedSidebar, currentLocale, parentsArrayType)
  const typeKeyPath = mainKeyPath.concat('type')
  parentsArrayType.push(flattenedSidebar[typeKeyPath])

  const sectionSelected = flattenedSidebar[`${keyPath[0]}.documentation`]
  console.log('TUTORIAL', sectionSelected)

  const breadcrumbList: { slug: string; name: string; type: string }[] = []
  parentsArrayName.forEach((_el: string, idx: number) => {
    breadcrumbList.push({
      slug: `/${locale}/docs/tutorial/${parentsArray[idx]}`,
      name: parentsArrayName[idx],
      type: parentsArrayType[idx],
    })
  })

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
        slug: `/${locale}/docs/tutorial/${childrenArraySlug[idx]}`,
        name: childrenArrayName[idx],
      })
    })

    const previousDoc: { slug: string; name: string } =
      breadcrumbList.length > 1
        ? {
            slug: breadcrumbList[breadcrumbList.length - 2].slug,
            name: breadcrumbList[breadcrumbList.length - 2].name,
          }
        : {
            slug: '',
            name: '',
          }
    const nextDoc: { slug: string; name: string } = {
      slug: childrenList[0].slug,
      name: childrenList[0].name,
    }

    const pagination = { previousDoc, nextDoc }
    const componentProps = {
      tutorialData: {
        name: categoryTitle,
        children: childrenList,
        hidePaginationPrevious: breadcrumbList.length < 2,
        hidePaginationNext: !childrenList.length,
      },
    }

    return {
      props: {
        type,
        sectionSelected,
        sidebarfallback,
        parentsArray: parentsArray.map((item) =>
          item === undefined ? null : item
        ),
        slug,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        componentProps,
      },
      revalidate: 600,
    }
  }

  const docsPaths =
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
      ? docsPathsGLOBAL
      : await getTutorialsPaths('tutorials', branch)

  const path = docsPaths[slug]?.find((e) => e.locale === locale)?.path

  if (!path) {
    return {
      notFound: true,
    }
  }

  let documentationContent = await fetch(
    `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
  )
    .then((res) => res.text())
    .catch((err) => {
      logger.error(err)
      return ''
    })

  const contributors =
    (await fetch(
      `https://github.com/vtexdocs/help-center-content/file-contributors/${branch}/${path}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then(({ users }) => {
        const result: ContributorsType[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (let i = 0; i < users.length; i++) {
          const user = users[i]
          if (user.id === '41898282') continue
          result.push({
            name: user.login,
            login: user.login,
            avatar: user.primaryAvatarUrl,
            userPage: `https://github.com${user.profileLink}`,
          })
        }

        return result
      })
      .catch((err) => console.log(err))) || []

  let format: 'md' | 'mdx' = 'mdx'
  try {
    if (path.endsWith('.md')) {
      documentationContent = escapeCurlyBraces(documentationContent)
      documentationContent = replaceHTMLBlocks(documentationContent)
      documentationContent = await replaceMagicBlocks(documentationContent)
    }
  } catch (error) {
    logger.error(`${error}`)
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

    serialized = JSON.parse(JSON.stringify(serialized))

    logger.info(`Processing ${slug}`)
    const seeAlsoData: {
      url: string
      title: string
      category: string
    }[] = []
    const seeAlsoUrls = serialized.frontmatter?.seeAlso
      ? JSON.parse(JSON.stringify(serialized.frontmatter.seeAlso as string))
      : []
    await Promise.all(
      seeAlsoUrls.map(async (seeAlsoUrl: string) => {
        const seeAlsoPath = docsPaths[seeAlsoUrl.split('/')[3]].find(
          (e) => e.locale === locale
        )?.path
        if (seeAlsoPath) {
          try {
            const documentationContent = await fetch(
              `https://raw.githubusercontent.com/vtexdocs/help-center-content/main/${seeAlsoPath}`
            )
              .then((res) => res.text())
              .catch((err) => {
                logger.error(err)
                return ''
              })
            // const documentationContent = await getGithubFile(
            //   'vtexdocs',
            //   'help-center-content',
            //   'main',
            //   seeAlsoPath
            // )
            const serialized = await serialize(documentationContent, {
              parseFrontmatter: true,
            })
            seeAlsoData.push({
              url: seeAlsoUrl,
              title: serialized.frontmatter?.title
                ? (serialized.frontmatter.title as string)
                : seeAlsoUrl.split('/')[3],
              category: serialized.frontmatter?.category
                ? (serialized.frontmatter.category as string)
                : seeAlsoUrl.split('/')[2],
            })
          } catch (error) {}
        } else if (seeAlsoUrl.startsWith('/docs')) {
          seeAlsoData.push({
            url: seeAlsoUrl,
            title: seeAlsoUrl.split('/')[3],
            category: seeAlsoUrl.split('/')[2],
          })
        }
      })
    )

    const docsListSlug = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..slug`
    )
    const docsListName = jp.query(
      sidebarfallback,
      `$..[?(@.type=='markdown')]..name`
    )
    const indexOfSlug = docsListSlug.indexOf(slug)
    const pagination = {
      previousDoc: {
        slug: docsListSlug[indexOfSlug - 1]
          ? docsListSlug[indexOfSlug - 1]
          : null,
        name: docsListName[indexOfSlug - 1]
          ? docsListName[indexOfSlug - 1][locale || 'en']
          : null,
      },
      nextDoc: {
        slug: docsListSlug[indexOfSlug + 1]
          ? docsListSlug[indexOfSlug + 1]
          : null,
        name: docsListName[indexOfSlug + 1]
          ? docsListName[indexOfSlug + 1][locale || 'en']
          : null,
      },
    }

    const componentProps = {
      serialized,
      headingList,
      contributors,
      path,
      seeAlsoData,
    }

    return {
      props: {
        type,
        sectionSelected,
        sidebarfallback,
        parentsArray,
        slug,
        pagination,
        isListed,
        breadcrumbList,
        branch,
        componentProps,
      },
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${path}\n${error}`)
    return {
      notFound: true,
    }
  }
}

export default TutorialPage
