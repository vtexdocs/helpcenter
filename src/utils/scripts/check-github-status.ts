#!/usr/bin/env ts-node
/**
 * GitHub Status Check Utility
 *
 * This command-line tool helps developers debug GitHub API integration issues by:
 * - Verifying GitHub credentials and connection
 * - Displaying current API rate limits
 * - Testing file fetching capabilities
 * - Providing detailed error information
 *
 * Usage:
 *   ts-node src/utils/scripts/check-github-status.ts [owner] [repo] [path]
 *
 * Example:
 *   ts-node src/utils/scripts/check-github-status.ts microsoft TypeScript README.md
 */
import chalk from 'chalk'
import octokit, { getConfig } from '../octokitConfig'
import getGithubFile from '../getGithubFile'
import getGithubFileWithFallback from '../getGithubFileWithFallback'
import { getLogger } from '../logging/log-util'
import {
  GitHubErrorResponse,
  isRateLimitError,
  retryWithRateLimit,
} from '../retry-util'

const logger = getLogger('github-status')

// Default repository to check if none specified
const DEFAULT_OWNER = 'microsoft'
const DEFAULT_REPO = 'TypeScript'
const DEFAULT_PATH = 'README.md'

async function checkGitHubCredentials(): Promise<boolean> {
  logger.info(chalk.blue('Checking GitHub credentials...'))
  const config = getConfig()

  if (!config.appId || !config.installationId || !config.privateKey) {
    logger.error(
      chalk.red('❌ Missing GitHub credentials in environment variables')
    )
    logger.info(chalk.yellow('Required environment variables:'))
    logger.info(chalk.yellow('- GITHUB_APP_ID'))
    logger.info(chalk.yellow('- GITHUB_INSTALLATION_ID'))
    logger.info(chalk.yellow('- GITHUB_PRIVATEKEY'))
    return false
  }
  logger.info(chalk.green('✓ GitHub credentials found in environment'))
  return true
}

async function checkRateLimits(octo: typeof octokit): Promise<void> {
  logger.info(chalk.blue('\nChecking rate limits...'))

  try {
    const { data } = await octo.rest.rateLimit.get()
    logger.info(
      chalk.white(
        `Rate limit status: ${data.rate.remaining}/${data.rate.limit} remaining`
      )
    )
    logger.info(
      chalk.white(
        `Reset time: ${new Date(data.rate.reset * 1000).toLocaleString()}`
      )
    )

    if (data.rate.remaining < 100) {
      logger.warn(
        chalk.yellow(
          `Warning: Low rate limit remaining (${data.rate.remaining})`
        )
      )
    } else {
      logger.info(chalk.green('✓ Rate limits are healthy'))
    }
  } catch (error) {
    logger.error(chalk.red('❌ Failed to check rate limits'))
    if (error instanceof Error) {
      logger.error(chalk.red(`Error details: ${error.message}`))
    }
    throw error
  }
}

async function checkFileAccess(
  owner: string,
  repo: string,
  path: string
): Promise<void> {
  logger.info(chalk.blue('\nTesting GitHub file access...'))

  // Test getGithubFile with retry
  logger.info(
    chalk.white(`Fetching ${owner}/${repo}/${path} using getGithubFile...`)
  )
  try {
    const fileContent = await retryWithRateLimit(() =>
      getGithubFile(owner, repo, 'main', path)
    )
    logger.info(
      chalk.green(`✓ Successfully fetched file (${fileContent.length} bytes)`)
    )
    logger.info(
      chalk.white(`First 150 characters: ${fileContent.slice(0, 150)}...`)
    )
  } catch (error: unknown) {
    logger.error(chalk.red('❌ Failed to fetch file using getGithubFile'))
    if (isRateLimitError(error)) {
      const resetTime = new Date(
        parseInt(
          (error as GitHubErrorResponse).response?.headers?.[
            'x-ratelimit-reset'
          ] || '0',
          10
        ) * 1000
      )
      logger.error(
        chalk.red(
          `Rate limit exceeded. Resets at: ${resetTime.toLocaleString()}`
        )
      )
    } else if (error instanceof Error) {
      logger.error(chalk.red(`Error details: ${error.message}`))
    }
  }

  // Test getGithubFileWithFallback with retry
  logger.info(
    chalk.white(
      `\nFetching ${owner}/${repo}/${path} using getGithubFileWithFallback...`
    )
  )
  try {
    const fileContent = await retryWithRateLimit(() =>
      getGithubFileWithFallback(owner, repo, 'main', path)
    )
    logger.info(
      chalk.green(
        `✓ Successfully fetched file with fallback mechanism (${fileContent.length} bytes)`
      )
    )
    logger.info(
      chalk.white(`First 150 characters: ${fileContent.slice(0, 150)}...`)
    )
  } catch (error: unknown) {
    logger.error(
      chalk.red('❌ Failed to fetch file using getGithubFileWithFallback')
    )
    if (error instanceof Error) {
      logger.error(chalk.red(`Error details: ${error.message}`))
    }
  }
}

async function main(): Promise<void> {
  console.log(chalk.bgBlue.white('\n GitHub Integration Status Check \n'))
  const args = process.argv.slice(2)
  const owner = args[0] || DEFAULT_OWNER
  const repo = args[1] || DEFAULT_REPO
  const path = args[2] || DEFAULT_PATH

  logger.info(chalk.white(`Target repository: ${owner}/${repo}`))
  logger.info(chalk.white(`Target file: ${path}`))

  // Step 1: Check credentials
  const credentialsValid = await checkGitHubCredentials()
  if (!credentialsValid) {
    logger.error(
      chalk.red('\nCannot proceed without valid GitHub credentials.')
    )
    process.exit(1)
  }

  try {
    // Step 2: Initialize Octokit
    logger.info(chalk.blue('\nInitializing GitHub API client...'))
    logger.info(chalk.green('✓ GitHub API client initialized successfully'))

    // Step 3: Check rate limits
    await checkRateLimits(octokit)

    // Step 4: Test file fetching
    await checkFileAccess(owner, repo, path)

    logger.info(chalk.green('\n✓ GitHub status check completed successfully'))
  } catch (error: unknown) {
    logger.error(chalk.red('\n❌ GitHub status check failed'))
    if (error instanceof Error) {
      logger.error(chalk.red(`Error details: ${error.message}`))
    } else {
      logger.error(chalk.red('An unknown error occurred'))
    }
    process.exit(1)
  }
}

// Run the script
main().catch((error) => {
  console.error(chalk.red('Unhandled error:'), error)
  process.exit(1)
})
