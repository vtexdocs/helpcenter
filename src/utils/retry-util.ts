import { getLogger } from './logging/log-util'

const logger = getLogger('retry-util')

// Constants for retry behavior
const MAX_RATE_LIMIT_WAIT = 60000 // Maximum time to wait for rate limit reset (1 minute)

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial delay in milliseconds before first retry (default: 1000) */
  initialDelay?: number
  /** Maximum delay between retries in milliseconds (default: 30000) */
  maxDelay?: number
  /** Factor by which to increase delay after each retry (default: 2) */
  backoffFactor?: number
  /** Maximum total time to spend on retries in milliseconds (default: 5 minutes) */
  timeout?: number
  /** Maximum time to wait for rate limit reset in milliseconds (default: 60000) */
  maxRateLimitWait?: number
  /** Additional delay to add to rate limit reset time in milliseconds (default: 1000) */
  rateLimitBuffer?: number
  /** Callback executed before each retry attempt */
  onRetry?: (error: unknown, attempt: number, delay: number) => void
  /** Whether to handle GitHub rate limit errors specially (default: false) */
  handleRateLimit?: boolean
  /** Function to determine if a particular error should trigger a retry */
  shouldRetry?: (error: unknown) => boolean
  /** Operation name for logging (default: 'operation') */
  operationName?: string
}

/**
 * GitHub API error response format
 */
export interface GitHubErrorResponse {
  status?: number
  response?: {
    headers?: {
      'x-ratelimit-remaining'?: string
      'x-ratelimit-reset'?: string
      'retry-after'?: string
    }
    data?: {
      message?: string
    }
  }
  message?: string
  name?: string
}

/**
 * Sleep utility for async/await delays
 * @param ms Time to sleep in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Determine if an error is a GitHub API rate limit error
 * @param error Error to check
 * @returns True if the error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  const err = error as GitHubErrorResponse
  if (!err) return false

  const isRateLimitName = err.name === 'RateLimitError'
  const isRateLimitStatus = err.status === 403
  const hasZeroRemaining =
    err.response?.headers?.['x-ratelimit-remaining'] === '0'
  const hasRateLimitMessage =
    err.response?.data?.message?.includes('API rate limit exceeded') ?? false
  const hasTimeoutMessage = err.message?.includes('timeout') ?? false

  // Consider timeouts as rate limit errors to trigger rate limit handling
  return (
    isRateLimitName ||
    hasTimeoutMessage ||
    (isRateLimitStatus && (hasZeroRemaining || hasRateLimitMessage))
  )
}

/**
 * Determine if an error is a GitHub API abuse detection error (secondary rate limit)
 * @param error Error to check
 * @returns True if the error is an abuse detection error
 */
export function isAbuseDetectionError(error: unknown): boolean {
  const err = error as GitHubErrorResponse
  if (!err) return false

  const isSecondaryRateLimit = err.status === 403
  const hasAbuseMessage =
    err.response?.data?.message?.includes(
      'You have triggered an abuse detection mechanism'
    ) ?? false
  const hasSecondaryLimitMessage =
    err.response?.data?.message?.includes('secondary rate limit') ?? false

  return isSecondaryRateLimit && (hasAbuseMessage || hasSecondaryLimitMessage)
}

// Note: Removing the unused calculateRateLimitWait function

/**
 * Calculate retry delay time based on GitHub rate limit headers
 * @param error GitHub error response
 * @param options Retry options
 * @returns Delay time in milliseconds, or -1 if the delay would be too long
 */
