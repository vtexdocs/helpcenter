import { NextRequest, NextResponse } from 'next/server'

const MAPPING_URL =
  'https://raw.githubusercontent.com/vtexdocs/known-issues/main/.github/ki-slugs-and-zendesk-ids.json'

let mappingCache: Array<{
  locale: string
  slug: string
  internalReference: number
}> | null = null

async function getMapping() {
  if (mappingCache) return mappingCache
  try {
    const res = await fetch(MAPPING_URL)
    if (!res.ok) throw new Error('Failed to fetch mapping')
    const json = await res.json()
    mappingCache = Array.isArray(json) ? json : []
  } catch (err) {
    mappingCache = []
    console.error('Error fetching mapping:', err)
  }
  return mappingCache
}

export async function middleware(request: NextRequest) {
  console.log('Middleware running:', request.nextUrl.pathname)
  const { pathname } = request.nextUrl

  // Match /{locale}/known-issues/{internalReference}
  const match = pathname.match(/^\/([a-z]{2})\/known-issues\/(\d+)$/)
  if (match) {
    const locale = match[1]
    const internalReference = Number(match[2])
    const mapping = await getMapping()
    const entry = mapping.find(
      (item) =>
        item.locale === locale && item.internalReference === internalReference
    )

    if (entry) {
      const newPath = `/${locale}/known-issues/${entry.slug}`
      return NextResponse.redirect(new URL(newPath, request.url), 308)
    } else {
      return new NextResponse('Not found', { status: 404 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/([a-z]{2})/known-issues/:internalReference(\\d+)'],
}
