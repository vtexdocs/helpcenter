import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { type ReactNode } from 'react'
import useNavigation from '../useNavigation'

const mockNavbar = [
  {
    documentation: 'Tutorials',
    slugPrefix: 'docs/tutorials',
    categories: [],
  },
]
const mockApiResponse = { navbar: mockNavbar }

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
)

describe('useNavigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns loading=true initially', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch

    const { result } = renderHook(() => useNavigation(), { wrapper })
    expect(result.current.isLoading).toBe(true)
  })

  it('returns navigation data on successful fetch', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as unknown as typeof fetch

    const { result } = renderHook(() => useNavigation(), { wrapper })

    await waitFor(() => {
      expect(result.current.navigation).toEqual(mockNavbar)
    })
  })

  it('returns isLoading=false after data loads', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as unknown as typeof fetch

    const { result } = renderHook(() => useNavigation(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('returns null navigation and isError on fetch failure', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as unknown as typeof fetch

    const { result } = renderHook(() => useNavigation(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBeTruthy()
    })
    expect(result.current.navigation).toBeNull()
  })

  it('extracts .navbar from response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as unknown as typeof fetch

    const { result } = renderHook(() => useNavigation(), { wrapper })

    await waitFor(() => {
      expect(result.current.navigation).toEqual(mockNavbar)
    })
    // Should NOT be the full response object
    expect(result.current.navigation).not.toHaveProperty('navbar')
  })

  it('calls /api/navigation endpoint', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as unknown as typeof fetch

    renderHook(() => useNavigation(), { wrapper })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/navigation')
    })
  })
})
