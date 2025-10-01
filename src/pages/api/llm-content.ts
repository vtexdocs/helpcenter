import type { NextApiRequest, NextApiResponse } from 'next'
import { getDocsPaths } from 'utils/getDocsPaths'
import replaceHTMLBlocks from 'utils/article-page/replaceHTMLBlocks'
import { fetchRawMarkdown } from 'utils/fetchRawMarkdown'
import escapeCurlyBraces from 'utils/escapeCurlyBraces'

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

    const section = String(req.query.section || '').trim()
    const locale = String(req.query.locale || '').trim() || 'en'
    const slug = String(req.query.slug || '').trim()
    const branch = String(req.query.branch || '').trim() || 'main'
    const pathParam = String(req.query.path || '').trim()

    const allowed = [
      'tracks',
      'tutorials',
      'faq',
      'announcements',
      'known-issues',
      'troubleshooting',
    ]

    if (!allowed.includes(section)) {
      return res.status(400).json({ error: 'Invalid section parameter' })
    }
    if (!slug) {
      return res.status(400).json({ error: 'Missing slug parameter' })
    }

    const sectionTyped = section as
      | 'tracks'
      | 'tutorials'
      | 'faq'
      | 'announcements'
      | 'known-issues'
      | 'troubleshooting'
    // If explicit path is provided, trust it and fetch directly.
    // This avoids any ambiguity around slug/locale mapping and also makes CDN keys unique per locale path.
    let entryPath = pathParam
    let resolvedLocale = locale
    let resolvedSlug = slug

    if (!entryPath) {
      const docsPaths = await getDocsPaths(sectionTyped, branch)
      const entries = docsPaths[slug]
      if (!entries || !entries.length) {
        return res.status(404).json({ error: 'Document not found' })
      }

      // Enforce exact locale match: do not fall back to any other locale
      const entry = entries.find((e) => e.locale === locale)
      if (!entry) {
        return res
          .status(404)
          .json({ error: 'Document not found for requested locale' })
      }
      entryPath = entry.path
      resolvedLocale = locale
      resolvedSlug = slug
    } else {
      // Derive resolved locale/slug from the provided path for diagnostics
      try {
        const match = entryPath.match(/^docs\/(pt|es|en)\/(.+)\.(md|mdx)$/)
        if (match) {
          resolvedLocale = match[1]
          const rest = match[2]
          const segs = rest.split('/')
          resolvedSlug = segs[segs.length - 1]
        }
      } catch {}
    }

    const raw = await fetchRawMarkdown(section, branch, entryPath)

    // Remove frontmatter (--- ... ---) from the beginning of the content
    const removeFrontmatter = (markdown: string): string => {
      const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/
      return markdown.replace(frontmatterRegex, '').trim()
    }

    const withoutFrontmatter = removeFrontmatter(raw)
    const content = escapeCurlyBraces(replaceHTMLBlocks(withoutFrontmatter))

    // Cache headers
    // Default to disabling cache unless explicitly set to 'false'
    const disableCache =
      (process.env.DISABLE_LLM_CONTENT_CACHE ?? 'true') === 'true'
    if (disableCache) {
      // Fully disable caching for testing
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, max-age=0'
      )
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
      res.setHeader('Netlify-CDN-Cache-Control', 'no-store')
    } else {
      // Default: 5m s-maxage, 30m stale-while-revalidate
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=1800'
      )
      res.setHeader(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=1800'
      )
    }

    return res.status(200).json({
      section,
      // Echo request params explicitly
      requestedLocale: locale,
      requestedSlug: slug,
      // Resolved values (from path or entry)
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
