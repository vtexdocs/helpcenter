// function base64(data: string) {
//   const buff = Buffer.from(data, 'base64')
//   return buff.toString('utf8')
// }

import preval from 'next-plugin-preval'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PEM from '../../github.pem'

const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable]
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    )
  } else {
    return unvalidatedEnvironmentVariable
  }
}

/**
 * Get ISR revalidate time from environment variable for index/listing pages
 * @returns {number} Revalidate time in seconds (default: 600 seconds / 10 minutes)
 *
 * This function safely handles environments where ISR_REVALIDATE_SECONDS is not set
 * and falls back to a sensible 10-minute default for documentation sites.
 */
export const getISRRevalidateTime = (): number => {
  const DEFAULT_REVALIDATE_SECONDS = 600 // 10 minutes
  const envValue = process.env.ISR_REVALIDATE_SECONDS

  // Return default if environment variable is not set or empty
  if (!envValue || envValue.trim() === '') {
    return DEFAULT_REVALIDATE_SECONDS
  }

  // Parse and validate the environment variable value
  const parsed = parseInt(envValue.trim(), 10)
  if (isNaN(parsed) || parsed <= 0) {
    console.warn(
      `Invalid ISR_REVALIDATE_SECONDS value: "${envValue}". Must be a positive integer. Using default: ${DEFAULT_REVALIDATE_SECONDS} seconds.`
    )
    return DEFAULT_REVALIDATE_SECONDS
  }

  return parsed
}

/**
 * Get ISR revalidate time from environment variable for article/detail pages
 * @returns {number} Revalidate time in seconds (default: 600 seconds / 10 minutes)
 *
 * This function safely handles environments where ISR_ARTICLE_REVALIDATE_SECONDS is not set
 * and falls back to a sensible 10-minute default for documentation sites.
 */
export const getArticleRevalidateTime = (): number => {
  const DEFAULT_REVALIDATE_SECONDS = 600 // 10 minutes
  const envValue = process.env.ISR_ARTICLE_REVALIDATE_SECONDS

  // Return default if environment variable is not set or empty
  if (!envValue || envValue.trim() === '') {
    return DEFAULT_REVALIDATE_SECONDS
  }

  // Parse and validate the environment variable value
  const parsed = parseInt(envValue.trim(), 10)
  if (isNaN(parsed) || parsed <= 0) {
    console.warn(
      `Invalid ISR_ARTICLE_REVALIDATE_SECONDS value: "${envValue}". Must be a positive integer. Using default: ${DEFAULT_REVALIDATE_SECONDS} seconds.`
    )
    return DEFAULT_REVALIDATE_SECONDS
  }

  return parsed
}

/**
 * Get ISR revalidate time from environment variable for category cover pages
 * @returns {number} Revalidate time in seconds (default: 3600 seconds / 1 hour)
 *
 * This function safely handles environments where ISR_CATEGORY_REVALIDATE_SECONDS is not set
 * and falls back to a sensible 1-hour default for documentation sites.
 */
export const getCategoryCoverRevalidateTime = (): number => {
  const DEFAULT_REVALIDATE_SECONDS = 3600 // 1 hour
  const envValue = process.env.ISR_CATEGORY_REVALIDATE_SECONDS

  // Return default if environment variable is not set or empty
  if (!envValue || envValue.trim() === '') {
    return DEFAULT_REVALIDATE_SECONDS
  }

  // Parse and validate the environment variable value
  const parsed = parseInt(envValue.trim(), 10)
  if (isNaN(parsed) || parsed <= 0) {
    console.warn(
      `Invalid ISR_CATEGORY_REVALIDATE_SECONDS value: "${envValue}". Must be a positive integer. Using default: ${DEFAULT_REVALIDATE_SECONDS} seconds.`
    )
    return DEFAULT_REVALIDATE_SECONDS
  }

  return parsed
}

export const config = preval({
  GITHUB_APPID: getEnvironmentVariable('GITHUB_APPID'),
  GITHUB_PRIVATEKEY: PEM,
  GITHUB_INSTALLATIONID: getEnvironmentVariable('GITHUB_INSTALLATIONID'),
})
