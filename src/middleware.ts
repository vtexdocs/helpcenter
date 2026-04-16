import { NextRequest, NextResponse } from 'next/server'
import { isbot } from 'isbot'
import { isSearchEngineBot } from './utils/searchEngineBotsWhitelist'

export const config = {
  matcher: [
    '/docs/tutorials/:path*',
    '/docs/tracks/:path*',
    '/announcements/:path*',
    '/faq/:path*',
    '/known-issues/:path*',
    '/troubleshooting/:path*',
    '/_next/data/:buildId/:locale/docs/tutorials/:slug*.json',
    '/_next/data/:buildId/:locale/docs/tracks/:slug*.json',
    '/_next/data/:buildId/:locale/announcements/:slug*.json',
    '/_next/data/:buildId/:locale/faq/:slug*.json',
    '/_next/data/:buildId/:locale/known-issues/:slug*.json',
    '/_next/data/:buildId/:locale/troubleshooting/:slug*.json',
  ],
}

const shouldLogBotHandling =
  (process.env.ENABLE_BOT_MIDDLEWARE_LOGS ?? 'true') !== 'false'

const shouldLogLocaleRouting =
  (process.env.ENABLE_LOCALE_ROUTING_LOGS ?? 'false') === 'true'

function parsePathToSectionAndSlug(
  pathname: string,
  locale: string
): { section: string; slug: string; locale: string } | null {
  const patterns = [
    /^\/docs\/(tutorials|tracks)\/([^/]+)(?:\/|$)/,
    /^\/(announcements|faq|known-issues|troubleshooting)\/([^/]+)(?:\/|$)/,
  ]

  for (const pattern of patterns) {
    const match = pathname.match(pattern)
    if (match) {
      return { section: match[1], slug: match[2], locale }
    }
  }

  return null
}

function parseNextDataPath(pathname: string): {
  locale: string
  section: string
  slug: string
  buildId: string
} | null {
  const docsPattern =
    /^\/_next\/data\/([^/]+)\/(en|pt|es)\/docs\/(tutorials|tracks)\/([^/]+)\.json$/
  const otherPattern =
    /^\/_next\/data\/([^/]+)\/(en|pt|es)\/(announcements|faq|known-issues|troubleshooting)\/([^/]+)\.json$/

  let match = pathname.match(docsPattern)
  if (match) {
    return {
      buildId: match[1],
      locale: match[2],
      section: match[3],
      slug: match[4],
    }
  }

  match = pathname.match(otherPattern)
  if (match) {
    return {
      buildId: match[1],
      locale: match[2],
      section: match[3],
      slug: match[4],
    }
  }

  return null
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const userAgent = request.headers.get('user-agent')

  if (pathname.startsWith('/_next/data/')) {
    return handleNextDataRequest(request)
  }

  return handleBotDetection(request, userAgent)
}

/**
 * For _next/data requests, ensure the locale from the URL path is properly
 * propagated to the request. This works around Netlify's i18n routing bug
 * where it incorrectly routes locale-specific slugs to the default locale handler.
 */
function handleNextDataRequest(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname
  const parsed = parseNextDataPath(pathname)

  if (!parsed) {
    return NextResponse.next()
  }

  const { locale: urlLocale, slug, section } = parsed

  if (shouldLogLocaleRouting) {
    console.info('[locale-routing] Processing _next/data request', {
      pathname,
      urlLocale,
      slug,
      section,
    })
  }

  const sectionPath =
    section === 'tutorials' || section === 'tracks'
      ? `/docs/${section}`
      : `/${section}`

  const rewriteUrl = new URL(request.url)
  rewriteUrl.pathname = `/${urlLocale}${sectionPath}/${slug}`
  rewriteUrl.searchParams.set('__nextDataReq', '1')

  if (shouldLogLocaleRouting) {
    console.info('[locale-routing] Rewriting to ensure correct locale', {
      from: pathname,
      to: rewriteUrl.pathname,
      urlLocale,
    })
  }

  const response = NextResponse.rewrite(rewriteUrl)
  response.headers.set('X-Locale-Routing-Fix', 'rewrite-applied')
  response.headers.set('X-URL-Locale', urlLocale)
  response.headers.set('X-Original-Path', pathname)

  return response
}

function handleBotDetection(
  request: NextRequest,
  userAgent: string | null
): NextResponse {
  if (!isbot(userAgent)) {
    return NextResponse.next()
  }

  if (isSearchEngineBot(userAgent)) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname
  const locale = request.nextUrl.locale || 'en'

  if (shouldLogBotHandling) {
    console.info('[bot-middleware] AI bot detected, attempting rewrite', {
      pathname,
      locale,
      userAgent,
    })
  }

  const parsed = parsePathToSectionAndSlug(pathname, locale)

  if (!parsed) {
    if (shouldLogBotHandling) {
      console.info(
        '[bot-middleware] AI bot path parsing failed, serving HTML fallback',
        { pathname, locale, userAgent }
      )
    }
    return NextResponse.next()
  }

  const { section, slug } = parsed

  if (shouldLogBotHandling) {
    console.info('[bot-middleware] AI bot rewrite to LLM content', {
      section,
      slug,
      locale,
      userAgent,
    })
  }

  const llmUrl = new URL(
    `/api/llm-content?section=${encodeURIComponent(
      section
    )}&locale=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}`,
    request.url
  )

  const response = NextResponse.rewrite(llmUrl)
  response.headers.set('X-Bot-Detection', 'ai-bot-detected')
  if (userAgent) {
    response.headers.set('X-Bot-User-Agent', userAgent)
  }
  response.headers.set('X-Bot-Section', section)
  response.headers.set('X-Bot-Slug', slug)

  return response
}
