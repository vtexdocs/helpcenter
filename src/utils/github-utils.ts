import { extract } from 'tar'
import { getLogger } from './logging/log-util'
import octokit from './octokitConfig'
import retry from './retry-util'
import { GITHUB_CONSTANTS } from './github-constants'
import { isRateLimitError, GitHubErrorResponse } from './retry-util'
import fetch from 'node-fetch'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

const logger = getLogger('github-utils')

export interface GithubTreeItem {
  path: string
  type: string
}

export interface GithubTreeResponse {
  tree: GithubTreeItem[]
  truncated?: boolean
}

export interface OctokitTreeResponse {
  data: {
    tree: Array<{ path?: string; type?: string }>
    truncated?: boolean
  }
}

// Tree cache to avoid duplicate requests for the same repository tree
interface TreeCacheEntry {
  tree: GithubTreeResponse
  timestamp: number
  expiresAt: number
}

// Promise deduplication cache for in-flight requests
interface TreePromiseCache {
  [key: string]: Promise<GithubTreeResponse>
}

const TREE_CACHE: Record<string, TreeCacheEntry> = {}
const TREE_PROMISE_CACHE: TreePromiseCache = {}

// Default cache time for tree data (10 minutes)
const TREE_CACHE_TTL = 10 * 60 * 1000

/**
 * Fetches and extracts a repository tarball with retries and proper error handling
 */
