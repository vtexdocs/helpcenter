import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createHybridSearchClient,
  HybridSearchError,
} from 'utils/hybrid-search-client'

// GET /api/search/counts?q=<query>&locale=<en|es|pt>
//
// Proxies the request to the VTEX Docs Hybrid Search counts API.
//
// Required env vars (server-side only):
//   - HS_API_ENDPOINT: Base URL of the Hybrid Search API
//   - HS_API_KEY:      Internal access key sent as `X-Internal-Access-Key`.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const q = String(req.query.q || '').trim()
  const locale = String(req.query.locale || '').trim()

  if (!q) {
    return res
      .status(400)
      .json({ error: 'Missing required query parameter: q' })
  }

  const endpoint = process.env.HS_API_ENDPOINT
  const apiKey = process.env.HS_API_KEY

  if (!endpoint || !apiKey) {
    // eslint-disable-next-line no-console
    console.error(
      'search counts API: HS_API_ENDPOINT or HS_API_KEY is not configured'
    )
    return res
      .status(503)
      .json({ error: 'Hybrid search is not configured on this environment' })
  }

  try {
    const client = createHybridSearchClient({
      endpoint,
      apiKey,
      source: 'help-center',
    })

    const data = await client.counts({
      q,
      locale: locale || undefined,
    })

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    res.setHeader(
      'Netlify-CDN-Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )

    return res.status(200).json({
      query: q,
      locale: locale || null,
      counts: data.counts,
      total: data.total,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('search counts API error', err)

    if (err instanceof HybridSearchError) {
      if (err.upstreamStatus !== undefined) {
        const status = err.upstreamStatus >= 500 ? 502 : err.upstreamStatus
        return res.status(status).json({
          error: 'Hybrid search request failed',
          upstreamStatus: err.upstreamStatus,
        })
      }
      if (err.message.includes('timed out')) {
        return res
          .status(504)
          .json({ error: 'Hybrid search request timed out' })
      }
    }

    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
