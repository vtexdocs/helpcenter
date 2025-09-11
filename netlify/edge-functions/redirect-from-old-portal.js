export default async (request, context) => {
  const url = new URL(request.url)

  const match = url.pathname.match(/^\/([^/]+\/)?tutorial\/([^/]+?)(--[^/]+)?$/)

  if (match) {
    const maybeLocale = match[1] || ''
    const slug = match[2]

    const locale = maybeLocale.replace('/', '') || 'en'

    const destination = `/${locale}/docs/tutorials/${slug}`

    return Response.redirect(new URL(destination, url.origin), 308)
  }

  return context.next()
}
