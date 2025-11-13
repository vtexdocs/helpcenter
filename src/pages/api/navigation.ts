import type { NextApiRequest, NextApiResponse } from 'next'
import getNavigation from 'utils/getNavigation'
import { getPreviewBranch } from 'utils/preview/getPreviewBranch'
import { getLogger } from 'utils/logging/log-util'

const logger = getLogger('navigation-api')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const branch = getPreviewBranch(req.preview, req.previewData)
    const navbar = await getNavigation({ branch })

    if (req.preview) {
      res.setHeader('Cache-Control', 'private, no-store')
      res.setHeader('Netlify-CDN-Cache-Control', 'private, no-store')
    } else {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=1800'
      )
      res.setHeader(
        'Netlify-CDN-Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=1800'
      )
    }

    return res.status(200).json({ navbar })
  } catch (error) {
    logger.error('failed to load navigation')
    if (error instanceof Error) {
      logger.error(error.message)
    }
    return res.status(500).json({ error: 'Failed to load navigation' })
  }
}
