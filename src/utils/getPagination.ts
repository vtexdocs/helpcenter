import jp from 'jsonpath'
import { LoggerType } from './logging/log-util'

type DocItem = {
  slug: string | null
  name: Record<string, string>
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sidebarfallback: any
  currentLocale: string
  slug: string
  logger?: LoggerType
}

function getLocalizedValue(
  value: string | Record<string, string> | undefined,
  locale: string
): string | null {
  if (!value) return null
  if (typeof value === 'object') return value[locale] || value['en'] || null
  return value
}

export function getPagination({
  sidebarfallback,
  currentLocale,
  slug,
  logger = console,
}: GetPaginationParams): PaginationResult {
  const markdownNodes = jp.query(sidebarfallback, `$..[?(@.type=='markdown')]`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docsList: DocItem[] = markdownNodes.map((node: any) => ({
    slug: getLocalizedValue(node.slug, currentLocale),
    name:
      typeof node.name === 'string'
        ? { [currentLocale]: node.name }
        : node.name || {},
  }))

  const docsListSlug = docsList.map((doc) => doc.slug).filter(Boolean)
  const docsListName: Record<string, string>[] = docsList.map((doc) => doc.name)

  const indexOfSlug = docsListSlug.indexOf(slug)

  logger.info(
    `Slug matching for ${slug}: found at index ${indexOfSlug} in ${docsListSlug.length} total docs`
  )

  function getPaginationItem(index: number): PaginationItem {
    if (index < 0 || index >= docsListSlug.length) {
      return { slug: null, name: null }
    }

    return {
      slug: docsListSlug[index] || null,
      name: getLocalizedValue(docsListName[index], currentLocale),
    }
  }

  return {
    pagination: {
      previousDoc: getPaginationItem(indexOfSlug - 1),
      nextDoc: getPaginationItem(indexOfSlug + 1),
    },
    indexOfSlug,
    docsListName,
  }
}
