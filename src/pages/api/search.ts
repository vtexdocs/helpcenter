import type { NextApiRequest, NextApiResponse } from 'next'
import {
  clampLimit,
  createHybridSearchClient,
  HybridSearchError,
} from 'utils/hybrid-search-client'

// GET /api/search?q=<query>&limit=<1-100>&locale=<en|es|pt>
//
// Proxies the request to the VTEX Docs Hybrid Search API
// (BM25 + vector similarity, fused via Reciprocal Rank Fusion).
//
// Required env vars (server-side only):
//   - HS_API_ENDPOINT: Base URL of the Hybrid Search API
//                     (e.g., https://vtexdocs-edge.vtex.com)
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
  const limit = clampLimit(req.query.limit)

  if (!q) {
    return res
      .status(400)
      .json({ error: 'Missing required query parameter: q' })
  }

  const endpoint = process.env.HS_API_ENDPOINT
  const apiKey = process.env.HS_API_KEY

  if (!endpoint || !apiKey) {
    // eslint-disable-next-line no-console
    console.error('search API: HS_API_ENDPOINT or HS_API_KEY is not configured')
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

    const data = await client.search({ q, limit, locale: locale || undefined })

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    res.setHeader(
      'Netlify-CDN-Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    // Note: locale is passed via query param (?locale=en), not Accept-Language header,
    // so Vary: Accept-Language is not needed and could cause incorrect cache hits

    return res.status(200).json({
      query: q,
      locale: locale || null,
      limit,
      count: data.results?.length ?? 0,
      results: data.results ?? [],
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('search API error', err)

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
