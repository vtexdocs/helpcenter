import { getLogger } from './logging/log-util'
import { fetchFromRawGithub } from './github-utils'
import { isRateLimitError } from './retry-util'
import type { GitHubErrorResponse } from './retry-util'
import getGithubFile from './getGithubFile'

const logger = getLogger('getGithubFileWithFallback')

// Promise deduplication cache for in-flight requests
interface FallbackPromiseCache {
  [key: string]: Promise<string>
}

const FALLBACK_PROMISE_CACHE: FallbackPromiseCache = {}

/**
 * Get a file from GitHub with enhanced fallback mechanisms and promise deduplication
 * This function provides additional fallback to raw.githubusercontent.com and reuses
 * the caching and promise deduplication from getGithubFile
 *
 * @param owner Repository owner
 * @param repo Repository name
 * @param ref Branch or commit reference
 * @param path File path within the repository
 * @param options Optional configuration options
 * @returns Promise resolving to the file content
 */
export default async function getGithubFileWithFallback(
  owner: string,
  repo: string,
  ref: string,
  path: string,
  options: {
    // Whether to bypass cache and force a fresh request
    forceFresh?: boolean
  } = {}
): Promise<string> {
  const { forceFresh = false } = options
  const cacheKey = `${owner}/${repo}/${ref}/${path}`

  // Check if we already have a request in progress for this file
  if (!forceFresh && cacheKey in FALLBACK_PROMISE_CACHE) {
    logger.info(`Reusing in-flight fallback request for ${cacheKey}`)
    return FALLBACK_PROMISE_CACHE[cacheKey]
  }

  // Create a new promise for this file request and cache it
  const filePromise = (async () => {
    try {
      // Use getGithubFile which already has caching and retries built in
      return await getGithubFile(owner, repo, ref, path, false, { forceFresh })
    } catch (error) {
      const err = error as GitHubErrorResponse

      // If rate limit or other error, try raw GitHub URL as fallback
      const errorSource = isRateLimitError(err)
        ? 'GitHub API rate limit exceeded'
        : `Octokit request failed: ${
            err.response?.data?.message || 'Unknown error'
          }`

      logger.info(`${errorSource}, falling back to raw.githubusercontent.com`)

      try {
        return await fetchFromRawGithub(owner, repo, ref, path)
      } catch (fallbackError) {
        logger.error(
          `All fallback attempts failed for ${cacheKey}: ${
            fallbackError instanceof Error
              ? fallbackError.message
              : String(fallbackError)
          }`
        )
        throw new Error(
          `Failed to get GitHub file after all fallback attempts: ${
            fallbackError instanceof Error
              ? fallbackError.message
              : String(fallbackError)
          }`
        )
      }
    } finally {
      // Remove the promise from the deduplication cache when done
      delete FALLBACK_PROMISE_CACHE[cacheKey]
    }
  })()

  // Store the promise in the cache
  FALLBACK_PROMISE_CACHE[cacheKey] = filePromise

  return filePromise
}
