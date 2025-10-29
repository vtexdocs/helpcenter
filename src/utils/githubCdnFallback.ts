/**
 * GitHub CDN Fallback System
 *
 * Provides automatic fallback to CDNs when GitHub rate limits are hit.
 * CDN providers have no rate limits and provide better global performance.
 *
 * Fallback chain:
 * 1. raw.githubusercontent.com (direct GitHub, 60 req/hr unauth)
 * 2. jsDelivr CDN (no rate limits, global CDN)
 * 3. Statically CDN (no rate limits, alternative CDN)
 *
 * URL Formats:
 * - GitHub Raw: https://raw.githubusercontent.com/{owner}/{repo}/{ref}/{path}
 * - jsDelivr: https://cdn.jsdelivr.net/gh/{owner}/{repo}@{ref}/{path}
 * - Statically: https://cdn.statically.io/gh/{owner}/{repo}/{ref}/{path}
 */

import { getLogger } from './logging/log-util'
import {
  isRateLimited,
  parseRateLimitHeaders,
  formatRateLimitInfo,
  calculateWaitTime,
  sleep,
  calculateBackoff,
} from './githubRateLimitHandler'

const logger = getLogger('githubCdnFallback')

export type CdnProvider = 'raw' | 'jsdelivr' | 'statically'

export interface FetchWithFallbackOptions {
  maxRetries?: number
  cdnFallbackEnabled?: boolean
  preferredCdn?: CdnProvider
  respectRetryAfter?: boolean
  waitForReset?: boolean // Wait for rate limit reset (only if < 60s)
  maxWaitTime?: number // Max time to wait for rate limit reset (ms)
}

const DEFAULT_OPTIONS: FetchWithFallbackOptions = {
  maxRetries: 3,
  cdnFallbackEnabled: true,
  preferredCdn: 'jsdelivr',
  respectRetryAfter: true,
  waitForReset: false,
  maxWaitTime: 60000, // 60 seconds
}

/**
 * Convert GitHub raw URL to jsDelivr CDN URL
 */
export function convertToJsDelivr(
  owner: string,
  repo: string,
  ref: string,
  path: string
): string {
  // jsDelivr uses @ref notation for branches/tags
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${path}`
}

/**
 * Convert GitHub raw URL to Statically CDN URL
 */
export function convertToStatically(
  owner: string,
  repo: string,
  ref: string,
  path: string
): string {
  return `https://cdn.statically.io/gh/${owner}/${repo}/${ref}/${path}`
}

/**
 * Get GitHub raw URL
 */
export function getGitHubRawUrl(
  owner: string,
  repo: string,
  ref: string,
  path: string
): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
}

/**
 * Get all CDN URLs in priority order
 */
export function getCdnUrls(
  owner: string,
  repo: string,
  ref: string,
  path: string,
  preferredCdn: CdnProvider = 'jsdelivr'
): string[] {
  const urls = {
    raw: getGitHubRawUrl(owner, repo, ref, path),
    jsdelivr: convertToJsDelivr(owner, repo, ref, path),
    statically: convertToStatically(owner, repo, ref, path),
  }

  // Prioritize preferred CDN, but keep GitHub raw first
  const cdnOrder: string[] = [
    urls.raw, // Always try GitHub raw first (fastest when not rate limited)
  ]

  // Add preferred CDN second
  if (preferredCdn === 'jsdelivr') {
    cdnOrder.push(urls.jsdelivr, urls.statically)
  } else if (preferredCdn === 'statically') {
    cdnOrder.push(urls.statically, urls.jsdelivr)
  } else {
    // If preferredCdn is 'raw', add others as fallbacks
    cdnOrder.push(urls.jsdelivr, urls.statically)
  }

  return cdnOrder
}

/**
 * Fetch GitHub file with automatic CDN fallback
 * This is the main function to use for fetching GitHub files
 */
