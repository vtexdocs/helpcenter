import { Grid } from '@vtex/brand-ui'
import type { Page } from 'utils/typings/types'

import NewsletterSection from 'components/newsletter-section'
import DocumentationSection from 'components/documentation-section'
import AnnouncementSection from 'components/announcement-section'
import SupportSection from 'components/support-section'
import FaqSection from 'components/faq-section'

import { getDocsPaths as getAnnouncementsPaths } from 'utils/getDocsPaths'
import Head from 'next/head'
import styles from 'styles/landing-page'
import { GetStaticProps } from 'next'
import { useContext } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import { localeType } from 'utils/navigation-utils'
import { AnnouncementDataElement } from 'utils/typings/types'
import { getLogger } from 'utils/logging/log-util'
import { getISRRevalidateTime } from 'utils/config'
import { serialize } from 'next-mdx-remote/serialize'

interface Props {
  branch: string
  announcementTimelineData: AnnouncementDataElement[]
}

const Home: Page<Props> = ({ branch, announcementTimelineData }) => {
  const { setBranchPreview } = useContext(PreviewContext)
  setBranchPreview(branch)

  return (
    <>
      <Head>
        <title>VTEX Help Center</title>
        <meta property="og:title" content="VTEX Help Center" key="title" />
        <meta
          property="og:description"
          content="Build and extend your world of commerce with VTEX development platform and Core Commerce APIs."
          key="desc"
        />
        <meta
          property="og:image"
          content="https://cdn.jsdelivr.net/gh/vtexdocs/devportal@main/public/images/meta-image.png"
        />
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/images/landing.png" />
        {/* Preconnect to third-party domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://openreplay.vtex.com" />
      </Head>
      <Grid sx={styles.grid}>
        <NewsletterSection />
        <DocumentationSection />
        <FaqSection />
        <SupportSection />
        <AnnouncementSection
          annoucementsAmout={5}
          announcements={announcementTimelineData}
        />
      </Grid>
    </>
  )
}

Home.hideSidebar = true

// Initialize in getStaticProps
let docsPathsGLOBAL: Record<string, { locale: string; path: string }[]> | null =
  null

export const getStaticProps: GetStaticProps = async ({
  locale,
  preview,
  previewData,
}) => {
  const previewBranch =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    'branch' in previewData
      ? (previewData as { branch: string }).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const logger = getLogger('Announcements')
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)

  if (!docsPathsGLOBAL) {
    docsPathsGLOBAL = await getAnnouncementsPaths('announcements')
  }
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

  const batchSize = 5

  const fetchBatch = async (batch: string[]) => {
    const promises = batch.map(async (slug) => {
      const path =
        docsPathsGLOBAL &&
        docsPathsGLOBAL[slug]?.find((e) => e.locale === currentLocale)?.path

      if (path) return fetchFromGithub(path, slug)

      return { content: '', slug }
    })

    return Promise.all(promises)
  }

  const announcementsData: AnnouncementDataElement[] = []

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

          if (frontmatter) {
            announcementsData.push({
              title: String(frontmatter.title),
              url: `announcements/${data.slug}`,
              createdAt: String(frontmatter.createdAt),
              updatedAt: String(frontmatter.updatedAt),
              status: String(frontmatter.status),
            })
          }
        } catch (error) {
          logger.error(`${error}`)
        }
      }
    }
  }

  return {
    props: {
      branch: branch,
      announcementTimelineData: announcementsData,
    },
    revalidate: getISRRevalidateTime(),
  }
}

export default Home
