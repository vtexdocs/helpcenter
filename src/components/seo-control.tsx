import Head from 'next/head'

interface SEOControlProps {
  allowIndexing?: boolean
}

/**
 * SEO Control Component
 *
 * Conditionally adds robots meta tags to prevent search engine indexing
 * based on environment variables or props. This is particularly useful for
 * staging environments where you don't want content to be indexed.
 *
 * @param allowIndexing - Optional override for indexing permission
 */
export default function SEOControl({ allowIndexing }: SEOControlProps) {
  // Check environment variable, defaulting to true if not set
  const envAllowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

  // Use prop override if provided, otherwise use environment variable
  const shouldIndex =
    allowIndexing !== undefined ? allowIndexing : envAllowIndexing

  // Only render noindex tags if indexing should be disabled
  if (shouldIndex) {
    return null
  }

  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow, nosnippet" />
      {/* Prevent content from being used in AI Overviews and AI Mode */}
    </Head>
  )
}
