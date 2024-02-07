import { Flex } from '@vtex/brand-ui'
import { GetStaticProps, NextPage } from 'next'
import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import getNavigation from 'utils/getNavigation'

import { FaqCardDataElement, sortByType } from 'utils/typings/types'
import Head from 'next/head'
import styles from 'styles/known-issues-page'
import { PreviewContext } from 'utils/contexts/preview'
import { Fragment, useContext, useMemo, useState } from 'react'
import { getDocsPaths as getFaqPaths } from 'utils/getDocsPaths'
import { serialize } from 'next-mdx-remote/serialize'
import { getLogger } from 'utils/logging/log-util'
import PageHeader from 'components/page-header'
import { useIntl } from 'react-intl'
import startHereImage from '../../../public/images/faq.png'
import Pagination from 'components/pagination'
import { localeType } from 'utils/navigation-utils'
import Select from 'components/select'
import { sortBy } from 'utils/constants'
import FaqCard from 'components/faq-card'

interface Props {
  sidebarfallback: any //eslint-disable-line
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  faqData: FaqCardDataElement[]
  branch: string
  page: number
  totalPages: number
}

const docsPathsGLOBAL = await getFaqPaths('faq')

const FaqPage: NextPage<Props> = ({ faqData, branch }) => {
  const intl = useIntl()
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)
  const itemsPerPage = 10
  const [page, setPage] = useState({ curr: 1, total: 1 })
  const [sortByValue, setSortByValue] = useState<sortByType>('newest')

  const filteredResult = useMemo(() => {
    const data = faqData

    data.sort((a, b) => {
      const dateA =
        sortByValue === 'newest' ? new Date(b.createdAt) : new Date(b.updatedAt)
      const dateB =
        sortByValue === 'newest' ? new Date(a.createdAt) : new Date(a.updatedAt)

      return dateA.getTime() - dateB.getTime()
    })

    setPage({ curr: 1, total: Math.ceil(data.length / itemsPerPage) })

    return data
  }, [sortByValue, intl.locale])

  const paginatedResult = useMemo(() => {
    return filteredResult.slice(
      (page.curr - 1) * itemsPerPage,
      page.curr * itemsPerPage
    )
  }, [page])

  function handleClick(props: { selected: number }) {
    if (props.selected !== undefined && props.selected !== page.curr)
      setPage({ ...page, curr: props.selected })
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
        </title>
        <meta
          property="og:title"
          content={intl.formatMessage({
            id: 'landing_page_faq.description',
          })}
          key="title"
        />
      </Head>
      <Fragment>
        <PageHeader
          title={intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
          description={intl.formatMessage({
            id: 'landing_page_faq.description',
          })}
          imageUrl={startHereImage}
          imageAlt={intl.formatMessage({
            id: 'landing_page_faq.title',
          })}
        />
        <Flex sx={styles.container}>
          <Flex sx={styles.optionContainer}>
            <Select
              label={intl.formatMessage({ id: 'sort.label' })}
              value={sortByValue}
              options={sortBy(intl)}
              onSelect={(ordering) => setSortByValue(ordering as sortByType)}
            />
          </Flex>
          <Flex sx={styles.cardContainer}>
            {paginatedResult.length === 0 && (
              <Flex sx={styles.noResults}>
                {intl.formatMessage({ id: 'search_result.empty' })}
              </Flex>
            )}
            {paginatedResult.map((question, id) => {
              return <FaqCard key={id} {...question} />
            })}
          </Flex>
          <Pagination
            forcePage={page.curr}
            pageCount={page.total}
            onPageChange={handleClick}
          />
        </Flex>
      </Fragment>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  preview,
  previewData,
}) => {
  const sidebarfallback = await getNavigation()
  const sectionSelected = 'FAQ'
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const logger = getLogger('FAQ')
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)

  const slugs = Object.keys(docsPathsGLOBAL)

  const fetchFromGithub = async (path: string, slug: string) => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`
      )
      const data = await response.text()
      return { content: data, slug }
    } catch (error) {
      logger.error(`Error fetching data for path ${path}` + ' ' + error)
      return { content: '', slug }
    }
  }

  const batchSize = 100

  const fetchBatch = async (batch: string[]) => {
    const promises = batch.map(async (slug) => {
      const path = docsPathsGLOBAL[slug]?.find(
        (e) => e.locale === currentLocale
      )?.path

      if (path) return fetchFromGithub(path, slug)

      return { content: '', slug }
    })

    return Promise.all(promises)
  }

  const faqData: FaqCardDataElement[] = []

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize)
    const batchResults = await fetchBatch(batch)

    for (const data of batchResults) {
      if (data?.content) {
        try {
          const onlyFrontmatter = `---\n${data.content.split('---')[1]}---\n`

          const { frontmatter } = await serialize(onlyFrontmatter, {
            parseFrontmatter: true,
          })

          if (frontmatter)
            faqData.push({
              title: frontmatter.title,
              slug: data.slug,
              createdAt: String(frontmatter.createdAt),
              updatedAt: String(frontmatter.updatedAt),
              productTeam: frontmatter.productTeam,
            })
        } catch (error) {
          logger.error(`${error}`)
        }
      }
    }
  }

  return {
    props: {
      sidebarfallback,
      sectionSelected,
      faqData,
      branch,
    },
  }
}

export default FaqPage
