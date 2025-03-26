import { getLogger } from './logging/log-util'
import octokit from './octokitConfig'
import { fetchFromRawGithub } from './github-utils'
import retry, { isRateLimitError, GitHubErrorResponse } from './retry-util'
import { GITHUB_CONSTANTS } from './github-constants'
import { OctokitResponse } from '@octokit/types'

const logger = getLogger('getGithubFile')

interface GitHubContent {
  type: 'file' | 'dir' | 'submodule' | 'symlink'
  content?: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string | null
  git_url: string | null
  download_url: string | null
  name: string
  _links: {
    self: string
    git: string | null
    html: string | null
  }
}

type GitHubGetContentResponse = OctokitResponse<
  string | GitHubContent | GitHubContent[]
>

// File cache to avoid duplicate requests for the same file
interface FileCacheEntry {
  content: string
  timestamp: number
  expiresAt: number
}

// Promise deduplication cache for in-flight requests
interface FilePromiseCache {
  [key: string]: Promise<string>
}

const FILE_CACHE: Record<string, FileCacheEntry> = {}
const FILE_PROMISE_CACHE: FilePromiseCache = {}

// Default cache time for file content (10 minutes)
const FILE_CACHE_TTL = 10 * 60 * 1000

/**
 * Get a file from GitHub with caching and promise deduplication
 * @param owner Repository owner
 * @param repo Repository name
 * @param ref Branch or commit reference
 * @param path File path within the repository
 * @param allowEmpty Whether to allow empty content
 * @param options Optional configuration options
 * @returns Promise resolving to the file content
 */
export default async function getGithubFile(
  owner: string,
  repo: string,
  ref: string,
  path: string,
  allowEmpty = false,
  options: {
    // Whether to bypass cache and force a fresh request
    forceFresh?: boolean
    // Custom cache TTL in milliseconds
    cacheTTL?: number
  } = {}
): Promise<string> {
  const { forceFresh = false, cacheTTL = FILE_CACHE_TTL } = options
  const cacheKey = `${owner}/${repo}/${ref}/${path}`
  const endpoint = `${owner}/${repo}/${path}`

  // Check if we already have a request in progress for this file
  if (!forceFresh && cacheKey in FILE_PROMISE_CACHE) {
    logger.info(`Reusing in-flight request for ${cacheKey}`)
    return FILE_PROMISE_CACHE[cacheKey]
  }

  // Check if we have a valid cached response
  const cachedEntry = FILE_CACHE[cacheKey]
  const now = Date.now()

  if (!forceFresh && cachedEntry && cachedEntry.expiresAt > now) {
    logger.info(
      `Using cached file for ${cacheKey} (${Math.round(
        (cachedEntry.expiresAt - now) / 1000
      )}s remaining)`
    )
    return cachedEntry.content
  }

  // Create a new promise for this file request and cache it
  const filePromise = (async () => {
    try {
      const response = await retry<GitHubGetContentResponse>(
        () =>
          octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref,
            mediaType: {
              format: 'raw',
            },
          }),
        {
          maxRetries: GITHUB_CONSTANTS.DEFAULT_RETRIES,
          timeout: GITHUB_CONSTANTS.REQUEST_TIMEOUT,
          maxRateLimitWait: GITHUB_CONSTANTS.MAX_RATE_LIMIT_WAIT,
          operationName: `github-content:${path}`,
          handleRateLimit: true,
          shouldRetry: (error: unknown) => {
            const githubError = error as GitHubErrorResponse
            return isRateLimitError(githubError)
          },
        }
      )

      if (!response.data && !allowEmpty) {
        throw new Error(`Empty content received for ${endpoint}`)
      }

      let content = ''

      if (typeof response.data === 'string') {
        content = response.data
      } else if (
        !Array.isArray(response.data) &&
        response.data.type === 'file'
      ) {
        content = response.data.content || ''
      } else if (allowEmpty) {
        content = ''
      } else {
        throw new Error(`Unexpected response type for ${endpoint}`)
      }

      // Cache the successful response
      const timestamp = Date.now()
      FILE_CACHE[cacheKey] = {
        content,
        timestamp,
        expiresAt: timestamp + cacheTTL,
      }

      logger.info(
        `Successfully fetched and cached file ${cacheKey} (${content.length} bytes)`
      )

      return content
    } catch (error) {
      const githubError = error as GitHubErrorResponse
      if (isRateLimitError(githubError)) {
        logger.warn(
          `GitHub API rate limit exceeded for ${endpoint}, attempting fallback to raw.githubusercontent.com`
        )

        try {
          const content = await fetchFromRawGithub(owner, repo, ref, path)

          if (!content && !allowEmpty) {
            throw new Error('Empty content received from fallback')
          }

          // Cache the fallback response with a shorter TTL
          const timestamp = Date.now()
          const shorterTTL = Math.min(cacheTTL, 5 * 60 * 1000) // 5 minutes or the original TTL, whichever is shorter

          FILE_CACHE[cacheKey] = {
            content,
            timestamp,
            expiresAt: timestamp + shorterTTL,
          }

          logger.info(
            `Successfully fetched and cached file via fallback for ${cacheKey} (${content.length} bytes)`
          )

          return content
        } catch (fbError) {
          logger.error(
            `Fallback to raw.githubusercontent.com failed for ${endpoint}: ${
              fbError instanceof Error ? fbError.message : String(fbError)
            }`
          )

          throw new Error(
            `Failed to get GitHub file: Rate limit exceeded and fallback failed - ${
              fbError instanceof Error ? fbError.message : String(fbError)
            }`
          )
        }
      }

      // For non-rate-limit errors, include detailed error info
      const errorMsg =
        githubError?.response?.data?.message ||
        (error instanceof Error ? error.message : 'Unknown error')

      logger.error(`Failed to get GitHub file ${endpoint}: ${errorMsg}`)
      throw error
    } finally {
      // Remove the promise from the deduplication cache when done
      delete FILE_PROMISE_CACHE[cacheKey]
    }
  })()

  // Store the promise in the cache
  FILE_PROMISE_CACHE[cacheKey] = filePromise

  return filePromise
}