export function getRateLimitDelay(
  error: unknown,
  options: RetryOptions = {}
): number {
  const err = error as GitHubErrorResponse
  const maxWait = options.maxRateLimitWait ?? 15000
  const buffer = options.rateLimitBuffer ?? 1000

  // For timeout errors, use minimal delay
  if (err.message?.includes('timeout')) {
    return options.initialDelay ?? 1000
  }

  // Get reset time from headers
  const resetTime = err?.response?.headers?.['x-ratelimit-reset']
  const retryAfter = err?.response?.headers?.['retry-after']

  if (resetTime) {
    const resetDate = new Date(Number(resetTime) * 1000)
    const now = new Date()
    const delayMs = resetDate.getTime() - now.getTime() + buffer

    // If delay is longer than maxWait, signal that we should use fallback
    if (delayMs > maxWait) {
      return -1
    }
    return delayMs > 0 ? delayMs : options.initialDelay ?? 1000
  }

  // If retry-after header is present, use it
  if (retryAfter) {
    const retryMs = parseInt(retryAfter, 10) * 1000 + buffer
    return retryMs > maxWait ? -1 : retryMs
  }

  // Default delay for rate limit errors
  return options.initialDelay ?? 5000
}

/**
 * Calculate exponential backoff delay with jitter
 * @param attempt Current retry attempt (0-based)
 * @param options Retry options
 * @returns Delay time in milliseconds
 */
export function calculateBackoffDelay(
  attempt: number,
  options: RetryOptions = {}
): number {
  const initialDelay = options.initialDelay ?? 1000
  const backoffFactor = options.backoffFactor ?? 2
  const maxDelay = options.maxDelay ?? 30000

  // Calculate exponential backoff: initialDelay * (backoffFactor ^ attempt)
  const exponentialDelay = initialDelay * Math.pow(backoffFactor, attempt)

  // Add jitter (±10%) to avoid thundering herd problem
  const jitter = exponentialDelay * 0.1 * (Math.random() * 2 - 1)

  // Apply max delay limit
  return Math.min(exponentialDelay + jitter, maxDelay)
}

/**
 * Alternative fallback for GitHub tree using Git web page scraping
 */
