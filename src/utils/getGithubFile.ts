import octokit from 'utils/octokitConfig'
import { getLogger } from 'utils/logging/log-util'
import type { Endpoints } from '@octokit/types'
import { isRateLimitError } from './githubRateLimitHandler'
import { fetchGitHubFileWithFallback } from './githubCdnFallback'

const logger = getLogger('getGithubFile')

type GetContentResponse =
  Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']

export default async function getGithubFile(
  owner: string,
  repo: string,
  ref: string,
  path: string
): Promise<string> {
  // Use CDN fallback system if in static build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    try {
      return await fetchGitHubFileWithFallback(owner, repo, ref, path, {
        cdnFallbackEnabled: true,
        preferredCdn: 'jsdelivr',
        logger,
      })
    } catch (err) {
      const error = err as Error
      logger.error(
        `Error fetching from CDN fallback system, falling back to Octokit: ${error.message}`
      )
      // Fallback to Octokit API
      try {
        const response: GetContentResponse =
          await octokit.rest.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
            ref: ref,
            request: {
              headers: {
                'x-githubfile': 'true',
                Accept: 'application/vnd.github.v3.raw',
              },
            },
          })
        if (typeof response.data === 'string') {
          return response.data
        } else {
          logger.error(
            `Octokit repos.getContent did not return string data with Accept: application/vnd.github.v3.raw. Actual type: ${typeof response.data}, value: ${JSON.stringify(
              response.data
            ).slice(0, 500)}`
          )
          throw new Error(
            'Octokit repos.getContent did not return string data with Accept: application/vnd.github.v3.raw'
          )
        }
      } catch (octokitErr) {
        const octokitError = octokitErr as Error
        logger.error(`Octokit fallback also failed: ${octokitError.message}`)
        throw octokitErr
      }
    }
  }
  // Default: use Octokit API, with custom header for throttling plugin
  try {
    const response: GetContentResponse = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: ref,
      request: {
        headers: {
          'x-githubfile': 'true',
          Accept: 'application/vnd.github.v3.raw',
        },
      },
    })
    if (typeof response.data === 'string') {
      return response.data
    } else {
      logger.error(
        `Octokit repos.getContent did not return string data with Accept: application/vnd.github.v3.raw. Actual type: ${typeof response.data}, value: ${JSON.stringify(
          response.data
        ).slice(0, 500)}`
      )
      throw new Error(
        'Octokit repos.getContent did not return string data with Accept: application/vnd.github.v3.raw'
      )
    }
  } catch (err) {
    const error = err as Error
    logger.error(`Octokit fetch failed: ${error.message}`)
    // If rate limit, fallback to CDN fallback system (raw -> jsDelivr -> Statically)
    if (isRateLimitError(err)) {
      logger.warn(`Octokit rate limited, falling back to CDN fallback system`)
      return await fetchGitHubFileWithFallback(owner, repo, ref, path, {
        cdnFallbackEnabled: true,
        preferredCdn: 'jsdelivr',
        logger,
      })
    }
    throw err
  }
}
