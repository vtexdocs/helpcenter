import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}))

vi.mock('../logging/log-util', () => ({
  getLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

const mockNavbar = [
  {
    documentation: 'Tutorials',
    slugPrefix: 'docs/tutorials',
    categories: [],
  },
]
const mockResponse = { navbar: mockNavbar }

const createMockResponse = (
  ok: boolean,
  data: unknown,
  status = ok ? 200 : 500
) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Internal Server Error',
  json: () => Promise.resolve(data),
  headers: new Headers(),
})

const createRateLimitResponse = () => ({
  ok: false,
  status: 403,
  statusText: 'Forbidden',
  json: () => Promise.resolve({ message: 'rate limit exceeded' }),
  headers: new Headers({
    'x-ratelimit-remaining': '0',
    'x-ratelimit-limit': '60',
    'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600),
    'x-ratelimit-resource': 'core',
  }),
})

const RAW_GITHUB_URL =
  'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

beforeEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
  delete process.env.navigationJsonUrl
  global.fetch = vi.fn()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getNavigation - fallback chain', () => {
  it('returns data from env URL on success', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse(true, mockResponse)
    )

    const { default: getNavigation } = await import('../getNavigation')
    const result = await getNavigation()

    expect(result).toEqual(mockNavbar)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('falls through to CDN when env URL fails', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    // Env URL fails
    fetchMock.mockResolvedValueOnce(createMockResponse(false, null, 500))
    // First CDN (jsDelivr) succeeds
    fetchMock.mockResolvedValueOnce(createMockResponse(true, mockResponse))

    const { default: getNavigation } = await import('../getNavigation')
    const result = await getNavigation()

    expect(result).toEqual(mockNavbar)
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('falls through to CDN when env URL is rate limited (403)', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    // Env URL rate limited
    fetchMock.mockResolvedValueOnce(createRateLimitResponse())
    // CDN succeeds
    fetchMock.mockResolvedValueOnce(createMockResponse(true, mockResponse))

    const { default: getNavigation } = await import('../getNavigation')
    const result = await getNavigation()

    expect(result).toEqual(mockNavbar)
  })

  it('falls through to raw GitHub fallback when env URL and CDNs fail', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    // Env URL fails
    fetchMock.mockResolvedValueOnce(createMockResponse(false, null, 500))
    // CDN jsDelivr fails
    fetchMock.mockResolvedValueOnce(createMockResponse(false, null, 500))
    // CDN Statically fails
    fetchMock.mockResolvedValueOnce(createMockResponse(false, null, 500))
    // Raw GitHub fallback succeeds
    fetchMock.mockResolvedValueOnce(createMockResponse(true, mockResponse))

    const { default: getNavigation } = await import('../getNavigation')
    const result = await getNavigation()

    expect(result).toEqual(mockNavbar)
    // Verify raw GitHub URL was called
    const calls = fetchMock.mock.calls.map((c: unknown[]) => c[0])
    expect(calls).toContain(RAW_GITHUB_URL)
  })

  it('falls through to filesystem when all remote sources fail', async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    // All remote fetches fail (no env URL set, so goes straight to raw GitHub then filesystem)
    fetchMock.mockResolvedValue(createMockResponse(false, null, 500))

    const fs = await import('fs')
    ;(fs.default.readFileSync as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      JSON.stringify(mockResponse)
    )

    const { default: getNavigation } = await import('../getNavigation')
    const result = await getNavigation()

    expect(result).toEqual(mockNavbar)
    expect(fs.default.readFileSync).toHaveBeenCalled()
  })

  it('throws when ALL sources fail including filesystem', async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue(createMockResponse(false, null, 500))

    const fs = await import('fs')
    ;(fs.default.readFileSync as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw new Error('ENOENT: no such file')
      }
    )

    const { default: getNavigation } = await import('../getNavigation')
    await expect(getNavigation()).rejects.toThrow()
  })
})

describe('getNavigation - data extraction', () => {
  it('returns .navbar from response, not full object', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse(true, mockResponse)
    )

    const { default: getNavigation } = await import('../getNavigation')
    const result = await getNavigation()

    // Should return navbar array, not the full { navbar: [...] } object
    expect(result).toEqual(mockNavbar)
    expect(result).not.toHaveProperty('navbar')
  })
})

describe('getNavigation - branch support', () => {
  it('uses custom branch when specified', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse(true, mockResponse)
    )

    const { default: getNavigation } = await import('../getNavigation')
    await getNavigation({ branch: 'preview-branch' })

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain('preview-branch')
  })

  it('defaults to main branch', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse(true, mockResponse)
    )

    const { default: getNavigation } = await import('../getNavigation')
    await getNavigation()

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain('/main/')
  })
})

describe('getNavigation - in-memory cache', () => {
  it('returns cached data on second call within TTL', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue(createMockResponse(true, mockResponse))

    const { default: getNavigation } = await import('../getNavigation')

    const result1 = await getNavigation()
    const result2 = await getNavigation()

    expect(result1).toEqual(mockNavbar)
    expect(result2).toEqual(mockNavbar)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('re-fetches after cache TTL expires', async () => {
    vi.useFakeTimers()

    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue(createMockResponse(true, mockResponse))

    const { default: getNavigation } = await import('../getNavigation')

    await getNavigation()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Advance past TTL (5 minutes + 1ms)
    vi.advanceTimersByTime(5 * 60 * 1000 + 1)

    await getNavigation()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('cache is per-branch', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue(createMockResponse(true, mockResponse))

    const { default: getNavigation } = await import('../getNavigation')

    await getNavigation({ branch: 'branch-a' })
    await getNavigation({ branch: 'branch-b' })

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('clearNavigationCache resets cache', async () => {
    process.env.navigationJsonUrl =
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue(createMockResponse(true, mockResponse))

    const { default: getNavigation, clearNavigationCache } = await import(
      '../getNavigation'
    )

    await getNavigation()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    clearNavigationCache()

    await getNavigation()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