async function getGithubTreeViaTarball(
  owner: string,
  repo: string,
  ref: string,
  caller: string
): Promise<GithubTreeResponse> {
  logger.info(
    `[${caller}] Fetching repository tarball for ${owner}/${repo}@${ref}`
  )
  // Create a unique temporary directory
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), `github-tarball-${owner}-${repo}-`)
  )
  logger.info(`[${caller}] Created temporary directory: ${tempDir}`)

  try {
    const startTime = Date.now()
    // Fetch tarball with retries
    const fetchStartTime = Date.now()
    const tarballUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${ref}.tar.gz`
    logger.info(`[${caller}] Fetching tarball from ${tarballUrl}`)

    const response = await retry(() => fetch(tarballUrl), {
      maxRetries: GITHUB_CONSTANTS.DEFAULT_RETRIES,
      timeout: GITHUB_CONSTANTS.REQUEST_TIMEOUT,
      maxRateLimitWait: GITHUB_CONSTANTS.MAX_RATE_LIMIT_WAIT,
      operationName: `tarball:${owner}/${repo}/${ref}`,
      shouldRetry: (error: unknown) => {
        if (error instanceof Error) {
          // Retry on common network errors
          return (
            error.message.includes('ETIMEDOUT') ||
            error.message.includes('ECONNRESET') ||
            error.message.includes('ECONNREFUSED') ||
            error.message.includes('socket hang up') ||
            isRateLimitError(error as GitHubErrorResponse)
          )
        }
        return false
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch tarball: ${response.status} ${response.statusText}`
      )
    }

    const fetchEndTime = Date.now()
    logger.info(
      `[${caller}] Tarball fetch completed in ${
        fetchEndTime - fetchStartTime
      }ms`
    )

    // Buffer the response content
    const bufferStartTime = Date.now()
    const buffer = await response.buffer()
    const bufferEndTime = Date.now()
    logger.info(
      `[${caller}] Buffer creation completed in ${
        bufferEndTime - bufferStartTime
      }ms (size: ${buffer.length} bytes)`
    )

    // Extract tarball
    const files: GithubTreeItem[] = []
    const extractStartTime = Date.now()
    // Save buffer to a temporary file with retries
    const tempFilePath = path.join(tempDir, 'archive.tar.gz')
    await retry(() => fs.promises.writeFile(tempFilePath, buffer), {
      maxRetries: 3,
      timeout: 5000,
      operationName: `write-tarball:${tempFilePath}`,
      shouldRetry: (error: unknown) => {
        if (error instanceof Error) {
          return (
            error.message.includes('ENOSPC') || // No space left
            error.message.includes('EMFILE') || // Too many open files
            error.message.includes('EBUSY') // Resource busy
          )
        }
        return false
      },
    })
    logger.info(`[${caller}] Saved tarball to temporary file: ${tempFilePath}`)

    // Extract to temp directory with proper error handling
    try {
      await extract({
        cwd: tempDir,
        gzip: true,
        file: tempFilePath,
        onentry: (entry) => {
          // Remove the top-level directory from the path
          const parts = entry.path.split('/')
          if (parts.length <= 1) {
            return // Skip the root directory itself
          }
          // Remove the first part (repo-branch) from the path
          const relativePath = parts.slice(1).join('/')
          if (relativePath) {
            files.push({
              path: relativePath,
              type: entry.type === 'Directory' ? 'tree' : 'blob',
            })
          }
        },
      })
    } catch (extractError) {
      logger.error(
        `[${caller}] Failed to extract tarball: ${
          extractError instanceof Error
            ? extractError.message
            : String(extractError)
        }`
      )
      throw extractError
    }

    const extractEndTime = Date.now()
    logger.info(
      `[${caller}] Tarball extraction completed in ${
        extractEndTime - extractStartTime
      }ms (${files.length} files extracted)`
    )

    const endTime = Date.now()
    logger.info(
      `[${caller}] Total tarball processing time: ${endTime - startTime}ms`
    )

    return { tree: files }
  } catch (error) {
    logger.error(
      `[${caller}] Failed to process tarball: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
    throw error
  } finally {
    // Clean up the temporary directory with retries
    try {
      await retry(
        () => fs.promises.rm(tempDir, { recursive: true, force: true }),
        {
          maxRetries: 3,
          timeout: 5000,
          operationName: `cleanup:${tempDir}`,
          shouldRetry: (error: unknown) => {
            if (error instanceof Error) {
              return (
                error.message.includes('EBUSY') || // Resource busy
                error.message.includes('ENOTEMPTY') || // Directory not empty
                error.message.includes('EPERM') // Permission denied
              )
            }
            return false
          },
        }
      )
      logger.info(`[${caller}] Cleaned up temporary directory: ${tempDir}`)
    } catch (cleanupError) {
      logger.warn(
        `[${caller}] Failed to clean up temporary directory ${tempDir}: ${
          cleanupError instanceof Error
            ? cleanupError.message
            : String(cleanupError)
        }`
      )
    }
  }
}

/**
 * Get a GitHub repository tree with caching and promise deduplication
 * @param owner Repository owner
 * @param repo Repository name
 * @param ref Branch or commit reference
 * @param caller Identifier for the calling module (for logging)
 * @param options Optional configuration
 * @returns Promise resolving to the repository tree
 */
export async function getGithubTree(
  owner: string,
  repo: string,
  ref: string,
  caller: string,
  options: {
    // Whether to bypass cache and force a fresh request
    forceFresh?: boolean
    // Custom cache TTL in milliseconds
    cacheTTL?: number
    // For testing: Force the tarball fallback path
    forceTarballFallback?: boolean
  } = {}
): Promise<GithubTreeResponse> {
  const {
    forceFresh = false,
    cacheTTL = TREE_CACHE_TTL,
    forceTarballFallback = false,
  } = options

  // Enhanced debugging
  logger.info(`[${caller}] Requested GitHub tree for ${owner}/${repo}@${ref}`)

  const cacheKey = `${owner}/${repo}/${ref}`

  // Check if we already have a request in progress for this tree
  if (!forceFresh && cacheKey in TREE_PROMISE_CACHE) {
    logger.info(`[${caller}] Reusing in-flight request for ${cacheKey}`)
    return TREE_PROMISE_CACHE[cacheKey]
  }

  // Check if we have a valid cached response
  const cachedEntry = TREE_CACHE[cacheKey]
  const now = Date.now()
  if (!forceFresh && cachedEntry && cachedEntry.expiresAt > now) {
    logger.info(
      `[${caller}] Using cached tree for ${cacheKey} (${Math.round(
        (cachedEntry.expiresAt - now) / 1000
      )}s remaining)`
    )
    return cachedEntry.tree
  }

  // Create a new promise for this tree request and cache it
  const treePromise = (async () => {
    try {
      // If forceTarballFallback is set, skip the API call and go straight to tarball
      if (forceTarballFallback) {
        logger.warn(
          `[${caller}] Forced tarball fallback for testing purposes: ${owner}/${repo}@${ref}`
        )
        try {
          const tarballResponse = await getGithubTreeViaTarball(
            owner,
            repo,
            ref,
            caller
          )
          // Cache the tarball fallback response
          const timestamp = Date.now()
          TREE_CACHE[cacheKey] = {
            tree: tarballResponse,
            timestamp,
            expiresAt: timestamp + cacheTTL,
          }
          logger.info(
            `[${caller}] Successfully fetched and cached tree via tarball fallback for ${cacheKey}`
          )
          return tarballResponse
        } catch (tarballError) {
          logger.error(
            `[${caller}] Tarball fallback failed: ${
              tarballError instanceof Error
                ? tarballError.message
                : String(tarballError)
            }`
          )
          throw tarballError
        }
      }

      logger.info(
        `[${caller}] Fetching repository tree for ${owner}/${repo}@${ref}`
      )

      // Additional logging for debugging
      logger.info(`[${caller}] Using octokit.rest.git.getTree endpoint`)

      try {
        const response = await retry<OctokitTreeResponse>(
          () =>
            octokit.rest.git.getTree({
              owner,
              repo,
              tree_sha: ref,
              recursive: 'true',
            }),
          {
            maxRetries: GITHUB_CONSTANTS.DEFAULT_RETRIES,
            timeout: GITHUB_CONSTANTS.REQUEST_TIMEOUT,
            maxRateLimitWait: GITHUB_CONSTANTS.MAX_RATE_LIMIT_WAIT,
            operationName: `github-tree:${owner}/${repo}/${ref}`,
            handleRateLimit: true,
            shouldRetry: (error: unknown) => {
              const githubError = error as GitHubErrorResponse
              return isRateLimitError(githubError)
            },
          }
        )

        // Log response details for debugging
        logger.info(
          `[${caller}] GitHub API response received for ${cacheKey}, truncated=${response.data.truncated}, entries=${response.data.tree.length}`
        )

        // Filter out entries with undefined path or type
        const treeResponse: GithubTreeResponse = {
          tree: response.data.tree
            .filter(
              (item): item is { path: string; type: string } =>
                typeof item.path === 'string' && typeof item.type === 'string'
            )
            .map(({ path, type }) => ({ path, type })),
          truncated: response.data.truncated,
        }

        // Debugging for paths related to known-issues
        const knownIssuesPaths = treeResponse.tree
          .filter((item) => item.path.includes('known-issues'))
          .map((item) => item.path)

        logger.info(
          `[${caller}] Found ${knownIssuesPaths.length} paths containing 'known-issues':`
        )

        if (knownIssuesPaths.length > 0) {
          knownIssuesPaths.slice(0, 10).forEach((path) => {
            logger.info(`[${caller}] - ${path}`)
          })

          if (knownIssuesPaths.length > 10) {
            logger.info(
              `[${caller}] ... and ${knownIssuesPaths.length - 10} more`
            )
          }
        }

        // Cache the successful response
        const timestamp = Date.now()
        TREE_CACHE[cacheKey] = {
          tree: treeResponse,
          timestamp,
          expiresAt: timestamp + cacheTTL,
        }

        logger.info(
          `[${caller}] Successfully fetched and cached tree for ${cacheKey} with ${treeResponse.tree.length} entries`
        )
        return treeResponse
      } catch (apiError) {
        logger.error(
          `[${caller}] API request failed: ${
            apiError instanceof Error ? apiError.message : String(apiError)
          }`
        )
        throw apiError
      }
    } catch (error) {
      const githubError = error as GitHubErrorResponse
      if (isRateLimitError(githubError)) {
        logger.warn(
          `[${caller}] GitHub API rate limit hit, attempting tarball fallback...`
        )
        try {
          const tarballResponse = await getGithubTreeViaTarball(
            owner,
            repo,
            ref,
            caller
          )
          // Cache the tarball fallback response with a shorter TTL
          const timestamp = Date.now()
          const shorterTTL = Math.min(cacheTTL, 5 * 60 * 1000) // 5 minutes or the original TTL, whichever is shorter
          TREE_CACHE[cacheKey] = {
            tree: tarballResponse,
            timestamp,
            expiresAt: timestamp + shorterTTL,
          }
          logger.info(
            `[${caller}] Successfully fetched and cached tree via tarball fallback for ${cacheKey}`
          )
          return tarballResponse
        } catch (tarballError) {
          logger.error(
            `[${caller}] Tarball fallback failed: ${
              tarballError instanceof Error
                ? tarballError.message
                : String(tarballError)
            }`
          )
          throw tarballError
        }
      }
      throw error
    } finally {
      // Remove the promise from the deduplication cache when done
      delete TREE_PROMISE_CACHE[cacheKey]
    }
  })()

  // Store the promise in the cache
  TREE_PROMISE_CACHE[cacheKey] = treePromise
  return treePromise
}

/**
 * Test function to force the tarball fallback mechanism
 * This is useful for checking if the tarball fallback is working properly
 *
 * @param owner Repository owner
 * @param repo Repository name
 * @param ref Branch or commit reference
 * @returns Promise resolving to the repository tree via tarball
 */
export async function testTarballFallback(
  owner: string,
  repo: string,
  ref: string
): Promise<GithubTreeResponse> {
  // Clear any cached entry first
  const cacheKey = `${owner}/${repo}/${ref}`
  delete TREE_CACHE[cacheKey]
  logger.info(`Testing tarball fallback mechanism for ${owner}/${repo}@${ref}`)
  // Use a special caller name for test logs
  return getGithubTree(owner, repo, ref, 'tarball-test', {
    forceFresh: true,
    forceTarballFallback: true,
  })
}

/**
 * Clear the tree cache for a specific repository or all repositories
 * @param owner Optional repository owner
 * @param repo Optional repository name
 * @param ref Optional branch or commit reference
 */
export function clearTreeCache(
  owner?: string,
  repo?: string,
  ref?: string
): void {
  if (owner && repo && ref) {
    // Clear specific cache entry
    const cacheKey = `${owner}/${repo}/${ref}`
    delete TREE_CACHE[cacheKey]
    logger.info(`Cleared tree cache for ${cacheKey}`)
  } else if (owner && repo) {
    // Clear all cache entries for a specific repository
    const prefix = `${owner}/${repo}/`
    Object.keys(TREE_CACHE)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => delete TREE_CACHE[key])
    logger.info(`Cleared tree cache for all refs in ${owner}/${repo}`)
  } else if (owner) {
    // Clear all cache entries for a specific owner
    const prefix = `${owner}/`
    Object.keys(TREE_CACHE)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => delete TREE_CACHE[key])
    logger.info(`Cleared tree cache for all repositories owned by ${owner}`)
  } else {
    // Clear entire cache
    Object.keys(TREE_CACHE).forEach((key) => delete TREE_CACHE[key])
    logger.info('Cleared entire tree cache')
  }
}

/**
 * Fetch content directly from raw.githubusercontent.com
 * This domain has separate rate limits from api.github.com
 */
export async function fetchFromRawGithub(
  owner: string,
  repo: string,
  ref: string,
  path: string
): Promise<string> {
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
  logger.info(`Fetching from raw.githubusercontent.com: ${rawUrl}`)

  const response = await retry(() => fetch(rawUrl), {
    maxRetries: GITHUB_CONSTANTS.DEFAULT_RETRIES,
    timeout: GITHUB_CONSTANTS.REQUEST_TIMEOUT,
    maxRateLimitWait: GITHUB_CONSTANTS.MAX_RATE_LIMIT_WAIT,
    operationName: `raw-github:${path}`,
    shouldRetry: (error: unknown) => {
      if (error instanceof Error) {
        return (
          error.message.includes('ETIMEDOUT') ||
          error.message.includes('ECONNRESET') ||
          isRateLimitError(error as GitHubErrorResponse)
        )
      }
      return false
    },
  })

  if (!response.ok) {
    const msg = `Failed to fetch from raw.githubusercontent.com: ${response.status} ${response.statusText}`
    logger.error(msg)
    throw new Error(msg)
  }

  const content = await response.text()
  logger.info(`Successfully fetched ${path} (${content.length} bytes)`)
  return content
}