export async function fetchGitHubFileWithFallback(
  owner: string,
  repo: string,
  ref: string,
  path: string,
  options?: FetchWithFallbackOptions
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const cdnUrls = opts.cdnFallbackEnabled
    ? getCdnUrls(owner, repo, ref, path, opts.preferredCdn)
    : [getGitHubRawUrl(owner, repo, ref, path)]

  let lastError: Error | null = null

  for (let i = 0; i < cdnUrls.length; i++) {
    const url = cdnUrls[i]
    const cdnType = url.includes('jsdelivr')
      ? 'jsDelivr'
      : url.includes('statically')
      ? 'Statically'
      : 'GitHub Raw'

    try {
      logger.info(`Fetching from ${cdnType}: ${owner}/${repo}@${ref}/${path}`)
      const response = await fetch(url)

      // Check for rate limiting (403 OR 429)
      if (response.status === 403 || response.status === 429) {
        if (isRateLimited(response)) {
          const rateLimitInfo = parseRateLimitHeaders(response.headers)
          const waitTime = calculateWaitTime(rateLimitInfo)

          logger.warn(
            `Rate limited on ${cdnType}: ${formatRateLimitInfo(rateLimitInfo)}`
          )

          // If this is not the last URL and we're rate limited, try next CDN
          if (i < cdnUrls.length - 1) {
            logger.info('Trying next CDN...')
            continue
          }

          // If it's the last URL and waitForReset is enabled
          const maxWait =
            opts.maxWaitTime ?? DEFAULT_OPTIONS.maxWaitTime ?? 60000
          if (opts.waitForReset && waitTime > 0 && waitTime <= maxWait) {
            logger.info(
              `Waiting ${Math.ceil(waitTime / 1000)}s for rate limit reset`
            )
            await sleep(waitTime)
            // Retry this URL after waiting
            const retryResponse = await fetch(url)
            if (retryResponse.ok) {
              const data = await retryResponse.text()
              logger.info(`Successfully fetched from ${cdnType} after waiting`)
              return data
            }
          }

          throw new Error(
            `Rate limit exceeded on ${cdnType}. ${formatRateLimitInfo(
              rateLimitInfo
            )}`
          )
        }
      }

      if (!response.ok) {
        logger.warn(
          `Failed to fetch from ${cdnType}: ${response.status} ${response.statusText}`
        )
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
        continue
      }

      const data = await response.text()
      logger.info(`Successfully fetched from ${cdnType}`)
      return data
    } catch (err) {
      const error = err as Error
      logger.error(`Error fetching from ${cdnType}: ${error.message}`)
      lastError = error
      continue
    }
  }

  // All CDNs failed
  throw lastError || new Error('Failed to fetch from all CDN sources')
}

/**
 * Fetch with retry and exponential backoff (for non-rate-limit errors)
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithFallbackOptions = DEFAULT_OPTIONS
): Promise<Response> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const maxRetries = opts.maxRetries ?? DEFAULT_OPTIONS.maxRetries ?? 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url)

      // Don't retry on rate limits - let caller handle CDN fallback
      if (response.status === 403 || response.status === 429) {
        if (isRateLimited(response)) {
          return response // Return to let caller handle rate limit
        }
      }

      // Don't retry on successful responses
      if (response.ok) {
        return response
      }

      // Don't retry on client errors (except 429/403 which we already checked)
      if (response.status >= 400 && response.status < 500) {
        return response
      }

      // Retry on server errors (5xx)
      if (attempt < maxRetries - 1) {
        const backoff = calculateBackoff(attempt)
        logger.warn(
          `Request failed with ${response.status}, retrying in ${Math.ceil(
            backoff / 1000
          )}s ` + `(attempt ${attempt + 1}/${maxRetries})`
        )
        await sleep(backoff)
        attempt++
        continue
      }

      return response
    } catch (err) {
      const error = err as Error
      if (attempt < maxRetries - 1) {
        const backoff = calculateBackoff(attempt)
        logger.warn(
          `Request error: ${error.message}, retrying in ${Math.ceil(
            backoff / 1000
          )}s ` + `(attempt ${attempt + 1}/${maxRetries})`
        )
        await sleep(backoff)
        attempt++
        continue
      }
      throw err
    }
  }

  throw new Error('Max retries exceeded')
}
