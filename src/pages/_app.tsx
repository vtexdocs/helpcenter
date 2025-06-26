import type { AppProps } from 'next/app'
import type { Page } from 'utils/typings/types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { IntlProvider } from 'react-intl'
import { getMessages } from 'utils/get-messages'

import '@code-hike/mdx/dist/index.css'
import 'styles/global.css'
import '@vtexdocs/components/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.css'

import Layout from 'components/layout'

type Props = AppProps & {
  Component: Page
}
import { ErrorBoundary, SuspenseFallback } from 'components/error-boundary'
import { Suspense } from 'react'

import TrackerProvider from 'utils/contexts/trackerContext'
import PreviewContextProvider from 'utils/contexts/preview'

function MyApp({ Component, pageProps }: Props) {
  const { locale } = useRouter()
  const currentLocale = locale ?? 'en'
  const messages = getMessages()

  return (
    <TrackerProvider>
      <IntlProvider locale={currentLocale} messages={messages[currentLocale]}>
        <Head>
          <meta
            property="og:image"
            content="https://cdn.jsdelivr.net/gh/vtexdocs/devportal@main/public/images/meta-image.png"
          />
          <meta
            name="docsearch:language"
            content={pageProps.locale || currentLocale}
          />
        </Head>
        <PreviewContextProvider>
          <Layout
            // ❌ REMOVED: sidebarfallback (now loaded client-side)
            hideSidebar={Component.hideSidebar}
            isPreview={pageProps.isPreview ?? false}
            sectionSelected={pageProps.sectionSelected}
            parentsArray={pageProps.parentsArray}
          >
            <ErrorBoundary>
              <Suspense
                fallback={<SuspenseFallback branch={pageProps.branch} />}
              >
                <Component {...pageProps} />
              </Suspense>
            </ErrorBoundary>
          </Layout>
        </PreviewContextProvider>
      </IntlProvider>
    </TrackerProvider>
  )
}

export default MyApp
