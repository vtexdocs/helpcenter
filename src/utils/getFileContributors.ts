/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLogger } from './logging/log-util'
import octokit from './octokitConfig'
import retry from './retry-util'
import { getContributorsViaWebScraping, isRateLimitError } from './retry-util'
import type { GitHubErrorResponse } from './retry-util'

const logger = getLogger('getFileContributors')

export interface ContributorsType {
  name: string
  login: string
  avatar: string
  userPage: string
}

/**
 * Get contributors for a specific file in a repository
 * Automatically falls back to web scraping if API rate limits are hit
 */
export default async function getFileContributors(
  owner: string,
  repo: string,
  ref: string,
  path: string
): Promise<ContributorsType[]> {
  const contributors: ContributorsType[] = []

  try {
    logger.info(`Fetching contributors for ${path} in ${owner}/${repo}@${ref}`)

    // First attempt: use GitHub API with retries
    const response = await retry(
      () =>
        octokit.rest.repos.listCommits({
          owner,
          repo,
          sha: ref,
          path,
        }),
      {
        maxRetries: 3,
        operationName: `list-contributors:${path}`,
        shouldRetry: (error: unknown) => {
          const err = error as GitHubErrorResponse
          return isRateLimitError(err)
        },
      }
    )

    // Process contributors from API response
    response.data.forEach((commitData: any) => {
      if (
        commitData?.author &&
        !contributors.find((e) => e.login === commitData.author.login)
      ) {
        contributors.push({
          name: commitData.commit.author.name,
          login: commitData.author.login,
          avatar: commitData.author.avatar_url,
          userPage: commitData.author.html_url,
        })
      }
    })

    logger.info(
      `Successfully fetched ${contributors.length} contributors for ${path}`
    )
    return contributors
  } catch (error: any) {
    // Check if this is a rate limit error
    if (isRateLimitError(error)) {
      logger.warn(
        `GitHub API rate limit exceeded for contributors, falling back to web scraping`
      )

      try {
        // Second attempt: use web scraping fallback
        const scrapedContributors = await getContributorsViaWebScraping(
          owner,
          repo,
          ref,
          path
        )
        logger.info(
          `Successfully retrieved ${scrapedContributors.length} contributors via web scraping`
        )
        return scrapedContributors
      } catch (scrapingError) {
        logger.error(
          `Web scraping fallback failed: ${
            scrapingError instanceof Error
              ? scrapingError.message
              : 'Unknown error'
          }`
        )
        // Return empty array instead of failing completely
        return []
      }
    }

    // For other errors, log and return empty array to avoid breaking the UI
    logger.error(
      `Failed to get file contributors: ${error.message || 'Unknown error'}`
    )
    return []
  }
}
