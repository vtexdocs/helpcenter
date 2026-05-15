import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

const mockWriteFileSync = vi.fn()
vi.mock('fs', () => ({
  default: { writeFileSync: mockWriteFileSync },
  writeFileSync: mockWriteFileSync,
}))

const mockNavbar = [
  {
    documentation: 'Tutorials',
    slugPrefix: 'docs/tutorials',
    categories: [],
  },
]
const validResponse = { navbar: mockNavbar }

const createMockFetchResponse = (
  ok: boolean,
  data: unknown,
  status = ok ? 200 : 500
) =>
  Promise.resolve({
    ok,
    status,
    statusText: ok ? 'OK' : 'Internal Server Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response)

const DEFAULT_URL =
  'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json'
const STATICALLY_URL =
  'https://cdn.statically.io/gh/vtexdocs/help-center-content/main/public/navigation.json'

describe('fetchNavigationData', () => {
  let fetchNavigationData: typeof import('../validate-navigation-core').fetchNavigationData

  beforeEach(async () => {
    vi.resetModules()
    global.fetch = vi.fn()
    delete process.env.NAVIGATION_JSON_URL
    delete process.env.navigationJsonUrl
    const mod = await import('../validate-navigation-core')
    fetchNavigationData = mod.fetchNavigationData
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches from primary URL on success', async () => {
    vi.mocked(global.fetch).mockReturnValueOnce(
      createMockFetchResponse(true, validResponse)
    )

    const result = await fetchNavigationData()

    expect(result).toEqual(validResponse)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(DEFAULT_URL)
  })

  it('falls back to raw GitHub URL when primary fails', async () => {
    process.env.NAVIGATION_JSON_URL = 'https://custom.example.com/nav.json'
    // Re-import to pick up env change
    vi.resetModules()
    const mod = await import('../validate-navigation-core')
    fetchNavigationData = mod.fetchNavigationData

    vi.mocked(global.fetch)
      .mockReturnValueOnce(createMockFetchResponse(false, null, 500))
      .mockReturnValueOnce(createMockFetchResponse(true, validResponse))

    const result = await fetchNavigationData()

    expect(result).toEqual(validResponse)
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(vi.mocked(global.fetch).mock.calls[0][0]).toBe(
      'https://custom.example.com/nav.json'
    )
    expect(vi.mocked(global.fetch).mock.calls[1][0]).toBe(DEFAULT_URL)
  })

  it('tries CDN fallbacks', async () => {
    vi.mocked(global.fetch)
      .mockReturnValueOnce(createMockFetchResponse(false, null, 500)) // primary (DEFAULT_URL)
      .mockReturnValueOnce(createMockFetchResponse(false, null, 503)) // JSDELIVR
      .mockReturnValueOnce(createMockFetchResponse(true, validResponse)) // STATICALLY

    const result = await fetchNavigationData()

    expect(result).toEqual(validResponse)
    expect(global.fetch).toHaveBeenCalledTimes(3)
    expect(vi.mocked(global.fetch).mock.calls[2][0]).toBe(STATICALLY_URL)
  })

  it('throws when ALL sources fail', async () => {
    vi.mocked(global.fetch)
      .mockReturnValueOnce(createMockFetchResponse(false, null, 500))
      .mockReturnValueOnce(createMockFetchResponse(false, null, 500))
      .mockReturnValueOnce(createMockFetchResponse(false, null, 500))

    await expect(fetchNavigationData()).rejects.toThrow(
      'All navigation fetch sources failed'
    )
  })
})

describe('validateNavigation', () => {
  let validateNavigation: typeof import('../validate-navigation-core').validateNavigation

  beforeEach(async () => {
    vi.resetModules()
    mockWriteFileSync.mockClear()
    global.fetch = vi.fn()
    delete process.env.NAVIGATION_JSON_URL
    delete process.env.navigationJsonUrl
    const mod = await import('../validate-navigation-core')
    validateNavigation = mod.validateNavigation
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('writes fetched JSON to output path', async () => {
    vi.mocked(global.fetch).mockReturnValueOnce(
      createMockFetchResponse(true, validResponse)
    )

    const outputPath = '/tmp/test-navigation.json'
    await validateNavigation(outputPath)

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      outputPath,
      JSON.stringify(validResponse, null, 2),
      'utf-8'
    )
  })

  it('throws on response with no navbar property', async () => {
    vi.mocked(global.fetch).mockReturnValueOnce(
      createMockFetchResponse(true, { data: [] })
    )

    await expect(validateNavigation('/tmp/out.json')).rejects.toThrow(
      'Navigation data missing "navbar" property'
    )
  })

  it('throws on response with empty navbar array', async () => {
    vi.mocked(global.fetch).mockReturnValueOnce(
      createMockFetchResponse(true, { navbar: [] })
    )

    await expect(validateNavigation('/tmp/out.json')).rejects.toThrow(
      'Navigation data has empty "navbar" array'
    )
  })

  it('throws on invalid JSON response', async () => {
    vi.mocked(global.fetch).mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
        text: () => Promise.resolve('not json'),
      } as Response)
    )

    await expect(validateNavigation('/tmp/out.json')).rejects.toThrow()
  })

  it('uses env URL when NAVIGATION_JSON_URL is set', async () => {
    const customUrl = 'https://custom.example.com/navigation.json'
    process.env.NAVIGATION_JSON_URL = customUrl
    vi.resetModules()
    const mod = await import('../validate-navigation-core')
    validateNavigation = mod.validateNavigation

    vi.mocked(global.fetch).mockReturnValueOnce(
      createMockFetchResponse(true, validResponse)
    )

    await validateNavigation('/tmp/out.json')

    expect(vi.mocked(global.fetch).mock.calls[0][0]).toBe(customUrl)
  })

  it('uses default GitHub URL when env var not set', async () => {
    vi.mocked(global.fetch).mockReturnValueOnce(
      createMockFetchResponse(true, validResponse)
    )

    await validateNavigation('/tmp/out.json')

    expect(vi.mocked(global.fetch).mock.calls[0][0]).toBe(DEFAULT_URL)
  })
})
