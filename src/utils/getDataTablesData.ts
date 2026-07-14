import { fetchGitHubFileWithFallback } from './githubCdnFallback'
import type {
  DataTableRow,
  DataTablesData,
} from 'components/datatable/datatable.types'

const DEFAULT_LOCALE = 'en'

const DATA_TABLE_TAG_REGEX =
  /<DataTable\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*\/?>/g

interface RawDataTableFile {
  rows?: DataTableRow[]
  updatedAt?: string
  [locale: string]: unknown
}

function extractDataTableSrcs(content: string): string[] {
  const srcs = new Set<string>()
  let match: RegExpExecArray | null
  DATA_TABLE_TAG_REGEX.lastIndex = 0
  while ((match = DATA_TABLE_TAG_REGEX.exec(content)) !== null) {
    srcs.add(match[1])
  }
  return Array.from(srcs)
}

const resolveContentPath = (src: string): string => {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(src) || src.startsWith('//')) {
    throw new Error('Absolute or external URLs are not allowed')
  }

  const path = src.replace(/^\//, '')

  if (!path || path.includes('..')) {
    throw new Error('Invalid DataTable src path')
  }

  return path
}

async function fetchSource(src: string, branch: string): Promise<string> {
  const path = resolveContentPath(src)
  return fetchGitHubFileWithFallback(
    'vtexdocs',
    'help-center-content',
    branch,
    path,
    { cdnFallbackEnabled: true, preferredCdn: 'jsdelivr' }
  )
}

export async function getDataTablesData({
  content,
  branch,
  locale,
  logger,
}: {
  content: string
  branch: string
  locale: string
  logger: { warn: (msg: string) => void; error: (msg: string) => void }
}): Promise<DataTablesData> {
  const srcs = extractDataTableSrcs(content)
  const data: DataTablesData = {}

  await Promise.all(
    srcs.map(async (src) => {
      try {
        const raw = await fetchSource(src, branch)
        const parsed = JSON.parse(raw) as RawDataTableFile

        const rows =
          parsed.rows ??
          (parsed[locale] as DataTableRow[] | undefined) ??
          (parsed[DEFAULT_LOCALE] as DataTableRow[] | undefined) ??
          []

        data[src] = { rows, updatedAt: parsed.updatedAt }
      } catch (error) {
        logger.warn(
          `Failed to load DataTable data for src "${src}": ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }
    })
  )

  return data
}
