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
    enabled: false,
    onRateLimit: (retryAfter: any, options: any, octokit: any) => {
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      )
      octokit.log.info(`Retrying after ${retryAfter} seconds!`)
      return true
    },
    onSecondaryRateLimit: (retryAfter: any, options: any, octokit: any) => {
      retryAfter = retryAfter
      // does not retry, only logs a warning
      octokit.log.warn(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      )
    },
  },
}

export default new MyOctokit(octokitConfig)
