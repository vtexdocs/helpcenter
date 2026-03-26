import type { NextApiRequest, NextApiResponse } from 'next'
import { getDocsPaths as getAnnouncementsPaths } from 'utils/getDocsPaths'
import { fetchBatch, parseFrontmatter } from 'utils/fetchBatchGithubData'
import { getLogger } from 'utils/logging/log-util'
import { getPreviewBranch } from 'utils/preview/getPreviewBranch'
import { AnnouncementDataElement } from 'utils/typings/types'
import { LocaleType } from 'utils/typings/unionTypes'

const logger = getLogger('announcements-api')

let docsPathsCache: Record<string, { locale: string; path: string }[]> | null =
  null

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const branch = getPreviewBranch(req.preview, req.previewData)
    const locale: LocaleType = (req.query.locale as LocaleType) || 'en'

    if (!docsPathsCache) {
      docsPathsCache = await getAnnouncementsPaths('announcements')
    }

    const slugs = Object.keys(docsPathsCache).sort().reverse().slice(0, 10)
    const announcementsData: AnnouncementDataElement[] = []

    for (const slug of slugs) {
      if (announcementsData.length >= 2) break

      const [result] = await fetchBatch(
        [slug],
        'help-center-content',
        docsPathsCache,
        locale,
        branch,
        logger
      )

      if (!result?.content) continue

      const frontmatter = await parseFrontmatter(result.content, logger)

      if (frontmatter) {
        announcementsData.push({
          title: String(frontmatter.title),
          url: `announcements/${slug}`,
          createdAt: String(frontmatter.createdAt),
          updatedAt: String(frontmatter.updatedAt),
          status: String(frontmatter.status),
          tags: Array.isArray(frontmatter.tags)
            ? frontmatter.tags.map(String)
            : [],
        })
      }
    }

    if (req.preview) {
      res.setHeader('Cache-Control', 'private, no-store')
      res.setHeader('Netlify-CDN-Cache-Control', 'private, no-store')
    } else {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=600, stale-while-revalidate=3600'
      )
      res.setHeader(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=600, stale-while-revalidate=3600'
      )
    }

    return res.status(200).json({ announcements: announcementsData })
  } catch (error) {
    logger.error('failed to load announcements')
    if (error instanceof Error) {
      logger.error(error.message)
    }
    return res.status(500).json({ error: 'Failed to load announcements' })
  }
}
