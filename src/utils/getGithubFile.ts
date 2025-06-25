import octokit from 'utils/octokitConfig'
import { getLogger } from 'utils/logging/log-util'
import type { Endpoints } from '@octokit/types'

const logger = getLogger('getGithubFile')

type GetContentResponse =
  Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']

function isRateLimitError(err: any): boolean {
  if (!err) return false
  if (err.status === 403) {
    const msg = (err.message || '').toLowerCase()
    if (
      msg.includes('rate limit') ||
      msg.includes('api rate limit exceeded') ||
      msg.includes('secondary rate limit')
    ) {
      return true
    }
    // Check for GitHub API error structure
    if (err.response && err.response.headers) {
      const remaining = err.response.headers['x-ratelimit-remaining']
      if (remaining === '0') return true
    }
  }
  return false
}

export default async function getGithubFile(
  owner: string,
  repo: string,
  ref: string,
  path: string
): Promise<string> {
  // Use raw.githubusercontent.com if in static build phase, fallback to Octokit if it fails
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        logger.warn(
          `Failed to fetch file from raw.githubusercontent.com: ${response.status} ${response.statusText} (${url})`
        )
        throw new Error(
          `Failed to fetch file from raw.githubusercontent.com: ${response.status} ${response.statusText}`
        )
      }
      return await response.text()
    } catch (err: any) {
      logger.error(
        `Error fetching from raw.githubusercontent.com, falling back to Octokit: ${err.message}`
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
      } catch (octokitErr: any) {
        logger.error(`Octokit fallback also failed: ${octokitErr.message}`)
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
  } catch (err: any) {
    logger.error(`Octokit fetch failed: ${err.message}`)
    // If rate limit, fallback to raw.githubusercontent
    if (isRateLimitError(err)) {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
      logger.warn(
        `Octokit rate limited, falling back to raw.githubusercontent.com: ${url}`
      )
      const response = await fetch(url)
      if (!response.ok) {
        logger.error(
          `Fallback to raw.githubusercontent.com also failed: ${response.status} ${response.statusText}`
        )
        throw new Error(
          `Failed to fetch file from both Octokit and raw.githubusercontent.com: ${response.status} ${response.statusText}`
        )
      }
      return await response.text()
    }
    throw err
  }
}
