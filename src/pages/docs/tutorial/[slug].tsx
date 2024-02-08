/* eslint-disable @typescript-eslint/no-unused-vars */
import Head from 'next/head'
import { useEffect, useState, useContext } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import jp from 'jsonpath'
import ArticlePagination from 'components/article-pagination'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGFM from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljsCurl from 'highlightjs-curl'
import remarkBlockquote from 'utils/remark_plugins/rehypeBlockquote'

import remarkImages from 'utils/remark_plugins/plaiceholder'

import { Box, Flex, Link, Text } from '@vtex/brand-ui'

import DocumentContextProvider from 'utils/contexts/documentContext'

import Contributors from 'components/contributors'
import { Item, LibraryContext, MarkdownRenderer } from '@vtexdocs/components'
import FeedbackSection from 'components/feedback-section'
import OnThisPage from 'components/on-this-page'
import SeeAlsoSection from 'components/see-also-section'
import { TableOfContents } from '@vtexdocs/components'
import Breadcrumb from 'components/breadcrumb'

import getHeadings from 'utils/getHeadings'
import getNavigation from 'utils/getNavigation'
// import getGithubFile from 'utils/getGithubFile'
import { getDocsPaths as getTutorialsPaths } from 'utils/getDocsPaths'
import replaceMagicBlocks from 'utils/replaceMagicBlocks'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'
import replaceHTMLBlocks from 'utils/replaceHTMLBlocks'
import { PreviewContext } from 'utils/contexts/preview'

import styles from 'styles/documentation-page'
import { ContributorsType } from 'utils/getFileContributors'

import { getLogger } from 'utils/logging/log-util'
import {
  flattenJSON,
  getChildren,
  getKeyByValue,
  getParents,
  localeType,
} from 'utils/navigation-utils'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'

import { remarkReadingTime } from 'utils/remark_plugins/remarkReadingTime'

import startHereImage from '../../../../public/images/start-here.png'

// import { ParsedUrlQuery } from 'querystring'

const docsPathsGLOBAL = await getTutorialsPaths('tutorials')

interface TutorialDataI {
  name: string
  children: { name: string; slug: string }[]
  hidePaginationPrevious: boolean
  hidePaginationNext: boolean
}

interface TutorialProps {
  tutorialData: TutorialDataI
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
      parentsArray: string[]
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
      parentsArray: string[]
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
      type: 'tutorial'
      componentProps: TutorialProps
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
  const intl = useIntl()

  useEffect(() => {
    if (type === 'markdown') {
      setActiveSidebarElement(slug)
      setHeadings(componentProps.headingList)
    }
  }, [])

