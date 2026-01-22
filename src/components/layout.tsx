import { Flex, Box } from '@vtex/brand-ui'
import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TrackerContext } from 'utils/contexts/trackerContext'
import { useClientNavigation } from 'utils/useClientNavigation'
import { ThemeProvider } from '@vtex/brand-ui'
import dynamic from 'next/dynamic'

import styles from 'styles/documentation-page'
import Header from 'components/header'
import Footer from 'components/footer'

import { SectionId } from 'utils/typings/unionTypes'
import Script from 'next/script'
import { CookieBar, LibraryContextProvider } from '@vtexdocs/components'

const Sidebar = dynamic(
  () => import('@vtexdocs/components').then((mod) => mod.Sidebar),
  { ssr: false }
) as React.FC<{ parentsArray?: string[] }>
import {
  menuDocumentationData,
  feedbackSectionData,
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
  sectionSelected?: SectionId | ''
  parentsArray?: string[]
  locale?: 'en' | 'pt' | 'es'
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
  locale,
}: Props) {
  const { initTracker, startTracking } = useContext(TrackerContext)
  const { navigation } = useClientNavigation() // Load navigation client-side
  const intl = useIntl()
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    // Lazy load tracker to avoid blocking main thread
    const timer = setTimeout(() => {
      initTracker()
      startTracking()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [router.asPath])

  const supportedLocales = ['en', 'pt', 'es'] as const
  type SupportedLocale = (typeof supportedLocales)[number]

  const localeCandidates = [locale, router.locale, intl.locale]

  const derivedLocale = (localeCandidates.find(
    (candidate): candidate is SupportedLocale =>
      typeof candidate === 'string' &&
      supportedLocales.includes(candidate as SupportedLocale)
  ) ?? 'en') as SupportedLocale

  return (
    <ThemeProvider>
      <LibraryContextProvider
        sections={[
          menuDocumentationData(intl),
          menuSupportData(intl),
          updatesData(intl),
        ]}
        hamburguerMenuSections={[
          menuDocumentationData(intl),
          menuSupportData(intl),
          updatesData(intl),
          feedbackSectionData(intl, currentUrl),
        ]}
        sectionSelected={sectionSelected ?? ''}
        fallback={navigation} // Use client-side loaded navigation (null during loading)
        isPreview={isPreview}
        locale={derivedLocale}
      >
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-K2NM75K"
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
					})(window,document,'script','dataLayer','GTM-K2NM75K')
					`}
          </Script>
        </div>
        <CookieBar
          onAccept={() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const window2 = window as any
            // Check if gtag is available before calling it
            if (typeof window2.gtag === 'function') {
              window2.gtag('consent', 'update', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
              })
            } else {
              console.warn(
                'gtag function not available yet, consent update skipped'
              )
            }
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
