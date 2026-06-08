/**
 * Reusable client for the VTEX Docs Hybrid Search API.
 *
 * This module is intentionally framework-agnostic (no Next.js / React
 * imports) so it can be lifted into `@vtexdocs/components` and shared
 * between the Help Center and the Dev Portal.
 *
 * Upstream OpenAPI: vtexdocs/vtexdocs-mcp-app/apps/api/openapi.json
 */

export type HybridSearchSource = 'help-center' | 'dev-portal'

export type HybridSearchResult = {
  id: number
  title: string | null
  filePath: string
  chunkIndex: number
  repository: string
  content: string
  snippet: string
  score: number
  metadata: Record<string, unknown> | null
}

export type HybridSearchResponse = {
  results: HybridSearchResult[]
}

export type HybridSearchClientConfig = {
  endpoint: string
  apiKey: string
  source: HybridSearchSource
  /** Default request timeout in ms. Defaults to 15_000. */
  timeoutMs?: number
  /** Optional fetch implementation; defaults to global `fetch`. */
  fetchImpl?: typeof fetch
}

export type HybridSearchParams = {
  q: string
  limit?: number
  locale?: string
}

export const HS_DEFAULT_LIMIT = 10
export const HS_MAX_LIMIT = 100
export const HS_DEFAULT_TIMEOUT_MS = 15_000

export class HybridSearchError extends Error {
  /** HTTP status from the upstream response, when available. */
  readonly upstreamStatus?: number
  readonly cause?: unknown

  constructor(
    message: string,
    options: { upstreamStatus?: number; cause?: unknown } = {}
  ) {
    super(message)
    this.name = 'HybridSearchError'
    this.upstreamStatus = options.upstreamStatus
    this.cause = options.cause
  }
}

export function clampLimit(raw: unknown): number {
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return HS_DEFAULT_LIMIT
  return Math.min(Math.max(1, Math.floor(parsed)), HS_MAX_LIMIT)
}

export function createHybridSearchClient(config: HybridSearchClientConfig) {
  const {
    endpoint,
    apiKey,
    source,
    timeoutMs = HS_DEFAULT_TIMEOUT_MS,
    fetchImpl,
  } = config

  if (!endpoint) throw new Error('HybridSearchClient: endpoint is required')
  if (!apiKey) throw new Error('HybridSearchClient: apiKey is required')

  return {
    async search(params: HybridSearchParams): Promise<HybridSearchResponse> {
      const q = params.q?.trim() ?? ''
      if (!q) {
        throw new HybridSearchError('Missing required query parameter: q')
      }

      const url = new URL('/api/hybrid-search', endpoint)
      url.searchParams.set('q', q)
      url.searchParams.set('limit', String(clampLimit(params.limit)))
      url.searchParams.set('source', source)
      if (params.locale) url.searchParams.set('locale', params.locale)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const doFetch = fetchImpl ?? fetch
        const response = await doFetch(url.toString(), {
          method: 'GET',
          headers: {
            'X-Internal-Access-Key': apiKey,
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new HybridSearchError(
            `Hybrid search request failed (${response.status})`,
            { upstreamStatus: response.status }
          )
        }

        return (await response.json()) as HybridSearchResponse
      } catch (err) {
        if (err instanceof HybridSearchError) throw err
        const isAbort =
          err instanceof Error &&
          (err.name === 'AbortError' || err.message.includes('aborted'))
        throw new HybridSearchError(
          isAbort ? 'Hybrid search request timed out' : 'Hybrid search failed',
          { cause: err }
        )
      } finally {
        clearTimeout(timeoutId)
      }
    },
  }
}

export type HybridSearchClient = ReturnType<typeof createHybridSearchClient>