export async function getGitHubTreeViaWebScraping(
  owner: string,
  repo: string,
  branch?: string
): Promise<{ tree: { path: string; type: string }[] }> {
  const localLogger = getLogger('github-scraping')
  localLogger.info(
    `Fetching GitHub tree via web scraping for ${owner}/${repo}@${
      branch || 'main'
    }`
  )

  // First attempt: use GitHub's find page which gives us all files at once
  try {
    const findUrl = `https://github.com/${owner}/${repo}/find/${
      branch || 'main'
    }`
    localLogger.info(`Attempting to fetch find page from: ${findUrl}`)

    const response = await retryWithRateLimit(async () => {
      const res = await fetch(findUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      return res
    })

    const html = await response.text()

    // Try both modern and classic GitHub HTML formats
    const jsonMatch = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s
    )
    if (jsonMatch && jsonMatch[1]) {
      try {
        const data = JSON.parse(jsonMatch[1])
        const files =
          data?.props?.pageProps?.files ||
          data?.props?.pageProps?.payload?.tree?.items
        if (Array.isArray(files) && files.length > 0) {
          const tree = files.map((item) => ({
            path: item.path || item.name,
            type:
              item.type === 'tree' || item.type === 'directory'
                ? 'tree'
                : 'blob',
          }))
          localLogger.info(
            `Found ${tree.length} files via modern GitHub format`
          )
          return { tree }
        }
      } catch (parseError) {
        localLogger.warn(`Failed to parse modern GitHub format: ${parseError}`)
      }
    }

    const treeMatch = html.match(/data-tree="([^"]+)"/i)
    if (treeMatch && treeMatch[1]) {
      try {
        const decodedData = decodeURIComponent(
          treeMatch[1].replace(/\\"/g, '"')
        )
        const treeData = JSON.parse(decodedData)
        if (Array.isArray(treeData) && treeData.length > 0) {
          const tree = treeData.map((item) => ({
            path: item.path,
            type: item.contentType === 'directory' ? 'tree' : 'blob',
          }))
          localLogger.info(
            `Found ${tree.length} files via classic GitHub format`
          )
          return { tree }
        }
      } catch (parseError) {
        localLogger.warn(`Failed to parse classic GitHub format: ${parseError}`)
      }
    }

    localLogger.warn(
      'Could not extract tree data from find page, falling back to directory listing'
    )
  } catch (error) {
    localLogger.warn(
      `Find page approach failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }

  // Second attempt: recursively list directory contents
  return await getGitHubTreeViaDirectoryListing(owner, repo, branch)
}

/**
 * Fallback for GitHub tree by recursively listing directory contents
 */
async function getGitHubTreeViaDirectoryListing(
  owner: string,
  repo: string,
  branch?: string,
  path = ''
): Promise<{ tree: { path: string; type: string }[] }> {
  const localLogger = getLogger('github-scraping')
  const baseUrl = path
    ? `https://github.com/${owner}/${repo}/tree/${branch || 'main'}/${path}`
    : `https://github.com/${owner}/${repo}/tree/${branch || 'main'}`

  localLogger.info(`Listing directory: ${baseUrl}`)

  const response = await retryWithRateLimit(async () => {
    const res = await fetch(baseUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return res
  })

  const html = await response.text()
  const tree: { path: string; type: string }[] = []

  // Try different selectors for file entries
  const fileRegexes = [
    /aria-labelledby="(?:file|dir)-([^"]+)"/g,
    /svg\s+aria-label="(?:Directory|File)"[\s\S]*?href="\/[^\/]+\/[^\/]+\/(?:blob|tree)\/[^\/]+\/([^"]+)"/g,
    /class="js-navigation-open[^"]*"[^>]*href="\/[^\/]+\/[^\/]+\/(?:blob|tree)\/[^\/]+\/([^"]+)"/g,
  ]

  let entries: string[] = []
  for (const regex of fileRegexes) {
    entries = Array.from(html.matchAll(regex), (m) => m[1])
    if (entries.length > 0) break
  }

  if (entries.length === 0) {
    throw new Error(`No files found in ${baseUrl}`)
  }

  const dirPromises: Promise<{ tree: { path: string; type: string }[] }>[] = []

  for (const entry of entries) {
    const fileName = decodeURIComponent(
      entry.replace(/-{2,}/g, '/').replace(/&amp;/g, '&')
    )
    const fullPath = path ? `${path}/${fileName}` : fileName

    const isDirectory = html.includes(
      `/${owner}/${repo}/tree/${branch || 'main'}/${fullPath}"`
    )

    tree.push({
      path: fullPath,
      type: isDirectory ? 'tree' : 'blob',
    })

    if (isDirectory) {
      dirPromises.push(
        getGitHubTreeViaDirectoryListing(owner, repo, branch, fullPath)
      )
    }
  }

  const results = await Promise.all(dirPromises)
  const allResults = results.reduce(
    (acc, result) => [...acc, ...result.tree],
    tree
  )

  localLogger.info(
    `Found ${tree.length} items in ${path || 'root'} (${
      allResults.length
    } total)`
  )

  return { tree: allResults }
}

/**
 * Alternative fallback to get file contributors by scraping the GitHub website
 * This approach is not affected by API rate limits
 */
export async function getContributorsViaWebScraping(
  owner: string,
  repo: string,
  branch = 'main',
  path: string
): Promise<
  { name: string; login: string; avatar: string; userPage: string }[]
