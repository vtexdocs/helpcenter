// Import redirects data at build time using Deno's JSON import
import redirectsData from '../../public/redirects.json' with { type: 'json' }

/**
 * Safely decode a URI component, handling malformed encodings (e.g., Latin-1 instead of UTF-8)
 * Falls back to the original string if decoding fails
 */
function safeDecodeURIComponent(str) {
  try {
    return decodeURIComponent(str)
  } catch {
    // If standard decoding fails, try to handle Latin-1 encoded characters
    try {
      // Replace Latin-1 encoded characters with UTF-8 equivalents
      return decodeURIComponent(
        str.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
          const charCode = parseInt(hex, 16)
          // If it's a Latin-1 extended character (128-255), encode it properly as UTF-8
          if (charCode >= 128 && charCode <= 255) {
            return encodeURIComponent(String.fromCharCode(charCode))
          }
          return `%${hex}`
        })
      )
    } catch {
      // If all decoding fails, return the original string
      return str
    }
  }
}

/**
 * Normalize a string by removing diacritics (accents)
 * This helps match URLs with accented characters to slugs without accents
 */
function normalizeString(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Helper function to append locale cookies to the Netlify-Vary header.
 * This ensures the CDN caches separate versions for each locale.
 */
function appendLocaleVaryHeader(response) {
  const existingVary = response.headers.get('netlify-vary') || ''
  
  // If no existing netlify-vary header, create one with just locale cookies
  if (!existingVary) {
    response.headers.set('netlify-vary', 'cookie=NEXT_LOCALE|nf_lang')
    return response
  }
  
  // Check if NEXT_LOCALE is already in the cookie section
  if (existingVary.includes('NEXT_LOCALE')) {
    return response // Already has locale cookies
  }
  
  // Parse and modify the netlify-vary header to add locale cookies
  // Format: query=...,header=...,cookie=...
  if (existingVary.includes('cookie=')) {
    // Append to existing cookie section
    const modifiedVary = existingVary.replace(
      /cookie=([^,]*)/,
      'cookie=$1|NEXT_LOCALE|nf_lang'
    )
    response.headers.set('netlify-vary', modifiedVary)
  } else {
    // No cookie section exists, add one
    response.headers.set('netlify-vary', `${existingVary},cookie=NEXT_LOCALE|nf_lang`)
  }
  
  return response
}

export default async (request, context) => {
  console.log('running edge function: redirect-from-old-portal')
  console.log('request.url', request.url)

  let url
  try {
    url = new URL(request.url)
  } catch (e) {
    console.error('Failed to parse URL:', e.message)
    const response = await context.next()
    return appendLocaleVaryHeader(response)
  }

  // 1. Hostname Redirect
  // // Redirect from old hostname to new hostname FIRST (before any other checks)
  if (url.hostname === 'newhelp.vtex.com') {
    const newUrl = new URL(request.url)
    newUrl.hostname = 'help.vtex.com'
    return new Response(null, {
      status: 308,
      headers: {
        Location: newUrl.toString(),
        'Cache-Control':
          'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200, immutable',
      },
    })
  }

  // Yield for API calls - they should pass through without interception
  if (url.pathname.startsWith('/api/')) {
    return context.next()
  }

  // Yield for Netlify internal paths (prerender extension, etc.)
  if (
    url.pathname === '/netlify-prerender-function' ||
    url.pathname.startsWith('/.netlify/') ||
    url.pathname.startsWith('/__netlify/')
  ) {
    return context.next()
  }

  // Yield for static files and Next.js internals (no locale vary needed)
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.match(/\.(json|ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return context.next()
  }

  // 3. HOME REDIRECT
  if (url.pathname === '/') {
    const nextLocaleCookie = context.cookies.get("NEXT_LOCALE")
    const netlifyCookie = context.cookies.get("nf_lang")
    const headerLocale = getLocaleFromHeader(request.headers.get("accept-language"))

    // Prioridade total para o que o usuário já escolheu ou o navegador diz
    const preferredLocale = nextLocaleCookie || netlifyCookie || headerLocale || 'pt'

    if (preferredLocale !== 'en') {
      return new Response(null, {
        status: 307,
        headers: { Location: new URL(`/${preferredLocale}`, url.origin).toString() },
      })
    }
    const homeResponse = await context.next()
    return appendLocaleVaryHeader(homeResponse)
  }

  // Yield for pure locale routes (e.g., /pt, /es, /en) - let Next.js handle i18n
  if (url.pathname.match(/^\/(?:en|pt|es)\/?$/)) {
    const localeRootResponse = await context.next()
    return appendLocaleVaryHeader(localeRootResponse)
  }


  // 5. LÓGICA DE REDIRECIONAMENTO LEGADO
  const search = url.search ? url.search : '' // preserve query string

  let destination

  // First, check for hardcoded redirects in redirects.json
  const redirectResult = await checkRedirects(url)
  if (redirectResult) {
    if (
      redirectResult.startsWith('http://') ||
      redirectResult.startsWith('https://')
    ) {
      return new Response(null, {
        status: 308,
        headers: {
          Location: redirectResult,
          'Cache-Control':
            'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200, immutable',
        },
      })
    } else {
      console.log('legacy redirect found:', redirectResult)
      url.pathname = redirectResult
      destination = redirectResult
    }
  }

  // Match patterns:
  // /<locale>/{type}/{slug}[--<key>]
  // /{type}/{slug}[--<key>]
  // First, try to safely decode the pathname to handle malformed encodings
  let decodedPathname
  try {
    decodedPathname = safeDecodeURIComponent(url.pathname)
  } catch (e) {
    console.error('Failed to decode pathname:', e.message)
    decodedPathname = url.pathname
  }

  const match = decodedPathname.match(
    /^(?:\/(?<locale>en|pt|es))?\/(?<type>tutorial|announcements|known-issues|tracks|faq|subcategory|category)\/(?<slug>[^/]+?)(?:--[^/]+)?(?:\/[^/]+)?$/
  )

  if (match && match.groups) {
    console.log('match found')
    const cookieLocale = context.cookies.get("NEXT_LOCALE") || context.cookies.get("nf_lang")
    const headerLocale = getLocaleFromHeader(request.headers.get("accept-language"))
    const locale = match.groups.locale || cookieLocale || headerLocale || 'en'

    const type = match.groups.type // "tutorial", "tracks", "faq"
    // Normalize the slug to remove accents for matching
    const rawSlug = match.groups.slug
    const slug = normalizeString(rawSlug) // clean slug without accents
    console.log('locale', locale)
    console.log('type', type)
    console.log('slug', slug)
    console.log('search', search)

    // Skip modern paths that don't need redirecting
    if (type === 'announcements' && (slug.match(/^\d{4}-\d{2}-\d{2}-/)) || slug.match(/\d{4}/) || slug.match(/\d{4}-\w+/)) {
      console.log('Modern announcement detected (date-prefixed), skipping redirect')
      const annResponse = await context.next()
      return appendLocaleVaryHeader(annResponse)
    }
    if (type === 'faq' && !url.pathname.match(/--[^/]+/)) {
      console.log('Modern FAQ detected (no article key), skipping redirect')
      const faqResponse = await context.next()
      return appendLocaleVaryHeader(faqResponse)
    }
    if (type === 'known-issues' && !url.pathname.match(/--[^/]+/) && !slug.startsWith('ki--')) {
      console.log('Modern known-issue detected (no article key, not ki-- format), skipping redirect')
      const kiResponse = await context.next()
      return appendLocaleVaryHeader(kiResponse)
    }

    if (type === 'tutorial') {
      destination = `/${locale}/docs/tutorials/${slug}`
    } else if (type === 'subcategory') {
      const suffix = getLocalizedSuffix('subcategory', locale)
      destination = `/${locale}/docs/tutorials/${slug}${suffix}`
    } else if (type === 'category') {
      const suffix = getLocalizedSuffix('category', locale)
      destination = `/${locale}/docs/tutorials/${slug}${suffix}`
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
      // Check navigation.json for FAQs to find the locale-specific slug
      console.log('checking navigation.json for faq slug')
      const nav = await getNavigation(url)
      const newSlug = findFaqSlug(nav, slug, locale)
      if (!newSlug) {
        // fallback: if navigation.json doesn't have it, use original slug
        console.log('using original slug:', slug)
        destination = `/${locale}/faq/${slug}`
      } else {
        destination = `/${locale}/faq/${newSlug}`
      }
    } else if (type === 'announcements') {
      // Always check navigation.json for announcements to find the modern slug.
      // Even if redirects.json set a destination, we need navigation.json to
      // resolve the final date-prefixed slug (e.g., 2020-10-29-...).
      // This handles redirect cascades: redirects.json → navigation.json
      console.log('checking navigation.json for announcement slug')
      const nav = await getNavigation(url)
      const newSlug = findAnnouncementSlug(nav, slug, locale)
      if (!newSlug) {
        // fallback: if navigation.json doesn't have it, use destination from
        // redirects.json or simple path transformation
        if (destination) {
          console.log('using destination from redirects.json:', destination)
        } else {
          destination = `/${locale}/announcements/${slug}`
        }
      } else {
        destination = `/${locale}/announcements/${newSlug}`
      }
    }
  }

  if (destination) {
    console.log('destination', destination)

    return new Response(null, {
      status: 308,
      headers: {
        Location: new URL(destination + search, url.origin).toString(),
        'Cache-Control':
          'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200, immutable',
      },
    })
  }

  const finalResponse = await context.next()
  return appendLocaleVaryHeader(finalResponse)
}

let navigationCache = null
let redirectsMapCache = null

async function getNavigation(url) {
  if (!navigationCache) {
    const res = await fetch(`${url.origin}/api/navigation`)
    if (!res.ok) {
      console.error(
        `Failed to fetch navigation API: ${res.status} ${res.statusText}`
      )
      // Fallback to direct navigation.json fetch
      const fallbackRes = await fetch(`${url.origin}/navigation.json`)
      navigationCache = await fallbackRes.json()
    } else {
      navigationCache = await res.json()
    }
  }
  return navigationCache
}

function getRedirectsMap() {
  if (!redirectsMapCache) {
    const redirectsMap = new Map()

    if (redirectsData.redirects) {
      for (const redirectArray of Object.values(redirectsData.redirects)) {
        if (Array.isArray(redirectArray)) {
          for (const redirect of redirectArray) {
            redirectsMap.set(redirect.from, redirect.to)
          }
        }
      }
    }

    redirectsMapCache = redirectsMap
  }
  return redirectsMapCache
}

// Helper function to get localized suffix for category/subcategoryy
function getLocalizedSuffix(type, locale) {
  const suffixes = {
    category: { en: '-category', pt: '-categoria', es: '-categoria' },
    subcategory: { en: '-subcategory', pt: '-subcategoria', es: '-subcategoria' }
  }
  return suffixes[type]?.[locale] || suffixes[type].en // fallback to EN
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

// Helper function to check if path has article key
function hasArticleKey(path) {
  return /--[^/]+$/.test(path)
}

// Helper function to remove article key from path
function removeArticleKey(path) {
  return path.replace(/--[^/]+$/, '')
}

// Helper function to extract base path (everything before the article key)
function getBasePath(path) {
  return hasArticleKey(path) ? removeArticleKey(path) : path
}

// Helper function to find matching redirect entry by base path
function findRedirectByBasePath(redirectsMap, basePath) {
  // Normalize the basePath for comparison
  const normalizedBasePath = normalizeString(basePath)

  // Look for any key in the map that:
  // 1. Matches the base path exactly, OR
  // 2. Matches after normalization (removing accents), OR
  // 3. Starts with base path followed by "--"
  for (const [key, value] of redirectsMap.entries()) {
    const keyBasePath = getBasePath(key)
    if (keyBasePath === basePath || normalizeString(keyBasePath) === normalizedBasePath) {
      console.log(`Fuzzy match found: ${key} matches base path ${basePath}`)
      return value
    }
  }
  return null
}

async function checkRedirects(url) {
  try {
    const redirectsMap = getRedirectsMap()

    // Safely decode the pathname to handle malformed encodings
    let currentPath
    try {
      currentPath = safeDecodeURIComponent(url.pathname)
    } catch {
      currentPath = url.pathname
    }

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

      // First try exact O(1) Map lookup
      let redirectTo = redirectsMap.get(currentPath)

      // If no exact match, try with normalized path (no accents)
      if (!redirectTo) {
        const normalizedPath = normalizeString(currentPath)
        if (normalizedPath !== currentPath) {
          redirectTo = redirectsMap.get(normalizedPath)
          if (redirectTo) {
            console.log(`Normalized match found: ${currentPath} -> ${normalizedPath}`)
          }
        }
      }

      // If no exact match, try fuzzy match by base path
      if (!redirectTo) {
        const basePath = getBasePath(currentPath)
        if (basePath !== currentPath) {
          console.log(`Trying fuzzy match for base path: ${basePath}`)
        }
        redirectTo = findRedirectByBasePath(redirectsMap, basePath)
      }

      if (!redirectTo) {
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
      } else {
        console.log(`Redirect found: ${currentPath} -> ${redirectTo}`)
        return redirectTo
      }
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

function findFaqSlug(nav, oldSlug, locale) {
  // Locate FAQ block
  const faqSection = nav.navbar.find(
    (item) => item.documentation === 'faq'
  )
  if (!faqSection) return null

  // Traverse recursively
  function search(children) {
    for (const child of children) {
      if (child.type === 'markdown' && child.slug) {
        // Check if any locale's slug matches the old slug
        for (const slugValue of Object.values(child.slug)) {
          if (slugValue === oldSlug) {
            // Found a match, return the slug for the requested locale
            return child.slug[locale] || child.slug.en
          }
        }
      }
      const found = search(child.children || [])
      if (found) return found
    }
    return null
  }

  return search(faqSection.categories || [])
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
        `Failed to fetch ki mapping from all CDNs: ${lastError?.message || 'Unknown error'
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

function getLocaleFromHeader(header) {
  if (!header) return null
  // Ex: "pt-BR,pt;q=0.9,en-US;q=0.8" -> ["pt", "en"]
  const locales = header.split(',').map(l => l.split(';')[0].split('-')[0].trim())
  const supported = ['pt', 'es', 'en']
  return locales.find(l => supported.includes(l))
}