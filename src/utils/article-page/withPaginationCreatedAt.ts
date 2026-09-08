import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import { parseFrontmatter } from 'utils/fetchBatchGithubData'
import { DocsPaths } from 'utils/getDocsPaths'
import { LoggerType } from 'utils/logging/log-util'
import { LocaleType } from 'utils/typings/unionTypes'

type PaginationDoc = {
  slug: string | null
  name: string | null
  createdAt?: string
}

type Pagination = {
  previousDoc: PaginationDoc
  nextDoc: PaginationDoc
}

function slugFromPaginationHref(href: string | null) {
  if (!href) return null
  const parts = href.split('/').filter(Boolean)
  return parts.at(-1) ?? null
}

async function fetchCreatedAt({
  href,
  docsPaths,
  locale,
  branch,
  sectionSelected,
  logger,
}: {
  href: string | null
  docsPaths: DocsPaths
  locale: LocaleType
  branch: string
  sectionSelected: string
  logger: LoggerType
}) {
  const slug = slugFromPaginationHref(href)
  if (!slug) return undefined

  const path =
    docsPaths[slug]?.find((entry) => entry.locale === locale)?.path ||
    docsPaths[slug]?.[0]?.path
  if (!path) return undefined

  const raw = await fetchRawMarkdown(sectionSelected, branch, path)
  if (!raw) return undefined

  const frontmatter = await parseFrontmatter(raw, logger)
  const createdAt = frontmatter?.createdAt
  if (createdAt == null || createdAt === '') return undefined
  return String(createdAt)
}

export async function withPaginationCreatedAt({
  pagination,
  docsPaths,
  locale,
  branch,
  sectionSelected,
  logger,
}: {
  pagination: Pagination
  docsPaths: DocsPaths
  locale: LocaleType
  branch: string
  sectionSelected: string
  logger: LoggerType
}): Promise<Pagination> {
  if (!pagination?.previousDoc && !pagination?.nextDoc) {
    return pagination
  }

  const [previousCreatedAt, nextCreatedAt] = await Promise.all([
    fetchCreatedAt({
      href: pagination.previousDoc?.slug ?? null,
      docsPaths,
      locale,
      branch,
      sectionSelected,
      logger,
    }),
    fetchCreatedAt({
      href: pagination.nextDoc?.slug ?? null,
      docsPaths,
      locale,
      branch,
      sectionSelected,
      logger,
    }),
  ])

  return {
    previousDoc: {
      ...pagination.previousDoc,
      ...(previousCreatedAt ? { createdAt: previousCreatedAt } : {}),
    },
    nextDoc: {
      ...pagination.nextDoc,
      ...(nextCreatedAt ? { createdAt: nextCreatedAt } : {}),
    },
  }
}
