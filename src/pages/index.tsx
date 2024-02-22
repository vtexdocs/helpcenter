import { Grid } from '@vtex/brand-ui'
import type { Page } from 'utils/typings/types'

import NewsletterSection from 'components/newsletter-section'
import DocumentationSection from 'components/documentation-section'
import AnnouncementSection from 'components/announcement-section'

import Head from 'next/head'
import styles from 'styles/landing-page'
import getNavigation from 'utils/getNavigation'
import { GetStaticProps } from 'next'
import { useContext } from 'react'
import { PreviewContext } from 'utils/contexts/preview'
import SupportSection from 'components/support-section'
import FaqSection from 'components/faq-section'
import { localeType } from 'utils/navigation-utils'
import getAnnouncementsJson from 'utils/getAnnouncementsJson'

interface Props {
  branch: string
  announcementTimelineData: { title: string; date: string }[]
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
      </Head>
      <Grid sx={styles.grid}>
        <NewsletterSection />
        <DocumentationSection />
        <FaqSection />
        <SupportSection />
        <AnnouncementSection announcements={announcementTimelineData} />
      </Grid>
    </>
  )
}

Home.hideSidebar = true

export const getStaticProps: GetStaticProps = async ({
  locale,
  preview,
  previewData,
}) => {
  const sidebarfallback = await getNavigation()
  const previewBranch =
    preview && JSON.parse(JSON.stringify(previewData)).hasOwnProperty('branch')
      ? JSON.parse(JSON.stringify(previewData)).branch
      : 'main'
  const branch = preview ? previewBranch : 'main'
  const currentLocale: localeType = locale
    ? (locale as localeType)
    : ('en' as localeType)

  const announcementTimelineData: {
    title: string
    date: string
  }[] = []

  const announcementJson = await getAnnouncementsJson()

  for (let i = 0; i < announcementJson.length; i++) {
    const announcement = announcementJson[i]
    announcementTimelineData.push({
      title: announcement.title[currentLocale],
      date: String(announcement.date),
    })

    announcementTimelineData.push()
  }

  return {
    props: {
      sidebarfallback,
      branch,
      announcementTimelineData,
    },
  }
}

export default Home
