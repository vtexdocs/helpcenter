import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// Unified navigation API
// - Prefers external URL via env.navigationJsonUrl
// - Falls back to local public/navigation.json
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const navigationJsonUrl = process.env.navigationJsonUrl

    if (navigationJsonUrl) {
      try {
        const response = await fetch(navigationJsonUrl)
        if (!response.ok) {
          throw new Error(
            `Failed to fetch navigation from URL: ${response.status}`
          )
        }
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
      } catch (e) {
        // Continue to filesystem fallback below
        // eslint-disable-next-line no-console
        console.warn(
          'navigation API: external fetch failed, falling back to filesystem',
          e
        )
      }
    }

    // Filesystem fallback
    const filePath = path.join(process.cwd(), 'public', 'navigation.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const navigation = JSON.parse(fileContent)
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
