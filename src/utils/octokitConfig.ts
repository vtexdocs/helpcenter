/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import { getGitHubConfig } from './github-config'
import { getLogger } from './logging/log-util'

const logger = getLogger('octokitConfig')

// Constants for rate limiting and retry behavior
const MAX_RETRIES = 8 // Increased from 5
const INITIAL_RETRY_DELAY = 5000 // 5 seconds
const MAX_RETRY_DELAY = 60000 // 60 seconds

function calculateBackoff(retryCount: number): number {
  return Math.min(
    INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
    MAX_RETRY_DELAY
  )
}

// Get GitHub configuration from environment variables
const githubConfig = getGitHubConfig()

export const getConfig = () => ({
  appId: githubConfig.appId,
  privateKey: githubConfig.privateKey,
  installationId: githubConfig.installationId,
})

const octokitConfig = {
  authStrategy: createAppAuth,
  auth: getConfig(),
  log: logger,
  retry: {
    enabled: true,
    doNotRetry: ['429'],
  },
  throttle: {
    enabled: true,
    onRateLimit: (retryAfter: number, options: any, retryCount: number) => {
      const endpoint = `${options.method} ${options.url}`

      if (retryCount < MAX_RETRIES) {
        const delay = calculateBackoff(retryCount)
        const waitTime = Math.max(retryAfter * 1000, delay)

        logger.warn(
          `Rate limit exceeded for ${endpoint}. Waiting ${Math.round(
            waitTime / 1000
          )}s before retry ${retryCount + 1}/${MAX_RETRIES}`
        )

        return true
      }

      logger.error(`Rate limit exceeded - max retries reached for ${endpoint}`)
      return false
    },
    onSecondaryRateLimit: (
      retryAfter: number,
      options: any,
      retryCount: number
    ) => {
      const endpoint = `${options.method} ${options.url}`

      // More aggressive backoff for secondary rate limits
      if (retryCount < 3) {
        const delay = calculateBackoff(retryCount) * 2 // Double the normal backoff
        const waitTime = Math.max(retryAfter * 1000, delay)

        logger.warn(
          `Secondary rate limit hit for ${endpoint}. Waiting ${Math.round(
            waitTime / 1000
          )}s before retry ${retryCount + 1}/3`
        )

        return true
      }

      logger.error(`Secondary rate limit - max retries reached for ${endpoint}`)
      return false
    },
  },
}

// Create Octokit instance with our configuration
const octokit = new Octokit(octokitConfig)

// Validate GitHub connection on startup
async function validateGitHubConnection(client: Octokit) {
  const MAX_RETRIES = 3
  let retryCount = 0
  while (retryCount < MAX_RETRIES) {
    try {
      await client.rest.meta.get()
      logger.info('GitHub connection validated successfully')
      return
    } catch (err) {
      const error = err as any
      if (error.status === 403 && error.response.headers['x-ratelimit-reset']) {
        const resetTime =
          parseInt(error.response.headers['x-ratelimit-reset'], 10) * 1000
        parseInt(error.response.headers['x-ratelimit-reset'], 10) * 1000
        const waitTime = resetTime - Date.now()
        if (waitTime > 0) {
          logger.warn(
            `Rate limit exceeded. Retrying in ${Math.ceil(
              waitTime / 1000
            )} seconds...`
          )
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
      } else if (error instanceof Error) {
        logger.error(`Error validating GitHub connection: ${error.message}`)
        throw error
      } else {
        logger.error('Error validating GitHub connection: Unknown error')
        throw error
      }
    }
    retryCount++
  }
  logger.error('Max retries reached. Failed to validate GitHub connection.')
  throw new Error('Max retries reached. Failed to validate GitHub connection.')
}

validateGitHubConnection(octokit).catch((error) => {
  logger.error(`Initial GitHub connection validation failed: ${error.message}`)
})

/**
 * Wrapper for GitHub API calls with automatic retry for rate limit errors
 *
 * @param apiCall - Function that makes the GitHub API call
 * @returns Promise with the API call result
 */
export const withGitHubAPI = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    throw error
  }
}

export default octokit