/**
 * Clear the file cache for a specific file or all files
 * @param owner Optional repository owner
 * @param repo Optional repository name
 * @param ref Optional branch or commit reference
 * @param path Optional file path
 */
export function clearFileCache(
  owner?: string,
  repo?: string,
  ref?: string,
  path?: string
): void {
  if (owner && repo && ref && path) {
    // Clear specific cache entry
    const cacheKey = `${owner}/${repo}/${ref}/${path}`
    delete FILE_CACHE[cacheKey]
    logger.info(`Cleared file cache for ${cacheKey}`)
  } else if (owner && repo && ref) {
    // Clear all cache entries for a specific ref
    const prefix = `${owner}/${repo}/${ref}/`
    Object.keys(FILE_CACHE)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => delete FILE_CACHE[key])
    logger.info(`Cleared file cache for all files in ${owner}/${repo}@${ref}`)
  } else if (owner && repo) {
    // Clear all cache entries for a specific repository
    const prefix = `${owner}/${repo}/`
    Object.keys(FILE_CACHE)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => delete FILE_CACHE[key])
    logger.info(`Cleared file cache for all files in ${owner}/${repo}`)
  } else if (owner) {
    // Clear all cache entries for a specific owner
    const prefix = `${owner}/`
    Object.keys(FILE_CACHE)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => delete FILE_CACHE[key])
    logger.info(`Cleared file cache for all repositories owned by ${owner}`)
  } else {
    // Clear entire cache
    Object.keys(FILE_CACHE).forEach((key) => delete FILE_CACHE[key])
    logger.info('Cleared entire file cache')
  }
}
