/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { getGithubTree } from 'utils/github-utils'
import { getLogger } from 'utils/logging/log-util'

export async function getAllDocsPaths(branch = 'main') {
  const docsPaths: { [slug: string]: { locale: string; path: string }[] } = {}

  const repoTree = await getGithubTree(
    'vtexdocs',
    'help-center-content',
    branch,
    'getAllDocsPaths'
  )
  // @ts-ignore
  repoTree.tree.map((node: any) => {
    const path = node.path
    const re =
      /^(?<path>.+\/)*(?<locale>pt|es|en+)\/(?<localeDir>.+\/)*(?<filename>.+)\.(?<filetype>.+)$/
    if (path.startsWith(`docs/`)) {
      const match = path.match(re)
      const filename = match?.groups?.filename ? match?.groups?.filename : ''
      const filetype = match?.groups?.filetype ? match?.groups?.filetype : ''
      const fileLocale = match?.groups?.locale ? match?.groups?.locale : ''
      if (filetype === 'md' || filetype === 'mdx') {
        if (!docsPaths[filename]) docsPaths[filename] = []
        docsPaths[filename].push({
          locale: fileLocale,
          path,
        })
      }
    }
  })
  return docsPaths
}

export async function getDocsPaths(
  category:
    | 'tracks'
    | 'tutorials'
    | 'announcements'
    | 'faq'
    | 'known-issues'
    | 'troubleshooting',
  branch = 'main'
) {
  const logger = getLogger('getDocsPaths')
  const docsPaths: { [slug: string]: { locale: string; path: string }[] } = {}

  logger.info(
    `Fetching GitHub tree for category: ${category}, branch: ${branch}`
  )

  try {
    const repoTree = await getGithubTree(
      'vtexdocs',
      'help-center-content',
      branch,
      'getDocsPaths'
    )

    logger.info(`Got GitHub tree with ${repoTree?.tree?.length || 0} items`)

    // Enhanced debugging for GitHub tree contents
    logger.info(`Tree truncated: ${repoTree?.truncated ? 'YES' : 'NO'}`)
    logger.info(
      `First 5 paths in tree: ${JSON.stringify(
        repoTree?.tree?.slice(0, 5).map((n) => n.path) || []
      )}`
    )

    // Track potential known-issues paths for debugging
    const potentialPaths: string[] = []

    // @ts-ignore
    repoTree.tree.forEach((node: any) => {
      const path = node.path

      // Log any path that might be related to the target category
      if (path.includes(category)) {
        potentialPaths.push(path)
      }

      // First try the localized pattern
      const localizedRe =
        /^docs\/(?<locale>pt|es|en)\/.*?\/(?<filename>[^/]+)\.(md|mdx)$/i
      let match = path.match(localizedRe)

      // If no match, try the direct pattern
      if (!match) {
        const directRe = /^docs\/.*?\/(?<filename>[^/]+)\.(md|mdx)$/i
        match = path.match(directRe)
      }

      // Enhanced debugging - log all matches
      if (match && path.includes(category)) {
        logger.info(`Found matching path: ${path}`)
        logger.info(`  Filename: ${match.groups?.filename || 'undefined'}`)
        logger.info(`  Locale: ${match.groups?.locale || 'undefined'}`)

        const filename = match.groups?.filename || ''
        const fileLocale = match.groups?.locale || 'en' // default to 'en' if no locale found

        if (!docsPaths[filename]) {
          docsPaths[filename] = []
        }

        docsPaths[filename].push({
          locale: fileLocale,
          path,
        })
      }
    })

    logger.info(
      `Found ${Object.keys(docsPaths).length} paths for category ${category}`
    )

    if (Object.keys(docsPaths).length === 0) {
      logger.warn(
        `No paths found for category ${category}. Found these potential paths:`
      )
      if (potentialPaths.length === 0) {
        logger.warn(
          'No potential paths found either - this suggests the GitHub API may be returning incomplete data'
        )
      } else {
        potentialPaths.forEach((path) => logger.warn(`- ${path}`))
      }
    } else {
      logger.info(`Found paths: ${JSON.stringify(Object.keys(docsPaths))}`)
    }

    return docsPaths
  } catch (error) {
    logger.error(
      `Error fetching paths for ${category}: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
    // Return empty object as fallback
    return {}
  }
}
