import { useMemo } from 'react'

interface PageIndex {
  curr: number
  total: number
}

function usePagination<T>(
  itemsPerPage: number,
  page: PageIndex,
  filteredResult: T[]
): T[] {
  const paginatedResult = useMemo(() => {
    return filteredResult.slice(
      (page.curr - 1) * itemsPerPage,
      page.curr * itemsPerPage
    )
  }, [page])

  return paginatedResult
}

export default usePagination
