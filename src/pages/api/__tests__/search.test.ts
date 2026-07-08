import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../search'

type MockResponse = {
  statusCode: number
  body: unknown
  headers: Record<string, string>
  status: (code: number) => MockResponse
  json: (payload: unknown) => MockResponse
  setHeader: (name: string, value: string) => void
}

function createMockRes(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    body: undefined,
    headers: {},
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(payload: unknown) {
      this.body = payload
      return this
    },
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value
    },
  }
  return res
}

function createReq(query: Record<string, string | string[]>, method = 'GET') {
  return { method, query } as unknown as NextApiRequest
}

function mockSuccessfulFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ results: [] }),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const ORIGINAL_ENV = { ...process.env }

describe('/api/search', () => {
  beforeEach(() => {
    process.env.HS_API_ENDPOINT = 'https://hs.test.example.com'
    process.env.HS_API_KEY = 'test-key'
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env = { ...ORIGINAL_ENV }
  })

  it('returns 405 for non-GET methods', async () => {
    const res = createMockRes()
    await handler(createReq({}, 'POST'), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(405)
    expect(res.headers['allow']).toBe('GET')
    expect(res.body).toEqual({ error: 'Method Not Allowed' })
  })

  it('returns 400 when q is missing', async () => {
    const res = createMockRes()
    await handler(createReq({}), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({
      error: expect.stringContaining('Missing required query parameter'),
    })
  })

  it('returns 400 when q is empty after trimming', async () => {
    const res = createMockRes()
    await handler(createReq({ q: '   ' }), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(400)
  })

  it('returns 503 when HS_API_ENDPOINT or HS_API_KEY is missing', async () => {
    delete process.env.HS_API_ENDPOINT
    const res = createMockRes()
    await handler(createReq({ q: 'test' }), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(503)
    expect(res.body).toMatchObject({ error: expect.any(String) })
  })

  it('forwards q, limit, locale, and source to upstream and returns results', async () => {
    const upstreamPayload = {
      results: [
        {
          id: 1,
          title: 'Hello',
          filePath: 'docs/en/tutorials/hello.md',
          chunkIndex: 0,
          repository: 'vtexdocs/help-center-content',
          content: 'full content',
          snippet: 'matched snippet',
          score: 0.91,
          metadata: { locale: 'en' },
        },
      ],
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => upstreamPayload,
    })
    vi.stubGlobal('fetch', fetchMock)

    const res = createMockRes()
    await handler(
      createReq({ q: 'hello world', limit: '5', locale: 'en' }),
      res as unknown as NextApiResponse
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const calledUrl = String(fetchMock.mock.calls[0][0])
    expect(calledUrl).toContain('https://hs.test.example.com/api/hybrid-search')
    expect(calledUrl).toContain('q=hello+world')
    expect(calledUrl).toContain('limit=5')
    expect(calledUrl).toContain('locale=en')
    expect(calledUrl).toContain('source=help-center')

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.headers).toMatchObject({
      'X-Internal-Access-Key': 'test-key',
      Accept: 'application/json',
    })

    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      query: 'hello world',
      locale: 'en',
      limit: 5,
      count: 1,
      results: upstreamPayload.results,
    })
    expect(res.headers['cache-control']).toContain('s-maxage=60')
  })

  it('applies default limit when not provided and clamps to MAX_LIMIT', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    // Default limit
    const resA = createMockRes()
    await handler(createReq({ q: 'foo' }), resA as unknown as NextApiResponse)
    expect(String(fetchMock.mock.calls[0][0])).toContain('limit=10')

    // Above max -> clamps to 100
    const resB = createMockRes()
    await handler(
      createReq({ q: 'foo', limit: '500' }),
      resB as unknown as NextApiResponse
    )
    expect(String(fetchMock.mock.calls[1][0])).toContain('limit=100')

    // Negative -> default
    const resC = createMockRes()
    await handler(
      createReq({ q: 'foo', limit: '-3' }),
      resC as unknown as NextApiResponse
    )
    expect(String(fetchMock.mock.calls[2][0])).toContain('limit=10')
  })

  it('omits locale param when not provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const res = createMockRes()
    await handler(createReq({ q: 'foo' }), res as unknown as NextApiResponse)

    expect(String(fetchMock.mock.calls[0][0])).not.toContain('locale=')
    expect(res.body).toMatchObject({ locale: null })
  })

  it('maps upstream 5xx to 502', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'internal explosion',
    })
    vi.stubGlobal('fetch', fetchMock)

    const res = createMockRes()
    await handler(createReq({ q: 'foo' }), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(502)
    expect(res.body).toMatchObject({
      error: 'Hybrid search request failed',
      upstreamStatus: 500,
    })
  })

  it('passes through upstream 4xx status', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'unauthorized',
    })
    vi.stubGlobal('fetch', fetchMock)

    const res = createMockRes()
    await handler(createReq({ q: 'foo' }), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(401)
    expect(res.body).toMatchObject({ upstreamStatus: 401 })
  })

  it('returns 504 when fetch is aborted (timeout)', async () => {
    const abortError = new Error('The operation was aborted')
    abortError.name = 'AbortError'
    const fetchMock = vi.fn().mockRejectedValue(abortError)
    vi.stubGlobal('fetch', fetchMock)

    const res = createMockRes()
    await handler(createReq({ q: 'foo' }), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(504)
    expect(res.body).toMatchObject({
      error: expect.stringContaining('timed out'),
    })
  })

  it('returns 500 on unexpected errors', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('boom'))
    vi.stubGlobal('fetch', fetchMock)

    const res = createMockRes()
    await handler(createReq({ q: 'foo' }), res as unknown as NextApiResponse)

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: 'Internal Server Error' })
  })

  it('properly URL-encodes special characters in q', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const res = createMockRes()
    await handler(
      createReq({ q: 'a/b?c&d=e' }),
      res as unknown as NextApiResponse
    )

    const url = String(fetchMock.mock.calls[0][0])
    expect(url).toContain('q=a%2Fb%3Fc%26d%3De')
    expect(res.statusCode).toBe(200)
  })

  describe('doctype query param', () => {
    it('forwards a valid doctype to upstream and echoes it in the response', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello', doctype: 'tutorials' }),
        res as unknown as NextApiResponse
      )

      const url = new URL(String(fetchMock.mock.calls[0][0]))
      expect(url.searchParams.get('doctype')).toBe('tutorials')
      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        query: 'hello',
        doctype: 'tutorials',
      })
    })

    it.each([
      'tracks',
      'faq',
      'known-issues',
      'troubleshooting',
      'announcements',
    ])('forwards allowlisted doctype "%s"', async (doctype) => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello', doctype }),
        res as unknown as NextApiResponse
      )

      const url = new URL(String(fetchMock.mock.calls[0][0]))
      expect(url.searchParams.get('doctype')).toBe(doctype)
      expect(res.body).toMatchObject({ doctype })
    })

    it('omits unknown doctype from the upstream request', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello', doctype: 'blog-posts' }),
        res as unknown as NextApiResponse
      )

      const url = String(fetchMock.mock.calls[0][0])
      expect(url).not.toContain('doctype=')
      expect(res.body).toMatchObject({ query: 'hello' })
      expect(res.body).not.toHaveProperty('doctype')
    })

    it('omits empty doctype from the upstream request', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello', doctype: '' }),
        res as unknown as NextApiResponse
      )

      expect(String(fetchMock.mock.calls[0][0])).not.toContain('doctype=')
      expect(res.body).not.toHaveProperty('doctype')
    })

    it('omits doctype with wrong casing from the upstream request', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello', doctype: 'Tutorials' }),
        res as unknown as NextApiResponse
      )

      expect(String(fetchMock.mock.calls[0][0])).not.toContain('doctype=')
      expect(res.body).not.toHaveProperty('doctype')
    })

    it('uses the first value when doctype is an array', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello', doctype: ['tutorials', 'faq'] }),
        res as unknown as NextApiResponse
      )

      const url = new URL(String(fetchMock.mock.calls[0][0]))
      expect(url.searchParams.get('doctype')).toBe('tutorials')
      expect(res.body).toMatchObject({ doctype: 'tutorials' })
    })

    it('omits doctype when the first array value is invalid', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello', doctype: ['blog-posts', 'tutorials'] }),
        res as unknown as NextApiResponse
      )

      expect(String(fetchMock.mock.calls[0][0])).not.toContain('doctype=')
      expect(res.body).not.toHaveProperty('doctype')
    })

    it('preserves unfiltered behavior when doctype is absent', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({ q: 'hello' }),
        res as unknown as NextApiResponse
      )

      expect(String(fetchMock.mock.calls[0][0])).not.toContain('doctype=')
      expect(res.body).toMatchObject({
        query: 'hello',
        locale: null,
        limit: 10,
        count: 0,
        results: [],
      })
      expect(res.body).not.toHaveProperty('doctype')
    })

    it('still respects limit and locale when doctype is present', async () => {
      const fetchMock = mockSuccessfulFetch()

      const res = createMockRes()
      await handler(
        createReq({
          q: 'hello',
          doctype: 'faq',
          limit: '7',
          locale: 'pt',
        }),
        res as unknown as NextApiResponse
      )

      const url = String(fetchMock.mock.calls[0][0])
      expect(url).toContain('limit=7')
      expect(url).toContain('locale=pt')
      expect(url).toContain('doctype=faq')
      expect(res.body).toMatchObject({
        query: 'hello',
        locale: 'pt',
        limit: 7,
        doctype: 'faq',
      })
    })

    it('keeps existing upstream error handling when doctype is present', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'internal explosion',
      })
      vi.stubGlobal('fetch', fetchMock)

      const res = createMockRes()
      await handler(
        createReq({ q: 'foo', doctype: 'tutorials' }),
        res as unknown as NextApiResponse
      )

      expect(String(fetchMock.mock.calls[0][0])).toContain('doctype=tutorials')
      expect(res.statusCode).toBe(502)
      expect(res.body).toMatchObject({
        error: 'Hybrid search request failed',
        upstreamStatus: 500,
      })
    })
  })
})
