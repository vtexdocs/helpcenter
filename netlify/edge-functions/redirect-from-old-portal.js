export default async (request, context) => {
  console.log('running edge function: redirect-from-old-portal')
  console.log('request.url', request.url)

  const url = new URL(request.url)

  // Check for infinite loop protection header
  if (request.headers.get('x-pattern-matching-attempted')) {
    console.log(
      'Pattern matching already attempted, skipping to avoid infinite loop'
    )
    return context.next()
  }

  // First, check for legacy redirects in redirects.json
  console.log('1.Running legacy redirects check')
  const redirectResult = await checkLegacyRedirects(url)
  if (redirectResult) {
    // If it's a Response object, it's an external redirect - return it
    if (redirectResult instanceof Response) {
      console.log('Legacy external redirect found:', redirectResult.url)
      return redirectResult
    }
    // If it's a string, it's an internal redirect - update the path
    console.log('Legacy redirect found, updating path to:', redirectResult)
    url.pathname = redirectResult
    // Continue to pattern matching to avoid double redirects
  }

  console.log('2.Running path pattern adjustment logic')

  // Match patterns:
  // /<locale>/docs/{type}s/{slug}[--<key>]
  // /<locale>/{type}/{slug}[--<key>]
  // /{type}/{slug}[--<key>]
  const currentPath = url.pathname
  const match = currentPath.match(
    /^(?:\/(?<locale>[a-z]{2}))?(?:\/docs)?\/(?<type>tutorial|announcements|known-issues|tracks|faq)s?\/(?<slug>[^/]+?)(?:--[^/]+)?(?:\/[^/]+)?$/
  )

  if (match && match.groups) {
    console.log('match found')
    const locale = match.groups.locale || 'en' // default if no locale
    const type = match.groups.type // "tutorial", "tracks", "faq"
    const slug = match.groups.slug // clean slug without --key
    const search = url.search || '' // preserve query string
    console.log('locale', locale)
    console.log('type', type)
    console.log('slug', slug)
    console.log('search', search)

    let destination

    if (type === 'tutorial') {
      destination = `/${locale}/docs/tutorials/${slug}`
    } else if (type === 'tracks') {
      destination = `/${locale}/docs/tracks/${slug}`
    } else if (type === 'known-issues') {
      destination = `/${locale}/known-issues/${slug}`
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

    console.log('destination', destination)

    // Check if the current path already matches the destination to avoid redundant redirects
    if (currentPath === destination) {
      console.log('Path already matches destination, no redirect needed')
      return context.next()
    }

    // Add header to prevent infinite loops on subsequent requests
    const response = Response.redirect(
      new URL(destination + search, url.origin),
      308
    )
    response.headers.set('x-pattern-matching-attempted', 'true')
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

async function checkLegacyRedirects(url) {
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
        // Try with/without article key before trying different locales
        const articleKeyMatch = currentPath.match(/^(.+)--([a-zA-Z0-9]+)$/)
        let alternativeRedirect = null

        if (articleKeyMatch) {
          // Path has key, try without it
          const pathWithoutKey = articleKeyMatch[1]
          alternativeRedirect = redirects.find((r) => r.from === pathWithoutKey)
          console.log(`No match for ${currentPath}, trying without key`)
        } else {
          // Path has no key, try with any key
          alternativeRedirect = redirects.find((r) =>
            r.from.startsWith(currentPath + '--')
          )
          console.log(`No match for ${currentPath}, trying with key wildcard`)
        }

        if (alternativeRedirect) {
          console.log(
            `Article key variant found: ${alternativeRedirect.from} -> ${alternativeRedirect.to}`
          )

          // Check if external redirect
          if (
            alternativeRedirect.to.startsWith('http://') ||
            alternativeRedirect.to.startsWith('https://')
          ) {
            return Response.redirect(alternativeRedirect.to, 308)
          }

          // Update path and continue loop
          currentPath = alternativeRedirect.to
          continue
        }

        // No redirect found with key variations, try different locales
        if (localeIndex < availableLocales.length - 1) {
          localeIndex++
          const newLocale = availableLocales[localeIndex]
          const newPath = replaceLocale(currentPath, newLocale)

          console.log(
            `No match found for ${currentPath}, trying locale ${newLocale}: ${newPath}`
          )
          currentPath = newPath
          continue
        } else {
          // All locales tried, no match found
          console.log('No further redirects found after trying all locales')
          break
        }
      }

      console.log(`Redirect chain found: ${redirect.from} -> ${redirect.to}`)

      // Check if the 'to' value is an external URL
      if (
        redirect.to.startsWith('http://') ||
        redirect.to.startsWith('https://')
      ) {
        // External redirect - return Response object
        return Response.redirect(redirect.to, 308)
      }

      // Internal path - continue the loop with the new path
      currentPath = redirect.to
    }

    // If we have a different final path, return it
    if (currentPath !== url.pathname) {
      return currentPath
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
