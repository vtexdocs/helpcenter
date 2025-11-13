import fs from 'fs'
import path from 'path'
import {
  isRateLimited,
  parseRateLimitHeaders,
  formatRateLimitInfo,
} from './githubRateLimitHandler'
import {
  getCdnUrls,
  getGitHubRawUrl,
  convertToJsDelivr,
  convertToStatically,
} from './githubCdnFallback'
import { getLogger } from './logging/log-util'

const logger = getLogger('getNavigation')

const DEFAULT_OWNER = 'vtexdocs'
const DEFAULT_REPO = 'help-center-content'
const DEFAULT_PATH = 'public/navigation.json'
const DEFAULT_BRANCH = 'main'

type NavigationOptions = {
  branch?: string
}

type GithubSource = {
  owner: string
  repo: string
  ref: string
  path: string
  provider: 'raw' | 'jsdelivr' | 'statically'
}

function parseGithubSource(url: string): GithubSource | null {
  const rawMatch = url.match(
    /^https:\/\/raw\.githubusercontent\.com\/(.+?)\/(.+?)\/([^/]+)\/(.+)$/
  )

  if (rawMatch) {
    const [, owner, repo, ref, filePath] = rawMatch
    return {
      owner,
      repo,
      ref,
      path: filePath,
      provider: 'raw',
    }
  }

  const jsDelivrMatch = url.match(
    /^https:\/\/cdn\.jsdelivr\.net\/gh\/(.+?)\/(.+?)@([^/]+)\/(.+)$/
  )

  if (jsDelivrMatch) {
    const [, owner, repo, ref, filePath] = jsDelivrMatch
    return {
      owner,
      repo,
      ref,
      path: filePath,
      provider: 'jsdelivr',
    }
  }

  const staticallyMatch = url.match(
    /^https:\/\/cdn\.statically\.io\/gh\/(.+?)\/(.+?)\/([^/]+)\/(.+)$/
  )

  if (staticallyMatch) {
    const [, owner, repo, ref, filePath] = staticallyMatch
    return {
      owner,
      repo,
      ref,
      path: filePath,
      provider: 'statically',
    }
  }

  return null
}

function buildGithubUrl(source: GithubSource, branch: string) {
  switch (source.provider) {
    case 'jsdelivr':
      return convertToJsDelivr(source.owner, source.repo, branch, source.path)
    case 'statically':
      return convertToStatically(source.owner, source.repo, branch, source.path)
    default:
      return getGitHubRawUrl(source.owner, source.repo, branch, source.path)
  }
}

export default async function getNavigation(options: NavigationOptions = {}) {
  const branch = options.branch?.trim() || DEFAULT_BRANCH
  // Prefer environment URL to allow fetching from external repo
  const envUrl = process.env.navigationJsonUrl
  const githubSource = envUrl ? parseGithubSource(envUrl) : null
  const owner = githubSource?.owner || DEFAULT_OWNER
  const repo = githubSource?.repo || DEFAULT_REPO
  const filePath = githubSource?.path || DEFAULT_PATH
  const envUrlForBranch = githubSource
    ? buildGithubUrl(githubSource, branch)
    : envUrl

  if (githubSource && githubSource.ref !== branch) {
    logger.info(
      `Switching navigation source from ref ${githubSource.ref} to ${branch}`
    )
  }

  if (envUrlForBranch) {
    try {
      const result = await fetch(envUrlForBranch)

      // Check for rate limiting (403 OR 429)
      if (result.status === 403 || result.status === 429) {
        if (isRateLimited(result)) {
          const rateLimitInfo = parseRateLimitHeaders(result.headers)
          logger.warn(
            `Rate limited on primary URL. ${formatRateLimitInfo(rateLimitInfo)}`
          )
          // Fall through to CDN fallbacks below
        }
      } else if (result.ok) {
        const data = await result.json()
        return data.navbar
      }

      // If we got here, either rate limited or other error - try CDN fallbacks
      throw new Error(
        `Failed to fetch navigation from env URL: ${result.status}`
      )
    } catch (error) {
      logger.warn('Failed to fetch from env URL, trying CDN fallbacks')
      if (error instanceof Error) {
        logger.warn(error.message)
      }

      // Try CDN fallbacks
      const cdnUrls = getCdnUrls(owner, repo, branch, filePath, 'jsdelivr')

      for (const url of cdnUrls.slice(1)) {
        // Skip first (already tried)
        try {
          const cdnType = url.includes('jsdelivr') ? 'jsDelivr' : 'Statically'
          logger.info(`Trying ${cdnType}`)
          const result = await fetch(url)

          if (result.ok) {
            const data = await result.json()
            logger.info(`Successfully fetched from ${cdnType}`)
            return data.navbar
          }
        } catch (cdnErr) {
          logger.warn('CDN attempt failed')
          if (cdnErr instanceof Error) {
            logger.warn(cdnErr.message)
          }
          continue
        }
      }
    }
  }

  // Filesystem fallback (server-side only)
  try {
    const filePathFs = path.join(process.cwd(), 'public', 'navigation.json')
    const fileContent = fs.readFileSync(filePathFs, 'utf8')
    const navigation = JSON.parse(fileContent)
    logger.info('Using filesystem fallback')
    return navigation.navbar
  } catch (error) {
    logger.error('All methods failed')
    if (error instanceof Error) {
      logger.error(error.message)
    }
    throw error
  }
}
