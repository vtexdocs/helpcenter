export default async (request, context) => {
  console.log('running edge function: redirect-from-old-portal')
  console.log('request.url', request.url)

  const url = new URL(request.url)

  // First, check for hardcoded redirects in redirects.json
  const redirectResult = await checkRedirects(url)
  if (redirectResult) {
    console.log('legacy redirect found:', redirectResult)
    return redirectResult
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

    return Response.redirect(new URL(destination + search, url.origin), 308)
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

    for (let i = 0; i < maxRedirects; i++) {
      if (visitedPaths.has(currentPath)) {
        console.log('Circular redirect detected, breaking loop')
        break
      }
      visitedPaths.add(currentPath)

      // Find redirect for current path
      const redirect = redirects.find((r) => r.from === currentPath)

      if (!redirect) {
        // No more redirects found, currentPath is the final destination
        console.log('No match in legacy redirects')
        break
      }

      console.log(`Redirect found: ${redirect.from} -> ${redirect.to}`)

      // Check if the 'to' value is an external URL
      if (
        redirect.to.startsWith('http://') ||
        redirect.to.startsWith('https://')
      ) {
        // External redirect - return immediately
        return Response.redirect(redirect.to, 308)
      }

      // Internal path - continue the loop with the new path
      currentPath = redirect.to
    }

    // If we have a different final path, redirect to it
    if (currentPath !== url.pathname) {
      const finalUrl = new URL(currentPath + url.search, url.origin)
      return Response.redirect(finalUrl, 308)
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
