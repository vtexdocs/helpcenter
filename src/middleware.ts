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
  ],
}
const shouldLogBotHandling =
  (process.env.ENABLE_BOT_MIDDLEWARE_LOGS ?? 'true') !== 'false'

/**
 * Extract section and slug from the URL pathname.
 *
 * Examples:
 * - /docs/tutorials/getting-started -> { section: 'tutorials', slug: 'getting-started', locale: 'en' }
 * - /pt/docs/tracks/my-track -> { section: 'tracks', slug: 'my-track', locale: 'pt' }
 */
function parsePathToSectionAndSlug(
  pathname: string,
  locale: string
): { section: string; slug: string; locale: string } | null {
  // Match patterns like:
  // /docs/tutorials/slug
  // /docs/tracks/slug
  // /announcements/slug
  // /faq/slug
  // /known-issues/slug
  // /troubleshooting/slug

  const patterns = [
    /^\/docs\/(tutorials|tracks)\/([^/]+)(?:\/|$)/,
    /^\/(announcements|faq|known-issues|troubleshooting)\/([^/]+)(?:\/|$)/,
  ]

  for (const pattern of patterns) {
    const match = pathname.match(pattern)
    if (match) {
      return {
        section: match[1],
        slug: match[2],
        locale,
      }
    }
  }

  return null
}

/**
 * Middleware to detect AI bots and serve markdown instead of HTML,
 * while preserving search engine bot access to HTML for SEO.
 */
export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')

  // Check if this is a bot at all
  if (!isbot(userAgent)) {
    // Not a bot, let it through (regular user)
    return NextResponse.next()
  }

  // It's a bot. Check if it's a search engine that needs HTML for SEO.
  if (isSearchEngineBot(userAgent)) {
    // Search engine bot (Google, Bing, etc.) - serve HTML normally
    return NextResponse.next()
  }

  // It's an AI bot or other non-search bot. Try to rewrite to LLM API endpoint.
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
        {
          pathname,
          locale,
          userAgent,
        }
      )
    }
    // Could not parse the path, let it through
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

  // Construct the LLM API URL with query parameters
  const llmUrl = new URL(
    `/api/llm-content?section=${encodeURIComponent(
      section
    )}&locale=${encodeURIComponent(locale)}&slug=${encodeURIComponent(slug)}`,
    request.url
  )

  // Rewrite (not redirect) to the LLM API endpoint
  // This keeps the same URL in the browser while serving different content
  const response = NextResponse.rewrite(llmUrl)

  // Add a debug header to indicate this request was handled by bot detection middleware
  response.headers.set('X-Bot-Detection', 'ai-bot-detected')
  if (userAgent) {
    response.headers.set('X-Bot-User-Agent', userAgent)
  }
  response.headers.set('X-Bot-Section', section)
  response.headers.set('X-Bot-Slug', slug)

  return response
}
