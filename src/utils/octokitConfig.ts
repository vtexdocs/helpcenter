/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { Octokit } from 'octokit'
import { createAppAuth } from '@octokit/auth-app'
import { throttling } from '@octokit/plugin-throttling'
import { config } from 'utils/config'

// Extend Octokit with the throttling plugin correctly
const MyOctokit = Octokit.plugin(throttling as any)

const octokitConfig = {
  authStrategy: createAppAuth,
  auth: {
    appId: config.GITHUB_APPID,
    privateKey: config.GITHUB_PRIVATEKEY,
    installationId: config.GITHUB_INSTALLATIONID,
  },
  throttle: {
    enabled: true, // Enable throttling and automatic retries
    // NOTE: GitHub returns 403 OR 429 for rate limits
    // The throttling plugin handles both automatically
    onRateLimit: (retryAfter: any, options: any, octokit: any) => {
      // Custom: If this is a getGithubFile request, do not wait more than 10 seconds
      // Instead, fail fast and let the CDN fallback system handle it
      if (
        options.request &&
        options.request.headers &&
        options.request.headers['x-githubfile']
      ) {
        if (retryAfter > 10) {
          octokit.log.warn(
            `getGithubFile request: Not retrying because retryAfter (${retryAfter}) > 10s for ${options.method} ${options.url}. Will use CDN fallback.`
          )
          return false // Do not retry - let CDN fallback handle it
        }
      }
      octokit.log.warn(
        `Primary rate limit hit for ${options.method} ${options.url} (403/429 status)`
      )
      octokit.log.info(`Retrying after ${retryAfter} seconds!`)
      return true
    },
    onSecondaryRateLimit: (retryAfter: any, options: any, octokit: any) => {
      octokit.log.warn(
        `Secondary rate limit detected for ${options.method} ${options.url}. Retry after ${retryAfter} seconds.`
      )
      return true // Retry secondary rate limits
    },
  },
}

export default new MyOctokit(octokitConfig)
