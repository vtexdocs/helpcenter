/**
 * GitHub configuration based on environment variables
 *
 * This module provides a centralized way to access GitHub configuration
 * values from environment variables with proper error handling.
 */

/**
 * Configuration interface for GitHub integration
 */
export interface GitHubConfig {
  appId: string
  installationId: string
  privateKey: string
}

/**
 * Error thrown when a required GitHub configuration variable is missing
 */
export class GitHubConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GitHubConfigError'
  }
}

/**
 * Get a required environment variable or throw an error if it's missing
 *
 * @param name - The name of the environment variable
 * @returns The value of the environment variable
 * @throws {GitHubConfigError} If the environment variable is missing or empty
 */
function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new GitHubConfigError(
      `Missing required environment variable: ${name}`
    )
  }
  return value
}

/**
 * Get GitHub configuration from environment variables
 *
 * @returns GitHubConfig object with all required values
 * @throws {GitHubConfigError} If any required environment variable is missing
 */
export function getGitHubConfig(): GitHubConfig {
  try {
    return {
      appId: getRequiredEnv('GITHUB_APPID'),
      installationId: getRequiredEnv('GITHUB_INSTALLATIONID'),
      privateKey: getRequiredEnv('GITHUB_PRIVATEKEY'),
    }
  } catch (error) {
    if (error instanceof GitHubConfigError) {
      throw error
    }
    throw new GitHubConfigError(
      `Failed to load GitHub configuration: ${(error as Error).message}`
    )
  }
}

/**
 * Validate that all required GitHub configuration is available
 *
 * @returns true if all required configuration is available
 * @throws {GitHubConfigError} If any required environment variable is missing
 */
export function validateGitHubConfig(): boolean {
  getGitHubConfig()
  return true
}

export default getGitHubConfig
