import type { NextApiRequest, NextApiResponse } from 'next'
import { getDocsPaths } from 'utils/getDocsPaths'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'

const SECTIONS = [
  'tracks',
  'tutorials',
  'faq',
  'announcements',
  'known-issues',
  'troubleshooting',
] as const

type Section = (typeof SECTIONS)[number]

const isSection = (value: string): value is Section =>
  SECTIONS.includes(value as Section)

const parseContentPath = (filePath: string) => {
  const match = filePath.match(
    /^docs\/(pt|es|en)\/(tracks|tutorials|faq|announcements|known-issues|troubleshooting)\/(.+)\.(md|mdx)$/
  )
  if (!match) return null

  const rest = match[3]
  const segs = rest.split('/')
  return {
    locale: match[1],
    section: match[2] as Section,
    slug: segs[segs.length - 1],
  }
}

const removeFrontmatter = (markdown: string): string => {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/
  return markdown.replace(frontmatterRegex, '').trim()
}

const setCacheHeaders = (res: NextApiResponse) => {
  const disableCache =
    (process.env.DISABLE_LLM_CONTENT_CACHE ?? 'false') === 'true'
  if (disableCache) {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, max-age=0'
    )
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Netlify-CDN-Cache-Control', 'no-store')
    return
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=3600'
  )
  res.setHeader(
    'Netlify-CDN-Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=3600'
  )
}

// GET /api/llm-content?path=<docs/en/...md>
// GET /api/llm-content?section=<tracks|tutorials|faq|announcements|known-issues|troubleshooting>&locale=<en|es|pt>&slug=<slug>&branch=<optional>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const requestedSection = String(req.query.section || '').trim()
    const locale = String(req.query.locale || '').trim() || 'en'
    const slug = String(req.query.slug || '').trim()
    const branch = String(req.query.branch || '').trim() || 'main'
    const pathParam = String(req.query.path || '').trim()
    const parsedPath = pathParam ? parseContentPath(pathParam) : null

    let entryPath = pathParam
    let section = requestedSection
    let resolvedLocale = locale
    let resolvedSlug = slug

    if (entryPath) {
      if (parsedPath) {
        if (!section) section = parsedPath.section
        resolvedLocale = parsedPath.locale
        resolvedSlug = parsedPath.slug
      }
    } else {
      if (!isSection(section)) {
        return res.status(400).json({ error: 'Invalid section parameter' })
      }
      if (!slug) {
        return res.status(400).json({ error: 'Missing slug parameter' })
      }

      const docsPaths = await getDocsPaths(section, branch)
      const entries = docsPaths[slug]
      if (!entries || !entries.length) {
        return res.status(404).json({ error: 'Document not found' })
      }

      const entry = entries.find((e) => e.locale === locale)
      if (!entry) {
        return res
          .status(404)
          .json({ error: 'Document not found for requested locale' })
      }
      entryPath = entry.path
      resolvedLocale = locale
      resolvedSlug = slug
    }

    if (!isSection(section)) {
      return res.status(400).json({ error: 'Invalid section parameter' })
    }

    const raw = await fetchRawMarkdown(section, branch, entryPath)
    const content = escapeCurlyBraces(replaceHTMLBlocks(removeFrontmatter(raw)))

    setCacheHeaders(res)
    res.setHeader('Vary', 'User-Agent')

    return res.status(200).json({
      section,
      requestedLocale: locale,
      requestedSlug: slug,
      locale: resolvedLocale,
      slug: resolvedSlug,
      path: entryPath,
      branch,
      content,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('llm-content API error', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
