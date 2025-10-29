import fs from 'fs'
import path from 'path'
import {
  isRateLimited,
  parseRateLimitHeaders,
  formatRateLimitInfo,
} from './githubRateLimitHandler'
import { getCdnUrls } from './githubCdnFallback'
// import { enumerateNavigation } from './enumerate-navigation'

export default async function getNavigation() {
  // Prefer environment URL to allow fetching from external repo
  const envUrl = process.env.navigationJsonUrl
  if (envUrl) {
    try {
      const result = await fetch(envUrl)

      // Check for rate limiting (403 OR 429)
      if (result.status === 403 || result.status === 429) {
        if (isRateLimited(result)) {
          const rateLimitInfo = parseRateLimitHeaders(result.headers)
          console.warn(
            `getNavigation: Rate limited on primary URL. ${formatRateLimitInfo(
              rateLimitInfo
            )}`
          )
          // Fall through to CDN fallbacks below
        }
      } else if (result.ok) {
        const data = await result.json()
        return data.navbar
      }

      // If we got here, either rate limited or other error - try CDN fallbacks
      throw new Error(
        `Failed to fetch navigation from env URL: ${result.status}`
      )
    } catch (e) {
      console.warn(
        'getNavigation: failed to fetch from env URL, trying CDN fallbacks',
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
          console.info(`getNavigation: Trying ${cdnType}`)
          const result = await fetch(url)

          if (result.ok) {
            const data = await result.json()
            console.info(`getNavigation: Successfully fetched from ${cdnType}`)
            return data.navbar
          }
        } catch (cdnErr) {
          console.warn(`getNavigation: CDN attempt failed`, cdnErr)
          continue
        }
      }
    }
  }

  // Filesystem fallback (server-side only)
  try {
    const filePath = path.join(process.cwd(), 'public', 'navigation.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const navigation = JSON.parse(fileContent)
    console.info('getNavigation: Using filesystem fallback')
    return navigation.navbar
  } catch (error) {
    console.error('getNavigation: All methods failed', error)
    throw error
  }
}
