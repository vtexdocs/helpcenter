import { getLogger } from 'utils/logging/log-util'
import { sleep } from 'utils/retry-util'
import getGithubFile from 'utils/getGithubFile'
import { localeType } from './navigation-utils'
import retry from './retry-util'
import { GITHUB_CONSTANTS } from './github-constants'

const logger = getLogger('github-batch-fetch')

// Keep track of warning counts to prevent log flooding
let missingPathWarningsShown = 0
const MAX_MISSING_PATH_WARNINGS = 5

/**
 * Custom type to represent the result of a single fetch operation
 */
export interface FetchResult {
  content: string
  slug: string
  error?: string
}

/**
 * Information about a file path to fetch
 */
interface PathInfo {
  path: string
  locale: localeType
}

/**
 * Generic type for the processed result
 */
export type ProcessedResult<T> = T | null

/**
 * Fetches content from GitHub using raw URL with retries and error handling
 * Provides consistent error handling across all pages
 */
export async function fetchFromGithubRaw(
  path: string,
  slug: string,
  branch = 'main'
): Promise<FetchResult> {
  const url = `https://raw.githubusercontent.com/vtexdocs/help-center-content/${branch}/${path}`

  try {
    // Use the central retry mechanism instead of custom implementation
    const response = await retry(
      () => fetch(url, { headers: GITHUB_CONSTANTS.RAW_GITHUB_HEADERS }),
      {
        maxRetries: GITHUB_CONSTANTS.DEFAULT_RETRIES,
        initialDelay: GITHUB_CONSTANTS.INITIAL_DELAY,
        operationName: `raw-fetch:${path}`,
        shouldRetry: (error) => {
          // Retry network errors but not 404s
          if (error instanceof Error) {
            return (
              error.message.includes('ETIMEDOUT') ||
              error.message.includes('ECONNRESET') ||
              error.message.includes('NetworkError')
            )
          }
          return false
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        logger.warn(`File not found at ${url} (404)`)
        return { content: '', slug, error: 'File not found (404)' }
      }
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
    }

    const data = await response.text()
    if (!data || data.includes('<html') || data.trim().length === 0) {
      throw new Error('Invalid or empty content received')
    }

    return { content: data, slug }
  } catch (error) {
    logger.error(
      `Failed to fetch ${path}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    return {
      content: '',
      slug,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Fetches content safely from GitHub, either using getGithubFile utility
 * or falling back to direct raw GitHub URL fetch
 */
export async function fetchContentSafely(
  path: string,
  slug: string,
  branch = 'main'
): Promise<FetchResult> {
  try {
    // Try using the enhanced getGithubFile utility first
    const content = await getGithubFile(
      'vtexdocs',
      'help-center-content',
      branch,
      path,
      true // Allow empty content as fallback
    )
    return { content, slug }
  } catch (error) {
    // If getGithubFile fails, try direct fetch as fallback
    logger.info(
      `getGithubFile failed for ${path}, trying direct fetch as fallback`
    )
    return fetchFromGithubRaw(path, slug, branch)
  }
}

/**
 * Processes batches of content fetching in parallel with improved error handling
 */
export async function fetchContentBatch<
  T extends Record<string, PathInfo[]>,
  R
>(
  docsPaths: T,
  slugs: string[],
  currentLocale: localeType,
  branch = 'main',
  batchSize = 50,
  processor: (result: FetchResult) => Promise<ProcessedResult<R>>
): Promise<R[]> {
  const results: R[] = []
  missingPathWarningsShown = 0 // Reset warning counter for each batch process

  // Split into smaller batches to avoid overwhelming the network
  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize)
    logger.info(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        slugs.length / batchSize
      )}: ${batch.length} items`
    )

    const batchPromises = batch.map(async (slug) => {
      const pathInfo = docsPaths[slug]?.find((e) => e.locale === currentLocale)
      if (!pathInfo?.path) {
        // Use info level instead of warn to reduce console noise
        // Only show a limited number of these warnings
        if (missingPathWarningsShown < MAX_MISSING_PATH_WARNINGS) {
          logger.info(
            `No path found for slug: ${slug} with locale: ${currentLocale}`
          )
          missingPathWarningsShown++
        } else if (missingPathWarningsShown === MAX_MISSING_PATH_WARNINGS) {
          logger.info(
            `Suppressing further missing path warnings (${
              slugs.length - missingPathWarningsShown
            } more may be missing)`
          )
          missingPathWarningsShown++
        }
        return null
      }

      try {
        const fetchResult = await fetchContentSafely(
          pathInfo.path,
          slug,
          branch
        )

        if (fetchResult.error) {
          logger.error(`Error fetching ${pathInfo.path}: ${fetchResult.error}`)
          return null
        }

        if (!fetchResult.content) {
          logger.info(`Empty content received for ${pathInfo.path}`)
          return null
        }

        return processor(fetchResult)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logger.error(`Failed to process ${pathInfo.path}: ${errorMessage}`)
        return null
      }
    })

    const batchResults = await Promise.all(batchPromises)
    // Filter out null results
    const validResults = batchResults.filter(
      (item): item is NonNullable<typeof item> => item !== null
    ) as R[]

    results.push(...validResults)

    // Add a small delay between batches to avoid overwhelming GitHub
    if (i + batchSize < slugs.length) {
      await sleep(500)
    }
  }

  logger.info(
    `Completed fetching ${results.length} valid items out of ${slugs.length} requested`
  )
  return results
}