> {
  const localLogger = getLogger('github-scraping')
  localLogger.info(
    `Fetching contributors via web scraping for ${path} in ${owner}/${repo}`
  )

  try {
    // Get contributors from the GitHub blame page, which shows contributors for a specific file
    const blameUrl = `https://github.com/${owner}/${repo}/blame/${branch}/${path}`
    const response = await retry(() => fetch(blameUrl), {
      maxRetries: 3,
      operationName: `contributors-scraping:${path}`,
    })

    const html = await response.text()
    const contributors: {
      name: string
      login: string
      avatar: string
      userPage: string
    }[] = []

    // Extract contributors from blame page
    // This looks for user information in the blame interface
    const userRegex =
      /href="\/([^"]+)" data-hovercard-type="user"[^>]*>([^<]+)<[\s\S]*?<img[^>]+src="([^"]+)"/g
    const matches = html.matchAll(userRegex)

    const seenLogins = new Set<string>()

    for (const match of matches) {
      const login = match[1]

      // Only add each contributor once
      if (seenLogins.has(login)) continue
      seenLogins.add(login)

      contributors.push({
        login,
        name: match[2].trim(),
        avatar: match[3],
        userPage: `https://github.com/${login}`,
      })
    }

    // If the blame page approach failed, try the contributors page for the repository
    if (contributors.length === 0) {
      localLogger.info(
        `Blame page approach failed, falling back to repository contributors`
      )
      return await getRepositoryContributors(owner, repo)
    }

    localLogger.info(
      `Successfully scraped ${contributors.length} contributors for ${path}`
    )
    return contributors
  } catch (error) {
    localLogger.error(
      `Failed to scrape contributors: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    // Return empty array instead of failing
    return []
  }
}

/**
 * Get all contributors of a repository
 * This is used as a last resort when file-specific contributors can't be retrieved
 */
async function getRepositoryContributors(
  owner: string,
  repo: string
): Promise<
  { name: string; login: string; avatar: string; userPage: string }[]
> {
  const localLogger = getLogger('github-scraping')
  const contributorsUrl = `https://github.com/${owner}/${repo}/graphs/contributors`
  const response = await retry(() => fetch(contributorsUrl), {
    maxRetries: 3,
  })

  const html = await response.text()
  const contributors: {
    name: string
    login: string
    avatar: string
    userPage: string
  }[] = []

  // Extract contributors from the contributors page
  const contributorRegex =
    /href="\/([^"]+)" data-hovercard-type="user"[^>]*>([^<]+)<[\s\S]*?<img[^>]+src="([^"]+)"/g
  const matches = html.matchAll(contributorRegex)
  const seenLogins = new Set<string>()

  for (const match of matches) {
    const login = match[1]
    if (seenLogins.has(login)) continue
    seenLogins.add(login)

    contributors.push({
      login,
      name: match[2].trim(),
      avatar: match[3],
      userPage: `https://github.com/${login}`,
    })
  }

  localLogger.info(`Found ${contributors.length} repository contributors`)
  return contributors
}

/**
 * Specialized retry function for GitHub API requests that handles rate limiting
 * @param operation GitHub API operation to retry
 * @param options Retry configuration options
 * @returns Promise with operation result
 */
export async function retryWithRateLimit<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return retry(operation, {
    maxRetries: 8,
    initialDelay: 1000,
    maxDelay: 30000,
    timeout: 120000, // 2 minutes for GitHub operations
    handleRateLimit: true,
    maxRateLimitWait: 15000,
    onRetry: (error, attempt, delay) => {
      if (isRateLimitError(error)) {
        logger.info(
          `GitHub rate limit hit, waiting ${Math.round(
            delay / 1000
          )}s before retry ${attempt + 1}/${options.maxRetries ?? 8}`
        )
      } else if (isAbuseDetectionError(error)) {
        logger.info(
          `GitHub secondary rate limit hit, waiting ${Math.round(
            delay / 1000
          )}s before retry ${attempt + 1}/${options.maxRetries ?? 8}`
        )
      } else {
        logger.info(
          `Retrying GitHub API call (${attempt + 1}/${
            options.maxRetries ?? 8
          }) after ${Math.round(delay / 1000)}s delay`
        )
      }
    },
    ...options,
  })
}

/**
 * Retry function with timeout protection for GitHub operations
 * @param operation Operation to retry
 * @param requestTimeout Timeout for individual requests in milliseconds
 * @param options Additional retry options
 * @returns Promise with operation result
 */
export async function retryWithTimeout<T>(
  operation: () => Promise<T>,
  requestTimeout = 5000,
  options: RetryOptions = {}
): Promise<T> {
  const timeoutOperation = async () => {
    // Skip timeout for certain operations during build
    if (
      options.handleRateLimit &&
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      return await operation()
    }

    // For other operations, use timeout protection
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), requestTimeout)
    })

    return (await Promise.race([operation(), timeoutPromise])) as T
  }

  return retry(timeoutOperation, {
    maxRetries: 3,
    ...options,
  })
}

