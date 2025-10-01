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
    const docsPaths = await getDocsPaths(sectionTyped, branch)
    const entries = docsPaths[slug]
    if (!entries || !entries.length) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const entry =
      entries.find((e) => e.locale === locale) ||
      entries.find((e) => e.locale === 'en')
    if (!entry) {
      return res
        .status(404)
        .json({ error: 'Document not found for requested locale' })
    }

    const raw = await fetchRawMarkdown(section, branch, entry.path)

    // Remove frontmatter (--- ... ---) from the beginning of the content
    const removeFrontmatter = (markdown: string): string => {
      const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/
      return markdown.replace(frontmatterRegex, '').trim()
    }

    const withoutFrontmatter = removeFrontmatter(raw)
    const content = escapeCurlyBraces(replaceHTMLBlocks(withoutFrontmatter))

    // Cache headers: 5m s-maxage, 30m stale-while-revalidate
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=1800'
    )
    res.setHeader(
      'Netlify-CDN-Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=1800'
    )

    return res.status(200).json({
      section,
      locale: locale,
      slug,
      path: entry.path,
      branch,
      content,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('llm-content API error', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
