import { GetServerSideProps } from 'next'

/**
 * Dynamic robots.txt Generator
 *
 * This page generates a robots.txt file dynamically based on environment variables.
 * When NEXT_PUBLIC_ALLOW_INDEXING is false (staging/dev), it disallows all crawlers.
 * When true (production), it allows crawling and includes sitemap reference.
 */
export default function Robots() {
  // This component will never be rendered as we handle everything in getServerSideProps
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Check if indexing is allowed via environment variable
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

  // Get the site URL from environment or use default
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://help.vtex.com'

  // Generate robots.txt content based on indexing permission
  const robotsTxt = allowIndexing
    ? `# Robots.txt - Production (Indexing Allowed)
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /editor/

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml`
    : `# Robots.txt - Development/Staging (Indexing Disabled)
User-agent: *
Disallow: /

# Block all crawlers in non-production environments`

  // Set appropriate headers
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')

  // Send the robots.txt content
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}
