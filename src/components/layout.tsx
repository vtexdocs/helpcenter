import { Flex, Box } from '@vtex/brand-ui'
import type { ReactElement } from 'react'
import { useContext, useEffect } from 'react'
import { TrackerContext } from 'utils/contexts/trackerContext'
import { useClientNavigation } from 'utils/useClientNavigation'
import { ThemeProvider } from '@vtex/brand-ui'

import styles from 'styles/documentation-page'
import Header from 'components/header'
import Footer from 'components/footer'
import AnnouncementBar from './announcement-bar'

import { DocumentationTitle, UpdatesTitle } from 'utils/typings/unionTypes'
import Script from 'next/script'
import {
  CookieBar,
  LibraryContextProvider,
  Sidebar,
} from '@vtexdocs/components'
import {
  documentationData,
  feedbackSectionData,
  knownIssuesData,
  menuSupportData,
  updatesData,
} from 'utils/constants'
import { useIntl } from 'react-intl'
import EducationSection from './education-section'

interface Props {
  // ❌ REMOVED: sidebarfallback prop (navigation now loaded client-side)
  children: ReactElement
  hideSidebar?: boolean
  isPreview: boolean
  sectionSelected?: DocumentationTitle | UpdatesTitle | ''
  parentsArray?: string[]
}

// const tracker = new OpenReplay({
//   projectKey: "nvlaGLe4ZcfRvJmjqE61",
//   ingestPoint: "https://openreplay.vtex.com/ingest",
// });

export default function Layout({
  children,
  hideSidebar,
  isPreview = false,
  sectionSelected,
  parentsArray,
}: Props) {
  const { initTracker, startTracking } = useContext(TrackerContext)
  const { navigation } = useClientNavigation() // Load navigation client-side
  const intl = useIntl()

  useEffect(() => {
    // Lazy load tracker to avoid blocking main thread
    const timer = setTimeout(() => {
      initTracker()
      startTracking()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <LibraryContextProvider
        sections={[
          documentationData(intl),
          knownIssuesData(intl),
          updatesData(intl),
        ]}
        hamburguerMenuSections={[
          documentationData(intl),
          menuSupportData(intl),
          updatesData(intl),
          feedbackSectionData(intl),
        ]}
        sectionSelected={sectionSelected ?? ''}
        fallback={navigation} // Use client-side loaded navigation (null during loading)
        isPreview={isPreview}
        locale={intl.locale as 'en' | 'pt' | 'es'}
      >
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KZ58QQP5"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
        <div className="container">
          <Script id="GTM-init" strategy="lazyOnload">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','GTM-KZ58QQP5')
					`}
          </Script>
        </div>
        <AnnouncementBar
          type="info"
          label={intl.formatMessage({
            id: 'announcement_bar.label',
          })}
          closable={false}
          action={{
            button: intl.formatMessage({
              id: 'announcement_bar.button',
            }),
            href: 'https://help.vtex.com?utm_source=new-help-center-announcement-bar',
          }}
        />
        <CookieBar
          onAccept={() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const window2 = window as any
            window2.gtag('consent', 'update', {
              ad_storage: 'granted',
              analytics_storage: 'granted',
            })
          }}
        />
        <Header />
        <Flex sx={styles.container}>
          {!hideSidebar && <Sidebar parentsArray={parentsArray} />}
          <Box sx={styles.mainContainer}>{children}</Box>
        </Flex>
        <EducationSection />
        <Footer />
      </LibraryContextProvider>
    </ThemeProvider>
  )
}