  if (type === 'markdown') {
    return (
      <>
        <Head>
          <title>
            {componentProps.serialized.frontmatter?.title as string}
          </title>
          <meta name="docsearch:doctype" content="Tutorials & Solutions" />
          {componentProps.serialized.frontmatter?.hidden && (
            <meta name="robots" content="noindex" />
          )}
          {componentProps.serialized.frontmatter?.excerpt && (
            <meta
              property="og:description"
              content={componentProps.serialized.frontmatter?.excerpt as string}
            />
          )}
        </Head>
        <PageHeader
          title={intl.formatMessage({
            id: 'tutorial_and_solutions_page.title',
          })}
          description={intl.formatMessage({
            id: 'tutorial_and_solutions_page.description',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'tutorial_and_solutions_page.title',
          })}
        />
        <DocumentContextProvider headings={headings}>
          <Flex sx={styles.innerContainer}>
            <Box sx={styles.articleBox}>
              <Box sx={styles.contentContainer}>
                <article>
                  <header>
                    <Breadcrumb breadcrumbList={breadcrumbList} />
                    <Text sx={styles.documentationTitle} className="title">
                      {componentProps.serialized.frontmatter?.title}
                    </Text>
                    <Text sx={styles.documentationExcerpt}>
                      {componentProps.serialized.frontmatter?.excerpt}
                    </Text>
                  </header>
                  <Text sx={styles.readingTime}>
                    {intl.formatMessage(
                      {
                        id: 'documentation_reading_time.text',
                        defaultMessage: '',
                      },
                      {
                        minutes:
                          componentProps.serialized.frontmatter?.readingTime,
                      }
                    )}
                  </Text>
                  <MarkdownRenderer serialized={componentProps.serialized} />
                </article>
              </Box>

              <Box sx={styles.bottomContributorsContainer}>
                <Box sx={styles.bottomContributorsDivider} />
                <Contributors contributors={componentProps.contributors} />
              </Box>

              <FeedbackSection docPath={componentProps.path} slug={slug} />
              {isListed && (
                <ArticlePagination
                  hidePaginationNext={
                    Boolean(
                      componentProps.serialized.frontmatter?.hidePaginationNext
                    ) || false
                  }
                  hidePaginationPrevious={
                    Boolean(
                      componentProps.serialized.frontmatter
                        ?.hidePaginationPrevious
                    ) || false
                  }
                  pagination={pagination}
                />
              )}
              {componentProps.serialized.frontmatter?.seeAlso && (
                <SeeAlsoSection docs={componentProps.seeAlsoData} />
              )}
            </Box>
            <Box sx={styles.rightContainer}>
              <Contributors contributors={componentProps.contributors} />
              <TableOfContents headingList={headings} />
            </Box>
            <OnThisPage />
          </Flex>
        </DocumentContextProvider>
      </>
    )
  } else {
    return (
      <>
        <PageHeader
          title={intl.formatMessage({
            id: 'tutorial_and_solutions_page.title',
          })}
          description={intl.formatMessage({
            id: 'tutorial_and_solutions_page.description',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'tutorial_and_solutions_page.title',
          })}
        />
        <Flex sx={styles.innerContainer}>
          <Box sx={styles.articleBox}>
            <Box sx={styles.contentContainer}>
              <article>
                <header style={{ all: 'unset' }}>
                  {breadcrumbList.length > 1 ? (
                    <Breadcrumb breadcrumbList={breadcrumbList} />
                  ) : undefined}
                </header>
                <Box sx={styles.textContainer}>
                  <Box sx={styles.titleContainer}>
                    <Text>{componentProps.tutorialData?.name}</Text>
                  </Box>
                  <Box sx={styles.indexContainer}>
                    <Text sx={{ fontSize: '22px', pt: '32px' }}>
                      In this section
                    </Text>
                    <Flex sx={styles.linksContainer}>
                      {componentProps.tutorialData?.children.map((el) => (
                        <Link href={el.slug}>{el.name}</Link>
                      ))}
                    </Flex>
                  </Box>
                </Box>
              </article>
            </Box>
            <FeedbackSection slug={slug} suggestEdits={false} />
            {isListed && (
              <ArticlePagination
                hidePaginationNext={
                  componentProps.tutorialData?.hidePaginationNext || false
                }
                hidePaginationPrevious={
                  componentProps.tutorialData?.hidePaginationPrevious || false
                }
                pagination={pagination}
              />
            )}
          </Box>
        </Flex>
      </>
    )
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const slugs: { [slug: string]: { locale: string; path: string }[] } =
  //   await getTutorialsPaths('tutorials')

  // const paths: (
  //   | string
  //   | {
  //       params: ParsedUrlQuery
  //       locale?: string | undefined
  //     }
  // )[] = []
  // Object.entries(slugs).forEach(([slug, locales]) => {
  //   locales.forEach(({ locale }) => {
  //     paths.push({ params: { slug }, locale })
  //   })
  // })
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

  const breadcrumbList: { slug: string; name: string; type: string }[] = []
  parentsArrayName.forEach((_el: string, idx: number) => {
    breadcrumbList.push({
      slug: `/docs/tutorial/${parentsArray[idx]}`,
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
        slug: `/docs/tutorial/${childrenArraySlug[idx]}`,
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

    let hidePaginationPrevious = false
    if (breadcrumbList.length < 2) {
      hidePaginationPrevious = true
    }

    let hidePaginationNext = false
    if (!childrenList) {
      hidePaginationNext = true
    }

    const pagination = { previousDoc: previousDoc, nextDoc: nextDoc }

    return {
      props: {
        type: 'tutorial',
        sectionSelected: sectionSelected,
        sidebarfallback: sidebarfallback,
        parentsArray: parentsArray,
        slug: slug,
        pagination: pagination,
        isListed: isListed,
        breadcrumbList: breadcrumbList,
        branch: branch,
        componentProps: {
          tutorialData: {
            name: categoryTitle,
            children: childrenList,
            hidePaginationPrevious: hidePaginationPrevious,
            hidePaginationNext: hidePaginationNext,
          },
        },
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

  let documentationContent =
    (await fetch(
      `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
    )
      .then((res) => res.text())
      .catch((err) => console.log(err))) || ''

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
          remarkGFM,
          remarkImages,
          [getHeadings, { headingList }],
          remarkBlockquote,
          remarkReadingTime,
        ],
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
            const documentationContent =
              (await fetch(
                `https://raw.githubusercontent.com/vtexdocs/help-center-content/main/${seeAlsoPath}`
              )
                .then((res) => res.text())
                .catch((err) => console.log(err))) || ''
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

    return {
      props: {
        type: 'markdown',
        sectionSelected: sectionSelected,
        sidebarfallback: sidebarfallback,
        parentsArray: parentsArray,
        slug: slug,
        pagination: pagination,
        isListed: isListed,
        breadcrumbList: breadcrumbList,
        branch: branch,
        componentProps: {
          serialized: serialized,
          headingList: headingList,
          contributors: contributors,
          path: path,
          seeAlsoData: seeAlsoData,
        },
      },
      revalidate: 600,
    }
  } catch (error) {
    logger.error(`Error while processing ${path}\n${error}`)
    return {
      notFound: true,
    }
  }

  // if (!path) {
  //   let tutorialTitle = ''
  //   let tutorialChildren
  //   let cat
  //   let tutorialType = ''

  //   // substituir por flattened sidebar
  //   sidebarfallback.forEach((elem) => {
  //     const category = elem.categories.find(
  //       (e) => e.type === 'tutorial-category'
  //     )
  //     if (category) {
  //       cat = category
  //       tutorialTitle = category.name[currentLocale]
  //       // tutorialChildren = getChildren(category, currentLocale)
  //       tutorialType = category.type
  //     }
  //   })

  //   if (cat) {
  //     const flattenedSidebar = flattenJSON(sidebarfallback)
  //     const parentsArray: string[] = []
  //     const parentsArrayName: string[] = []
  //     const parentsArrayType: string[] = []
  //     const childrenArrayName: string[] = []
  //     const childrenArraySlug: string[] = []
  //     const keyPath = getKeyByValue(flattenedSidebar, slug)
  //     let categoryTitle = ''
  //     let sectionSelected = ''
  //     const isListed: boolean = getKeyByValue(flattenedSidebar, slug)
  //       ? true
  //       : false

  //     // console.log('CAT', cat.type, cat.slug, slug)
  //     if (keyPath) {
  //       console.log('CAT', keyPath, flattenedSidebar[keyPath])

  //       getChildren(
  //         keyPath,
  //         'name',
  //         flattenedSidebar,
  //         currentLocale,
  //         childrenArrayName
  //       )
  //       getChildren(
  //         keyPath,
  //         'slug',
  //         flattenedSidebar,
  //         currentLocale,
  //         childrenArraySlug
  //       )
  //       getParents(
  //         keyPath,
  //         'slug',
  //         flattenedSidebar,
  //         currentLocale,
  //         parentsArray
  //       )
  //       parentsArray.push(slug)
  //       getParents(
  //         keyPath,
  //         'name',
  //         flattenedSidebar,
  //         currentLocale,
  //         parentsArrayName
  //       )
  //       const mainKeyPath = keyPath.split('slug')[0]
  //       const nameKeyPath = mainKeyPath.concat(`name.${locale}`)
  //       categoryTitle = flattenedSidebar[nameKeyPath]
  //       parentsArrayName.push(categoryTitle)
  //       getParents(
  //         keyPath,
  //         'type',
  //         flattenedSidebar,
  //         currentLocale,
  //         parentsArrayType
  //       )
  //       const typeKeyPath = mainKeyPath.concat('type')
  //       parentsArrayType.push(flattenedSidebar[typeKeyPath])
  //       sectionSelected = flattenedSidebar[`${keyPath[0]}.documentation`]
  //     }

  //     const breadcrumbList: { slug: string; name: string; type: string }[] = []
  //     parentsArrayName.forEach((_el: string, idx: number) => {
  //       breadcrumbList.push({
  //         slug: `/docs/tutorial/${parentsArray[idx]}`,
  //         name: parentsArrayName[idx],
  //         type: parentsArrayType[idx],
  //       })
  //     })

  //     const childrenList: { slug: string; name: string }[] = []
  //     childrenArrayName.forEach((_el: string, idx: number) => {
  //       childrenList.push({
  //         slug: `/docs/tutorial/${childrenArraySlug[idx]}`,
  //         name: childrenArrayName[idx],
  //       })
  //     })

  //     // let pagination: {
  //     //   previousDoc: {
  //     //     slug: string
  //     //     name: string
  //     //   }
  //     //   nextDoc: {
  //     //     slug: string
  //     //     name: string
  //     //   }
  //     // } =

  //     const previousDoc: { slug: string; name: string } =
  //       breadcrumbList.length > 1
  //         ? {
  //             slug: breadcrumbList[breadcrumbList.length - 2].slug,
  //             name: breadcrumbList[breadcrumbList.length - 2].name,
  //           }
  //         : {
  //             slug: '',
  //             name: '',
  //           }
  //     const nextDoc: { slug: string; name: string } = {
  //       slug: childrenList[0].slug,
  //       name: childrenList[0].name,
  //     }

  //     let hidePaginationPrevious = false
  //     if (breadcrumbList.length < 2) {
  //       hidePaginationPrevious = true
  //     }

  //     let hidePaginationNext = false
  //     if (!childrenList) {
  //       hidePaginationNext = true
  //     }

  //     const pagination = { previousDoc: previousDoc, nextDoc: nextDoc }

  //     return {
  //       props: {
  //         type: 'tutorial',
  //         sectionSelected: sectionSelected,
  //         sidebarfallback: sidebarfallback,
  //         parentsArray: parentsArray,
  //         slug: slug,
  //         pagination: pagination,
  //         isListed: isListed,
  //         breadcrumbList: breadcrumbList,
  //         branch: branch,
  //         componentProps: {
  //           // serialized: '',
  //           // headingList: [],
  //           // contributors: [],
  //           // path: '',
  //           // seeAlsoData: '',
  //           // type: docType,
  //           tutorialData: {
  //             name: categoryTitle,
  //             children: childrenList,
  //             hidePaginationPrevious: hidePaginationPrevious,
  //             hidePaginationNext: hidePaginationNext,
  //           },
  //         },
  //       },
  //       revalidate: 600,
  //     }
  //   }

  //   return {
  //     notFound: true,
  //   }
  // }

  // // let documentationContent = await getGithubFile(
  // //   'vtexdocs',
  // //   'help-center-content',
  // //   branch,
  // //   pathcontribut
  // // )

  // let documentationContent =
  //   (await fetch(
  //     `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
  //   )
  //     .then((res) => res.text())
  //     .catch((err) => console.log(err))) || ''

  // // const contributors =
  // //   (await getFileContributors(
  // //     'vtexdocs',
  // //     'help-center-content',
  // //     branch,
  // //     path
  // //   ).catch((err) => {
  // //     console.log(err)
  // //   })) || []

  // const contributors =
  //   (await fetch(
  //     `https://github.com/vtexdocs/help-center-content/file-contributors/${branch}/${path}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then(({ users }) => {
  //       const result: ContributorsType[] = []
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       for (let i = 0; i < users.length; i++) {
  //         const user = users[i]
  //         if (user.id === '41898282') continue
  //         result.push({
  //           name: user.login,
  //           login: user.login,
  //           avatar: user.primaryAvatarUrl,
  //           userPage: `https://github.com${user.profileLink}`,
  //         })
  //       }

  //       return result
  //     })
  //     .catch((err) => console.log(err))) || []

  // let format: 'md' | 'mdx' = 'mdx'
  // try {
  //   if (path.endsWith('.md')) {
  //     documentationContent = escapeCurlyBraces(documentationContent)
  //     documentationContent = replaceHTMLBlocks(documentationContent)
  //     documentationContent = await replaceMagicBlocks(documentationContent)
  //   }
  // } catch (error) {
  //   logger.error(`${error}`)
  //   format = 'md'
  // }

  // try {
  //   const headingList: Item[] = []
  //   let serialized = await serialize(documentationContent, {
  //     parseFrontmatter: true,
  //     mdxOptions: {
  //       remarkPlugins: [
  //         remarkGFM,
  //         remarkImages,
  //         [getHeadings, { headingList }],
  //         remarkBlockquote,
  //       ],
  //       rehypePlugins: [
  //         [rehypeHighlight, { languages: { hljsCurl }, ignoreMissing: true }],
  //       ],
  //       format,
  //     },
  //   })

  //   serialized = JSON.parse(JSON.stringify(serialized))

  //   logger.info(`Processing ${slug}`)
  //   const seeAlsoData: {
  //     url: string
  //     title: string
  //     category: string
  //   }[] = []
  //   const seeAlsoUrls = serialized.frontmatter?.seeAlso
  //     ? JSON.parse(JSON.stringify(serialized.frontmatter.seeAlso as string))
  //     : []
  //   await Promise.all(
  //     seeAlsoUrls.map(async (seeAlsoUrl: string) => {
  //       const seeAlsoPath = docsPaths[seeAlsoUrl.split('/')[3]].find(
  //         (e) => e.locale === locale
  //       )?.path
  //       if (seeAlsoPath) {
  //         try {
  //           const documentationContent =
  //             (await fetch(
  //               `https://raw.githubusercontent.com/vtexdocs/help-center-content/main/${seeAlsoPath}`
  //             )
  //               .then((res) => res.text())
  //               .catch((err) => console.log(err))) || ''
  //           // const documentationContent = await getGithubFile(
  //           //   'vtexdocs',
  //           //   'help-center-content',
  //           //   'main',
  //           //   seeAlsoPath
  //           // )
  //           const serialized = await serialize(documentationContent, {
  //             parseFrontmatter: true,
  //           })
  //           seeAlsoData.push({
  //             url: seeAlsoUrl,
  //             title: serialized.frontmatter?.title
  //               ? (serialized.frontmatter.title as string)
  //               : seeAlsoUrl.split('/')[3],
  //             category: serialized.frontmatter?.category
  //               ? (serialized.frontmatter.category as string)
  //               : seeAlsoUrl.split('/')[2],
  //           })
  //         } catch (error) {}
  //       } else if (seeAlsoUrl.startsWith('/docs')) {
  //         seeAlsoData.push({
  //           url: seeAlsoUrl,
  //           title: seeAlsoUrl.split('/')[3],
  //           category: seeAlsoUrl.split('/')[2],
  //         })
  //       }
  //     })
  //   )

  //   const docsListSlug = jp.query(
  //     sidebarfallback,
  //     `$..[?(@.type=='markdown')]..slug`
  //   )
  //   const docsListName = jp.query(
  //     sidebarfallback,
  //     `$..[?(@.type=='markdown')]..name`
  //   )
  //   const indexOfSlug = docsListSlug.indexOf(slug)
  //   const pagination = {
  //     previousDoc: {
  //       slug: docsListSlug[indexOfSlug - 1]
  //         ? docsListSlug[indexOfSlug - 1]
  //         : null,
  //       name: docsListName[indexOfSlug - 1]
  //         ? docsListName[indexOfSlug - 1][locale || 'en']
  //         : null,
  //     },
  //     nextDoc: {
  //       slug: docsListSlug[indexOfSlug + 1]
  //         ? docsListSlug[indexOfSlug + 1]
  //         : null,
  //       name: docsListName[indexOfSlug + 1]
  //         ? docsListName[indexOfSlug + 1][locale || 'en']
  //         : null,
  //     },
  //   }

  //   const flattenedSidebar = flattenJSON(sidebarfallback)
  //   const isListed: boolean = getKeyByValue(flattenedSidebar, slug)
  //     ? true
  //     : false
  //   const keyPath = getKeyByValue(flattenedSidebar, slug)
  //   const parentsArray: string[] = []
  //   const parentsArrayName: string[] = []
  //   const parentsArrayType: string[] = []
  //   let sectionSelected = ''
  //   if (keyPath) {
  //     console.log('doc', keyPath[0], keyPath)
  //     sectionSelected = flattenedSidebar[`${keyPath[0]}.documentation`]
  //     console.log('doc', sectionSelected)
  //     getParents(keyPath, 'slug', flattenedSidebar, currentLocale, parentsArray)
  //     parentsArray.push(slug)
  //     getParents(
  //       keyPath,
  //       'name',
  //       flattenedSidebar,
  //       currentLocale,
  //       parentsArrayName
  //     )
  //     getParents(
  //       keyPath,
  //       'type',
  //       flattenedSidebar,
  //       currentLocale,
  //       parentsArrayType
  //     )
  //   }

  //   const breadcrumbList: { slug: string; name: string; type: string }[] = []
  //   parentsArrayName.forEach((_el: string, idx: number) => {
  //     breadcrumbList.push({
  //       slug: `/docs/tutorial/${parentsArray[idx]}`,
  //       name: parentsArrayName[idx],
  //       type: parentsArrayType[idx],
  //     })
  //   })

  //   return {
  //     props: {
  //       type: 'markdown',
  //       sectionSelected: sectionSelected,
  //       sidebarfallback: sidebarfallback,
  //       parentsArray: parentsArray,
  //       slug: slug,
  //       pagination: pagination,
  //       isListed: isListed,
  //       breadcrumbList: breadcrumbList,
  //       branch: branch,
  //       componentProps: {
  //         serialized: serialized,
  //         headingList: headingList,
  //         contributors: contributors,
  //         path: path,
  //         seeAlsoData: seeAlsoData,
  //       },
  //     },
  //     revalidate: 600,
  //   }
  // } catch (error) {
  //   logger.error(`Error while processing ${path}\n${error}`)
  //   return {
  //     notFound: true,
  //   }
  // }
}

export default TutorialPage
