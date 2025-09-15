import { getDocsPaths } from './getDocsPaths'
import { getLogger } from './logging/log-util'

/**
 * Checks if a troubleshooting file exists for the given slug and locale
 * @param slug - The slug to check for
 * @param locale - The locale to check for
 * @param branch - The git branch to check
 * @returns Promise<boolean> - True if troubleshooting file exists, false otherwise
 */
export async function checkTroubleshootingFallback(
  slug: string,
  branch = 'main'
): Promise<boolean> {
  const logger = getLogger('checkTroubleshootingFallback')

  try {
    const troubleshootingPaths = await getDocsPaths('troubleshooting', branch)
    const troubleshootingFile = troubleshootingPaths[slug]?.find(
      (entry) => entry
    )

    const exists = Boolean(troubleshootingFile)

    if (exists) {
      logger.info(`Found troubleshooting fallback for slug: ${slug}`)
    } else {
      logger.info(`No troubleshooting fallback found for slug: ${slug}`)
    }

    return exists
  } catch (error) {
    logger.error(
      `Error checking troubleshooting fallback for slug: ${slug} - ${
        (error as Error).message
      }`
    )
    return false
  }
}

/**
 * Creates a redirect response to troubleshooting page
 * @param slug - The slug to redirect to
 * @param locale - The locale for the redirect
 * @returns Redirect response object
 */
export function createTroubleshootingRedirect(slug: string, locale: string) {
  return {
    redirect: {
      destination: `/${locale}/troubleshooting/${slug}`,
      permanent: true,
    },
  }
}