/**
 * Creates a fetch function with automatic retries
 * @param options Retry options for fetch
 * @returns Fetch function with retry capability
 */
export function createRetryingFetch(options: RetryOptions = {}): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof URL ? input.toString() : input.toString()
    return retry<Response>(() => fetch(input, init), {
      maxRetries: 3,
      operationName: `fetch:${url.split('?')[0]}`, // Log URL without query params
      shouldRetry: (error) => {
        // Don't retry 4xx errors (except rate limits)
        const err = error as { status?: number; message?: string }
        if (err.status && err.status >= 400 && err.status < 500) {
          return Boolean(
            err.status === 403 &&
              (err.message?.includes('rate limit') ||
                err.message?.includes('abuse detection'))
          )
        }
        return true
      },
      ...options,
    })
  }
}

/**
 * Generic retry function with exponential backoff
 * @param operation Operation to retry
 * @param options Retry configuration options
 * @returns Promise with operation result
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    timeout = 60000, // 1 minute total timeout
    maxRateLimitWait = MAX_RATE_LIMIT_WAIT,
    handleRateLimit = false,
    shouldRetry = () => true,
    onRetry,
    operationName = 'operation',
  } = options

  const startTime = Date.now()
  let lastError: unknown = new Error('Operation failed')

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const timeElapsed = Date.now() - startTime
      if (timeElapsed >= timeout) {
        throw new Error(`Operation timed out after ${timeElapsed}ms`)
      }

      const result = await operation()

      // Log success only on retries
      if (attempt > 0) {
        logger.info(
          `[${operationName}] Succeeded after ${
            attempt + 1
          } attempts (${timeElapsed}ms)`
        )
      }

      return result as T
    } catch (error: unknown) {
      lastError = error

      // Check if this is a rate limit error
      if (handleRateLimit && isRateLimitError(error as GitHubErrorResponse)) {
        const waitTime = getRateLimitDelay(error, { maxRateLimitWait })
        const remainingTime = timeout - (Date.now() - startTime)

        // If wait time is too long or would exceed total timeout, stop retrying
        if (
          waitTime <= 0 ||
          waitTime > maxRateLimitWait ||
          waitTime > remainingTime
        ) {
          logger.warn(
            `[${operationName}] Rate limit reset time (${Math.round(
              waitTime / 1000
            )}s) ` +
              `exceeds maximum wait time (${Math.round(
                maxRateLimitWait / 1000
              )}s), aborting`
          )
          throw error
        }

        // Wait for the rate limit to reset
        logger.info(
          `[${operationName}] Rate limit hit, waiting ${Math.round(
            waitTime / 1000
          )}s ` + `before retry ${attempt + 1}/${maxRetries}`
        )

        if (onRetry) {
          onRetry(error, attempt, waitTime)
        }

        await sleep(waitTime)
        continue
      }

      // For other errors, check if we should retry
      if (attempt === maxRetries - 1 || !shouldRetry(error)) {
        logger.error(
          `[${operationName}] Failed after ${attempt + 1} attempts: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        )
        throw error
      }

      // Calculate backoff delay
      const delay = calculateBackoffDelay(attempt, options)
      const remainingTime = timeout - (Date.now() - startTime)

      if (remainingTime <= delay) {
        logger.warn(
          `[${operationName}] Would exceed timeout, stopping after ${
            attempt + 1
          } attempts`
        )
        throw error
      }

      logger.info(
        `[${operationName}] Attempt ${
          attempt + 1
        }/${maxRetries} failed, retrying in ${delay}ms`
      )

      if (onRetry) {
        onRetry(error, attempt, delay)
      }

      await sleep(delay)
    }
  }

  throw lastError
}

// Export default for compatibility
export default retry
