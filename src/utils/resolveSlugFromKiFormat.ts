import { LoggerType } from './logging/log-util'

export async function resolveSlugFromKiFormat(
  originalSlug: string,
  locale: string,
  logger: LoggerType
) {
  if (!originalSlug.startsWith('ki--')) return originalSlug

  const internalReference = Number(originalSlug.replace('ki--', ''))

  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/vtexdocs/known-issues/refs/heads/main/.github/ki-slugs-and-zendesk-ids.json'
    )
    if (!res.ok) throw new Error('Failed to fetch mapping')

    const mapping: Array<{
      locale: string
      slug: string
      internalReference: number
    }> = await res.json()
    const entry = mapping.find(
      (item) =>
        item.locale === locale && item.internalReference === internalReference
    )

    if (entry) {
      logger.info(`Redirecting ki--${internalReference} to slug: ${entry.slug}`)
      return {
        redirect: {
          destination: `/${locale}/known-issues/${entry.slug}`,
          permanent: true,
        },
      }
    } else {
      logger.warn(
        `No mapping found for ki--${internalReference} in locale ${locale}`
      )
      return { notFound: true }
    }
  } catch (error) {
    logger.error(
      `Error fetching mapping for ki--${internalReference}: ${error}`
    )
    return { notFound: true }
  }
}
