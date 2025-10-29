export default async (request, context) => {
  console.log('running edge function: redirect-from-old-portal')
  console.log('request.url', request.url)

  const url = new URL(request.url)
  const search = url.search ? url.search : '' // preserve query string

  let destination

  // First, check for hardcoded redirects in redirects.json
  const redirectResult = await checkRedirects(url)
  if (redirectResult) {
    if (
      redirectResult.startsWith('http://') ||
      redirectResult.startsWith('https://')
    ) {
      const response = Response.redirect(redirectResult, 308)
      response.headers.set(
        'Cache-Control',
        'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200, immutable'
      )
      return response
    } else {
      console.log('legacy redirect found:', redirectResult)
      url.pathname = redirectResult
      destination = redirectResult
    }
  }

  // Match patterns:
  // /<locale>/{type}/{slug}[--<key>]
  // /{type}/{slug}[--<key>]
  const match = url.pathname.match(
    /^(?:\/(?<locale>[a-z]{2}))?\/(?<type>tutorial|announcements|known-issues|tracks|faq)\/(?<slug>[^/]+?)(?:--[^/]+)?(?:\/[^/]+)?$/
  )

  if (match && match.groups) {
    console.log('match found')
    const locale = match.groups.locale || 'en' // default if no locale
    const type = match.groups.type // "tutorial", "tracks", "faq"
    const slug = match.groups.slug // clean slug without --key
    console.log('locale', locale)
    console.log('type', type)
    console.log('slug', slug)
    console.log('search', search)

    if (type === 'tutorial') {
      destination = `/${locale}/docs/tutorials/${slug}`
    } else if (type === 'tracks') {
      destination = `/${locale}/docs/tracks/${slug}`
    } else if (type === 'known-issues') {
      // Handle ki-- format (internal reference format)
      if (url.pathname.includes('/known-issues/ki--')) {
        // Extract the full slug (ki--1186137) from pathname since regex truncates it
        const fullSlugMatch = url.pathname.match(/\/known-issues\/(ki--\d+)/)
        const fullSlug = fullSlugMatch ? fullSlugMatch[1] : slug
        const resolvedSlug = await resolveKiSlug(fullSlug, locale)
        if (resolvedSlug) {
          destination = `/${locale}/known-issues/${resolvedSlug}`
        }
      } else {
        destination = `/${locale}/known-issues/${slug}`
      }
    } else if (type === 'faq') {
      destination = `/${locale}/faq/${slug}`
    } else if (type === 'announcements') {
      const nav = await getNavigation(url)
      const newSlug = findAnnouncementSlug(nav, slug, locale)
      if (!newSlug) {
        // fallback: keep old slug
        destination = `/${locale}/announcements/${slug}`
      } else {
        destination = `/${locale}/announcements/${newSlug}`
      }
    }
  }

  if (destination) {
    console.log('destination', destination)

    const response = Response.redirect(
      new URL(destination + search, url.origin),
      308
    )
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200, immutable'
    )
    return response
  }

  return context.next()
}

let navigationCache = null
let redirectsCache = null

async function getNavigation(url) {
  if (!navigationCache) {
    const res = await fetch(`${url.origin}/navigation.json`)
    navigationCache = await res.json()
  }
  return navigationCache
}

async function getRedirects(url) {
  if (!redirectsCache) {
    const res = await fetch(`${url.origin}/redirects.json`)
    redirectsCache = await res.json()
  }
  return redirectsCache
}

