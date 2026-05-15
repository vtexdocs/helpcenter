import useSWRImmutable from 'swr'
import type { NavbarItem, NavigationData } from 'types/navigation'

const fetcher = (url: string): Promise<NavigationData> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Navigation fetch failed: ${res.status}`)
    return res.json()
  })

/**
 * Fetches and caches the Help Center navigation data.
 *
 * @returns navigation — the navbar items array (or null while loading/on error)
 * @returns isLoading — true until data or error is available
 * @returns isError — the Error instance if the fetch failed, otherwise undefined
 */
export default function useNavigation() {
  const { data, error } = useSWRImmutable<NavigationData>(
    '/api/navigation',
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    navigation: (data?.navbar ?? null) as NavbarItem[] | null,
    isLoading: !error && !data,
    isError: error as Error | undefined,
  }
}
