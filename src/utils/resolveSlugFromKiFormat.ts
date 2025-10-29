import { LoggerType } from './logging/log-util'
import { fetchGitHubFileWithFallback } from './githubCdnFallback'

export async function resolveSlugFromKiFormat(
  originalSlug: string,
  locale: string,
  logger: LoggerType
): Promise<string | null> {
  if (!originalSlug.startsWith('ki--')) return originalSlug

  const internalReference = Number(originalSlug.replace('ki--', ''))

  try {
    const content = await fetchGitHubFileWithFallback(
      'vtexdocs',
      'known-issues',
      'main',
      '.github/ki-slugs-and-zendesk-ids.json',
      {
        cdnFallbackEnabled: true,
        preferredCdn: 'jsdelivr',
        logger,
      }
    )

    const mapping: Array<{
      locale: string
      slug: string
      internalReference: number
    }> = JSON.parse(content)
    const entry = mapping.find(
      (item) =>
        item.locale === locale && item.internalReference === internalReference
    )

    if (entry) {
      logger.info(`Mapped ki--${internalReference} to slug: ${entry.slug}`)
      return entry.slug
    } else {
      logger.warn(
        `No mapping found for ki--${internalReference} in locale ${locale}`
      )
      return null
    }
  } catch (error) {
    logger.error(
      `Error fetching mapping for ki--${internalReference}: ${error}`
    )
    return null
  }
}
