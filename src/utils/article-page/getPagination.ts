import jp from 'jsonpath'
import { LoggerType } from '../logging/log-util'

type PaginationItem = {
  slug: string | null
  name: string | null
}

type PaginationResult = {
  pagination: {
    previousDoc: PaginationItem
    nextDoc: PaginationItem
  }
  indexOfSlug: number
  docsListName: Record<string, string>[]
}

type GetPaginationParams = {
  contentType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sidebarfallback: any
  currentLocale: string
  slug: string
  logger?: LoggerType
}

export function getPagination({
  contentType,
  sidebarfallback,
  currentLocale,
  slug,
}: GetPaginationParams): PaginationResult {
  const docsListSlug = jp
    .query(sidebarfallback, `$..[?(@.type=='markdown')]..slug`)
    .map((s) => (typeof s === 'object' ? s[currentLocale] || s.en : s))
    .filter(Boolean)

  const docsListName = jp
    .query(sidebarfallback, `$..[?(@.type=='markdown')]..name`)
    .map((n) => (typeof n === 'object' ? n : { [currentLocale]: n }))

  const indexOfSlug = docsListSlug.indexOf(slug)
  const pagination = {
    previousDoc:
      indexOfSlug > 0
        ? {
            slug: `/${contentType}/${docsListSlug[indexOfSlug - 1]}`,
            name:
              docsListName[indexOfSlug - 1]?.[currentLocale] ||
              docsListName[indexOfSlug - 1]?.en,
          }
        : { slug: null, name: null },
    nextDoc:
      indexOfSlug < docsListSlug.length - 1
        ? {
            slug: `/${contentType}/${docsListSlug[indexOfSlug + 1]}`,
            name:
              docsListName[indexOfSlug + 1]?.[currentLocale] ||
              docsListName[indexOfSlug + 1]?.en,
          }
        : { slug: null, name: null },
  }

  return {
    pagination,
    indexOfSlug,
    docsListName,
  }
}

export function isCategoryCover(
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sidebarfallback: any
): string[] {
  const categorySlugs: Record<string, string>[] = jp.query(
    sidebarfallback,
    `$..[?(@.type=="category")].slug`
  )

  const matchingLocales: string[] = []

  for (const slugObj of categorySlugs) {
    for (const [locale, value] of Object.entries(slugObj)) {
      if (value === slug) {
        matchingLocales.push(locale)
      }
    }
  }

  return matchingLocales
}
