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
import { LocaleType } from 'utils/typings/unionTypes'
import { AnnouncementDataElement } from 'utils/typings/types'
import { getLogger } from 'utils/logging/log-util'
import { getISRRevalidateTime } from 'utils/config'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'

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
          content="Everything you need to build, sell, and grow with VTEX."
          key="desc"
        />
        <meta
          property="og:image"
          content="https://cdn.jsdelivr.net/gh/vtexdocs/helpcenter@main/public/images/meta-image.png"
        />
        {/* Preload critical LCP image */}
        <link rel="preload" as="image" href="/images/landing.png" />
        {/* Preconnect to third-party domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
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
  const logger = getLogger('Home News')
  const currentLocale: LocaleType = locale
    ? (locale as LocaleType)
    : ('en' as LocaleType)

  if (!docsPathsGLOBAL) {
    docsPathsGLOBAL = await getAnnouncementsPaths('announcements')
  }
  const slugs = Object.keys(docsPathsGLOBAL).sort().reverse().slice(0, 15)

  const announcementsData: AnnouncementDataElement[] = []

  for (const slug of slugs) {
    const [result] = await fetchBatch(
      [slug],
      'help-center-content',
      docsPathsGLOBAL,
      currentLocale,
      branch,
      logger
    )

    if (!result?.content) continue

    const frontmatter = await parseFrontmatter(result.content, logger)

    if (frontmatter) {
      const tags = String(frontmatter.tags ?? '')
        .split(',')
        .map((tag) => {
          const trimmed = tag.trim()
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
        })
        .filter(Boolean)

      announcementsData.push({
        title: String(frontmatter.title),
        url: `announcements/${slug}`,
        createdAt: String(frontmatter.createdAt),
        updatedAt: String(frontmatter.updatedAt),
        status: String(frontmatter.status),
        tags,
      })
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
