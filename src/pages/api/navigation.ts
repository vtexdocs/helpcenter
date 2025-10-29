import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import {
  isRateLimited,
  parseRateLimitHeaders,
  formatRateLimitInfo,
} from 'utils/githubRateLimitHandler'
import { getCdnUrls } from 'utils/githubCdnFallback'

// Unified navigation API
// - Prefers external URL via env.navigationJsonUrl
// - Falls back to CDN mirrors (jsDelivr, Statically)
// - Final fallback to local public/navigation.json
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const navigationJsonUrl = process.env.navigationJsonUrl

    if (navigationJsonUrl) {
      // Try primary URL
      try {
        const response = await fetch(navigationJsonUrl)

        // Check for rate limiting (403 OR 429)
        if (response.status === 403 || response.status === 429) {
          if (isRateLimited(response)) {
            const rateLimitInfo = parseRateLimitHeaders(response.headers)
            // eslint-disable-next-line no-console
            console.warn(
              `navigation API: Rate limited. ${formatRateLimitInfo(
                rateLimitInfo
              )}`
            )
            // Fall through to CDN fallbacks
          }
        } else if (response.ok) {
          const data = await response.json()
          // Cache for 5 minutes on CDN, allow stale while revalidate for 30 minutes
          res.setHeader(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=1800'
          )
          res.setHeader(
            'Netlify-CDN-Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=1800'
          )
          return res.status(200).json(data)
        }

        throw new Error(
          `Failed to fetch navigation from URL: ${response.status}`
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          'navigation API: external fetch failed, trying CDN fallbacks',
          e
        )

        // Try CDN fallbacks
        const cdnUrls = getCdnUrls(
          'vtexdocs',
          'help-center-content',
          'main',
          'public/navigation.json',
          'jsdelivr'
        )

        for (const url of cdnUrls.slice(1)) {
          // Skip first (already tried)
          try {
            const cdnType = url.includes('jsdelivr') ? 'jsDelivr' : 'Statically'
            // eslint-disable-next-line no-console
            console.info(`navigation API: Trying ${cdnType}`)
            const response = await fetch(url)

            if (response.ok) {
              const data = await response.json()
              // eslint-disable-next-line no-console
              console.info(
                `navigation API: Successfully fetched from ${cdnType}`
              )
              res.setHeader(
                'Cache-Control',
                'public, s-maxage=300, stale-while-revalidate=1800'
              )
              res.setHeader(
                'Netlify-CDN-Cache-Control',
                'public, s-maxage=300, stale-while-revalidate=1800'
              )
              return res.status(200).json(data)
            }
          } catch (cdnErr) {
            // eslint-disable-next-line no-console
            console.warn(`navigation API: ${url} failed`, cdnErr)
            continue
          }
        }
      }
    }

    // Filesystem fallback
    const filePath = path.join(process.cwd(), 'public', 'navigation.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const navigation = JSON.parse(fileContent)
    // eslint-disable-next-line no-console
    console.info('navigation API: Using filesystem fallback')
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=1800'
    )
    res.setHeader(
      'Netlify-CDN-Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=1800'
    )
    return res.status(200).json(navigation)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('navigation API: failed to load navigation', error)
    return res.status(500).json({ error: 'Failed to load navigation' })
  }
}
