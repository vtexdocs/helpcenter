export default async (request, context) => {
  console.log('running edge function: redirect-from-old-portal')
  console.log('request.url', request.url)

  const url = new URL(request.url)

  // Match patterns:
  // /<locale>/{type}/{slug}[--<key>]
  // /{type}/{slug}[--<key>]
  const match = url.pathname.match(
    /^(?:\/(?<locale>[a-z]{2}))?\/(?<type>tutorial|tracks|faq)\/(?<slug>[^/]+?)(?:--[^/]+)?$/
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
      destination = `/${locale}/announcements/${slug}`
    }

    console.log('destination', destination)

    return Response.redirect(new URL(destination + search, url.origin), 308)
  }

  return context.next()
}
