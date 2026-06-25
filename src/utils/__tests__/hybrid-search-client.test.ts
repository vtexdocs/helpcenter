import { describe, it, expect, vi } from 'vitest'
import {
  clampLimit,
  createHybridSearchClient,
  HS_DEFAULT_LIMIT,
  HS_MAX_LIMIT,
  HybridSearchError,
} from '../hybrid-search-client'

describe('clampLimit', () => {
  it('returns the default when value is missing or invalid', () => {
    expect(clampLimit(undefined)).toBe(HS_DEFAULT_LIMIT)
    expect(clampLimit(null)).toBe(HS_DEFAULT_LIMIT)
    expect(clampLimit('abc')).toBe(HS_DEFAULT_LIMIT)
    expect(clampLimit(0)).toBe(HS_DEFAULT_LIMIT)
    expect(clampLimit(-5)).toBe(HS_DEFAULT_LIMIT)
  })

  it('clamps to MAX_LIMIT', () => {
    expect(clampLimit(500)).toBe(HS_MAX_LIMIT)
    expect(clampLimit(HS_MAX_LIMIT + 1)).toBe(HS_MAX_LIMIT)
  })

  it('floors and respects valid integers', () => {
    expect(clampLimit(5)).toBe(5)
    expect(clampLimit('7')).toBe(7)
    expect(clampLimit(7.9)).toBe(7)
  })
})

describe('createHybridSearchClient', () => {
  const baseConfig = {
    endpoint: 'https://hs.test.example.com',
    apiKey: 'test-key',
    source: 'help-center' as const,
  }

  it('throws if endpoint or apiKey are missing', () => {
    expect(() =>
      createHybridSearchClient({ ...baseConfig, endpoint: '' })
    ).toThrow(/endpoint/)
    expect(() =>
      createHybridSearchClient({ ...baseConfig, apiKey: '' })
    ).toThrow(/apiKey/)
  })

  it('rejects with HybridSearchError when q is empty', async () => {
    const fetchImpl = vi.fn()
    const client = createHybridSearchClient({ ...baseConfig, fetchImpl })

    await expect(client.search({ q: '' })).rejects.toBeInstanceOf(
      HybridSearchError
    )
    await expect(client.search({ q: '   ' })).rejects.toBeInstanceOf(
      HybridSearchError
    )
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('builds the upstream URL with q, clamped limit, source, and locale', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    })
    const client = createHybridSearchClient({ ...baseConfig, fetchImpl })

    await client.search({ q: 'foo', limit: 999, locale: 'pt' })

    const url = String(fetchImpl.mock.calls[0][0])
    expect(url).toContain('https://hs.test.example.com/api/hybrid-search')
    expect(url).toContain('q=foo')
    expect(url).toContain(`limit=${HS_MAX_LIMIT}`)
    expect(url).toContain('source=help-center')
    expect(url).toContain('locale=pt')

    const init = fetchImpl.mock.calls[0][1] as RequestInit
    expect(init.headers).toMatchObject({
      'X-Internal-Access-Key': 'test-key',
      Accept: 'application/json',
    })
  })

  it('omits locale when not provided', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    })
    const client = createHybridSearchClient({ ...baseConfig, fetchImpl })

    await client.search({ q: 'foo' })

    expect(String(fetchImpl.mock.calls[0][0])).not.toContain('locale=')
  })

  it('throws HybridSearchError with upstreamStatus on non-OK responses', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    })
    const client = createHybridSearchClient({ ...baseConfig, fetchImpl })

    await expect(client.search({ q: 'foo' })).rejects.toMatchObject({
      name: 'HybridSearchError',
      upstreamStatus: 401,
    })
  })

  it('translates aborts into a "timed out" HybridSearchError', async () => {
    const abortError = new Error('The operation was aborted')
    abortError.name = 'AbortError'
    const fetchImpl = vi.fn().mockRejectedValue(abortError)
    const client = createHybridSearchClient({ ...baseConfig, fetchImpl })

    await expect(client.search({ q: 'foo' })).rejects.toMatchObject({
      name: 'HybridSearchError',
      message: expect.stringContaining('timed out'),
    })
  })

  it('wraps unexpected errors in HybridSearchError', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('boom'))
    const client = createHybridSearchClient({ ...baseConfig, fetchImpl })

    await expect(client.search({ q: 'foo' })).rejects.toMatchObject({
      name: 'HybridSearchError',
      message: 'Hybrid search failed',
    })
  })
})
