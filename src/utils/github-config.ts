/**
 * GitHub configuration based on environment variables
 *
 * This module provides a centralized way to access GitHub configuration
 * values from environment variables with proper error handling.
 */
import { getLogger } from './logging/log-util'

// Create a logger instance for GitHub configuration
const logger = getLogger('octokitConfig')

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
 * Format a private key string for proper use in JWT signing
 * Handles different formats of private keys including base64 encoded ones
 *
 * @param privateKey - The raw private key string from environment variable
 * @returns The properly formatted private key
 */
function formatPrivateKey(privateKey: string): string {
  // Log key characteristics without exposing actual content
  logger.info(
    `Formatting private key. Length: ${
      privateKey.length
    }, Contains newlines: ${privateKey.includes('\n')}`
  )

  // Clean up the key - remove any extra whitespace, carriage returns, etc.
  const cleanKey = privateKey.trim()

  // If the key already contains proper BEGIN/END markers with newlines, use it as is
  if (
    cleanKey.includes('-----BEGIN RSA PRIVATE KEY-----\n') &&
    cleanKey.includes('\n-----END RSA PRIVATE KEY-----')
  ) {
    logger.info('Private key already has proper format with newlines')
    return cleanKey
  }

  // Check if this is a base64 encoded key (often the case with Netlify)
  if (cleanKey.startsWith('LS0tLS1CRUdJTiBSU0EgUFJJVkFURS')) {
    logger.info('Detected base64 encoded private key, attempting to decode')
    try {
      // Create a Buffer from the base64 string and convert to utf-8
      const decoded = Buffer.from(cleanKey, 'base64').toString('utf-8')

      logger.info(
        `Decoded key. Length: ${
          decoded.length
        }, Contains newlines: ${decoded.includes('\n')}`
      )

      // Check if the decoded key is already properly formatted
      if (
        decoded.includes('-----BEGIN RSA PRIVATE KEY-----') &&
        decoded.includes('-----END RSA PRIVATE KEY-----')
      ) {
        logger.info('Decoded key has proper markers')

        // If it's missing newlines, add them
        if (!decoded.includes('-----BEGIN RSA PRIVATE KEY-----\n')) {
          logger.info('Decoded key missing newlines, reformatting')

          // Extract content between markers
          const keyContent = decoded
            .replace('-----BEGIN RSA PRIVATE KEY-----', '')
            .replace('-----END RSA PRIVATE KEY-----', '')
            .trim()

          // Add newlines every 64 characters
          const formattedContent = keyContent.replace(/(.{64})/g, '$1\n')

          return `-----BEGIN RSA PRIVATE KEY-----\n${formattedContent}\n-----END RSA PRIVATE KEY-----`
        }

        return decoded
      } else {
        logger.info("Decoded key doesn't have proper markers, will add them")
        // Add proper markers and format
        const formattedContent = decoded.replace(/(.{64})/g, '$1\n')
        return `-----BEGIN RSA PRIVATE KEY-----\n${formattedContent}\n-----END RSA PRIVATE KEY-----`
      }
    } catch (error) {
      logger.error(
        `Error decoding base64 private key: ${(error as Error).message}`
      )
      // Continue with other formatting methods if base64 decoding fails
    }
  }

  // If key has markers but missing newlines, add them
  if (
    cleanKey.includes('-----BEGIN RSA PRIVATE KEY-----') &&
    cleanKey.includes('-----END RSA PRIVATE KEY-----') &&
    !cleanKey.includes('-----BEGIN RSA PRIVATE KEY-----\n')
  ) {
    logger.info('Private key has markers but missing newlines, reformatting')

    // Extract the key content between markers
    const keyContent = cleanKey
      .replace('-----BEGIN RSA PRIVATE KEY-----', '')
      .replace('-----END RSA PRIVATE KEY-----', '')
      .trim()

    // Add proper newlines after every 64 characters
    const formattedContent = keyContent.replace(/(.{64})/g, '$1\n')

    // Reconstruct with proper BEGIN/END markers and newlines
    return `-----BEGIN RSA PRIVATE KEY-----\n${formattedContent}\n-----END RSA PRIVATE KEY-----`
  }

  // Handle Netlify specific environment variables
  // These are often set without the BEGIN/END markers and may need to be base64 decoded
  if (process.env.NETLIFY === 'true') {
    logger.info('Processing key for Netlify environment')

    // If the key doesn't have BEGIN/END markers, add them with proper formatting
    if (!cleanKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      logger.info('Adding RSA private key markers to raw key')

      // Format with proper line breaks every 64 characters
      const formattedContent = cleanKey.replace(/(.{64})/g, '$1\n')

      // Reconstruct with proper BEGIN/END markers and newlines
      return `-----BEGIN RSA PRIVATE KEY-----\n${formattedContent}\n-----END RSA PRIVATE KEY-----`
    }
  }

  // If we've reached here but the key still doesn't look right, try a more aggressive reformatting
  if (!cleanKey.includes('\n')) {
    logger.info('Key still missing newlines, applying aggressive reformatting')

    // Remove any existing markers
    let content = cleanKey
      .replace('-----BEGIN RSA PRIVATE KEY-----', '')
      .replace('-----END RSA PRIVATE KEY-----', '')
      .trim()

    // Add newlines every 64 characters
    content = content.replace(/(.{64})/g, '$1\n')

    // Ensure it has proper BEGIN/END markers
    return `-----BEGIN RSA PRIVATE KEY-----\n${content}\n-----END RSA PRIVATE KEY-----`
  }

  // Return the key as-is if none of the above conditions matched
  return cleanKey
}

/**
 * Get GitHub configuration from environment variables
 *
 * @returns GitHubConfig object with all required values
 * @throws {GitHubConfigError} If any required environment variable is missing
 */
export function getGitHubConfig(): GitHubConfig {
  try {
    // Get the raw private key
    const rawPrivateKey = getRequiredEnv('GITHUB_PRIVATEKEY')

    // Format the private key properly
    const formattedPrivateKey = formatPrivateKey(rawPrivateKey)

    const config = {
      appId: getRequiredEnv('GITHUB_APPID'),
      installationId: getRequiredEnv('GITHUB_INSTALLATIONID'),
      privateKey: formattedPrivateKey,
    }

    // Log config details without exposing sensitive information
    logger.info(
      `GitHub config loaded - AppID: ${config.appId}, InstallationID: ${
        config.installationId
      }, Key format valid: ${isValidKeyFormat(config.privateKey)}`
    )

    return config
  } catch (error) {
    if (error instanceof GitHubConfigError) {
      throw error
    }

    // Enhanced error reporting
    logger.error(`GitHub Configuration Error: ${(error as Error).message}`)

    throw new GitHubConfigError(
      `Failed to load GitHub configuration: ${(error as Error).message}`
    )
  }
}

/**
 * Check if a private key has the proper PEM format markers
 *
 * @param key - The private key to check
 * @returns True if the key has valid format markers
 */
function isValidKeyFormat(key: string): boolean {
  return (
    key.includes('-----BEGIN RSA PRIVATE KEY-----') &&
    key.includes('-----END RSA PRIVATE KEY-----') &&
    key.includes('\n')
  )
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
