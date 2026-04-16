/**
 * GitHub Rate Limit Handler
 *
 * Per GitHub docs: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
 * - Rate limits return 403 OR 429 status codes (not just 429!)
 * - Primary rate limit: 60 req/hr (unauth), 5,000 req/hr (auth)
 * - Secondary rate limit: Abuse detection, concurrent requests
 *
 * Response headers:
 * - x-ratelimit-limit: Max requests per hour
 * - x-ratelimit-remaining: Requests left (0 = rate limited)
 * - x-ratelimit-used: Requests consumed
 * - x-ratelimit-reset: Window reset time (UTC epoch seconds)
 * - x-ratelimit-resource: Which limit bucket hit
 * - retry-after: Seconds to wait (secondary limits)
 */

export interface RateLimitInfo {
  limit: number
  remaining: number
  used: number
  reset: number // UTC epoch seconds
  resource: string
  retryAfter: number // seconds
}

export class GitHubRateLimitError extends Error {
  constructor(
    message: string,
    public statusCode: 403 | 429,
    public retryAfter?: number,
    public ratelimitRemaining?: number,
    public ratelimitReset?: number,
    public isPrimaryLimit?: boolean
  ) {
    super(message)
    this.name = 'GitHubRateLimitError'
  }
}

/**
 * Parse GitHub rate limit headers from response
 */
export function parseRateLimitHeaders(headers: Headers): RateLimitInfo {
  return {
    limit: parseInt(headers.get('x-ratelimit-limit') || '0', 10),
    remaining: parseInt(headers.get('x-ratelimit-remaining') || '0', 10),
    used: parseInt(headers.get('x-ratelimit-used') || '0', 10),
    reset: parseInt(headers.get('x-ratelimit-reset') || '0', 10), // UTC epoch seconds
    resource: headers.get('x-ratelimit-resource') || '',
    retryAfter: parseInt(headers.get('retry-after') || '0', 10), // seconds
  }
}

/**
 * Check if a response indicates rate limiting
 * GitHub returns 403 OR 429 for rate limits
 */
export function isRateLimited(response: Response): boolean {
  // Check status codes (403 or 429)
  if (response.status === 403 || response.status === 429) {
    const rateLimitInfo = parseRateLimitHeaders(response.headers)

    // If remaining is "0", it's definitely a rate limit
    if (rateLimitInfo.remaining === 0) return true

    // If retry-after header present, it's a secondary rate limit
    if (rateLimitInfo.retryAfter > 0) return true

    // If x-ratelimit-resource header present, likely rate limit
    if (rateLimitInfo.resource) return true
  }

  return false
}

/**
 * Check if an error object indicates rate limiting
 * Handles both fetch Response errors and Octokit errors
 */
export function isRateLimitError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false

  const error = err as {
    status?: number
    response?: { headers?: Record<string, string | number> }
    message?: string
  }

  // Check status codes (403 or 429)
  if (error.status === 403 || error.status === 429) {
    // Check headers first (most reliable)
    if (error.response?.headers) {
      const remaining = error.response.headers['x-ratelimit-remaining']
      const retryAfter = error.response.headers['retry-after']
      if (remaining === '0' || remaining === 0 || retryAfter) return true
    }

    // Fallback to message inspection
    const msg = (error.message || '').toLowerCase()
    if (
      msg.includes('rate limit') ||
      msg.includes('api rate limit exceeded') ||
      msg.includes('secondary rate limit')
    ) {
      return true
    }
  }

  return false
}

/**
 * Calculate wait time based on rate limit info
 * Returns milliseconds to wait
 */
export function calculateWaitTime(rateLimitInfo: RateLimitInfo): number {
  // If retry-after is set (secondary limit), use that
  if (rateLimitInfo.retryAfter > 0) {
    return rateLimitInfo.retryAfter * 1000 // Convert to milliseconds
  }

  // If reset time is set (primary limit), calculate wait time
  if (rateLimitInfo.reset > 0) {
    const resetDate = new Date(rateLimitInfo.reset * 1000)
    const waitTime = Math.max(0, resetDate.getTime() - Date.now())
    return waitTime
  }

  // Default: 60 seconds
  return 60000
}

/**
 * Format rate limit info for logging
 */
export function formatRateLimitInfo(rateLimitInfo: RateLimitInfo): string {
  const resetDate = new Date(rateLimitInfo.reset * 1000)
  const isPrimary = rateLimitInfo.remaining === 0
  const isSecondary = rateLimitInfo.retryAfter > 0

  return (
    `${
      isPrimary ? 'Primary' : isSecondary ? 'Secondary' : 'Unknown'
    } rate limit ` +
    `(remaining: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}, ` +
    `resource: ${rateLimitInfo.resource || 'unknown'}, ` +
    `reset: ${resetDate.toISOString()}` +
    (rateLimitInfo.retryAfter > 0
      ? `, retry-after: ${rateLimitInfo.retryAfter}s`
      : '') +
    ')'
  )
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Exponential backoff with jitter
 */
export function calculateBackoff(
  attempt: number,
  baseDelay = 1000,
  maxDelay = 60000
): number {
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
  const jitter = Math.random() * 0.3 * exponentialDelay // 30% jitter
  return exponentialDelay + jitter
}
