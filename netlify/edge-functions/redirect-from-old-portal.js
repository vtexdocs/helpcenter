export default async (request, context) => {
  console.log('running edge function: redirect-from-old-portal')
  console.log('request.url', request.url)

  const url = new URL(request.url)

  // Match patterns:
  // /<locale>/{type}/{slug}[--<key>]
  // /{type}/{slug}[--<key>]
  const match = url.pathname.match(
    /^(?:\/(?<locale>[a-z]{2}))?\/(?<type>tutorial|announcements|tracks|faq)\/(?<slug>[^/]+?)(?:--[^/]+)?$/
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
    } else if (type === 'faq') {
      destination = `/${locale}/faq/${slug}`
    } else if (type === 'announcements') {
      const nav = await getNavigation(url)
      const newSlug = findAnnouncementSlug(nav, slug, finalLocale)
      if (!newSlug) {
        // fallback: keep old slug
        destination = `/${finalLocale}/announcements/${slug}`
      } else {
        destination = `/${finalLocale}/announcements/${newSlug}`
      }
    }

    console.log('destination', destination)

    return Response.redirect(new URL(destination + search, url.origin), 308)
  }

  return context.next()
}

let navigationCache = null

async function getNavigation(url) {
  if (!navigationCache) {
    const res = await fetch(`${url.origin}/navigation.json`)
    navigationCache = await res.json()
  }
  return navigationCache
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