// Helper function to detect locale from path
function detectLocale(path) {
  const match = path.match(/^\/([a-z]{2})\//)
  return match ? match[1] : null
}

// Helper function to replace locale in path
function replaceLocale(path, newLocale) {
  if (newLocale === null) {
    // Remove locale from path
    return path.replace(/^\/[a-z]{2}\//, '/')
  } else {
    // Add or replace locale in path
    if (path.match(/^\/[a-z]{2}\//)) {
      return path.replace(/^\/[a-z]{2}\//, `/${newLocale}/`)
    } else {
      return `/${newLocale}${path}`
    }
  }
}

async function checkRedirects(url) {
  try {
    const redirectsData = await getRedirects(url)
    const redirects = []
    if (redirectsData.redirects) {
      for (const redirectArray of Object.values(redirectsData.redirects)) {
        if (Array.isArray(redirectArray)) {
          redirects.push(...redirectArray)
        }
      }
    }

    let currentPath = url.pathname
    const visitedPaths = new Set() // Prevent infinite loops
    const maxRedirects = 10 // Safety limit
    const availableLocales = ['pt', 'en', 'es', null] // null means no locale
    let currentLocale = detectLocale(currentPath)
    let localeIndex = availableLocales.indexOf(currentLocale)

    for (let i = 0; i < maxRedirects; i++) {
      if (visitedPaths.has(currentPath)) {
        console.log('Circular redirect detected, breaking loop')
        break
      }
      visitedPaths.add(currentPath)

      // Find redirect for current path
      const redirect = redirects.find((r) => r.from === currentPath)

      if (!redirect) {
        // No redirect found for current path, try different locales
        if (localeIndex < availableLocales.length - 1) {
          localeIndex++
          const newLocale = availableLocales[localeIndex]
          const newPath = replaceLocale(url.pathname, newLocale)

          console.log(
            `No match found for ${currentPath}, trying locale ${newLocale}: ${newPath}`
          )
          currentPath = newPath
          continue
        } else {
          // All locales tried, no match found
          console.log('No match in legacy redirects after trying all locales')
          break
        }
      }

      console.log(`Redirect found: ${redirect.from} -> ${redirect.to}`)

      return redirect.to
    }

    return null // No redirect found
  } catch (error) {
    console.error('Error checking redirects:', error)
    return null
  }
}

function findAnnouncementSlug(nav, oldSlug, locale) {
  // Locate announcements block
  const annSection = nav.navbar.find(
    (item) => item.documentation === 'announcements'
  )
  if (!annSection) return null

  // Traverse recursively
  function search(children) {
    for (const child of children) {
      if (child.type === 'markdown') {
        // match oldSlug at the *end* of the new slug
        const newSlug = child.slug[locale] || child.slug.en
        if (newSlug.endsWith(oldSlug)) {
          return newSlug
        }
      }
      const found = search(child.children || [])
      if (found) return found
    }
    return null
  }

  return search(annSection.categories || [])
}

/**
 * Resolve ki-- format slug to actual slug
 */
async function resolveKiSlug(originalSlug, locale) {
  const internalReference = Number(originalSlug.replace('ki--', ''))
  if (isNaN(internalReference)) {
    console.error(`Invalid ki-- format: ${originalSlug}`)
    return null
  }

  try {
    const cdnUrls = [
      `https://cdn.jsdelivr.net/gh/vtexdocs/known-issues@main/.github/ki-slugs-and-zendesk-ids.json`,
      `https://cdn.statically.io/gh/vtexdocs/known-issues/main/.github/ki-slugs-and-zendesk-ids.json`,
      `https://raw.githubusercontent.com/vtexdocs/known-issues/main/.github/ki-slugs-and-zendesk-ids.json`,
    ]

    let content = null
    let lastError = null

    for (const cdnUrl of cdnUrls) {
      try {
        const response = await fetch(cdnUrl)
        if (response.ok) {
          content = await response.text()
          break
        }
      } catch (error) {
        lastError = error
        continue
      }
    }

    if (!content) {
      console.error(
        `Failed to fetch ki mapping from all CDNs: ${
          lastError?.message || 'Unknown error'
        }`
      )
      return null
    }

    const mapping = JSON.parse(content)
    const entry = mapping.find(
      (item) =>
        item.locale === locale && item.internalReference === internalReference
    )

    if (entry) {
      console.log(`Mapped ki--${internalReference} to slug: ${entry.slug}`)
      return entry.slug
    } else {
      console.warn(
        `No mapping found for ki--${internalReference} in locale ${locale}`
      )
      return null
    }
  } catch (error) {
    console.error(
      `Error fetching mapping for ki--${internalReference}: ${error.message}`
    )
    return null
  }
}
