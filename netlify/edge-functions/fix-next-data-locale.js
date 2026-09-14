import {
  htmlPathFromPrefixedNextData,
  isNextPageDataPayload,
  pageDataFromHtml,
  parsePrefixedNextDataPath,
  shouldRebuildPrefixedData,
} from './lib/next-data-locale.js'

const INTERNAL_HTML_FETCH_HEADER = 'x-internal-html-fetch'

/**
 * Netlify serves `/_next/data/{build}/pt/docs/tracks/amazon.json` from the
 * English static file when the slug also exists in the default locale.
 * Unique pt/es slugs already have the right JSON — pass those through.
 * Shared slugs are rebuilt from the working HTML `__NEXT_DATA__`.
 *
 * The HTML fetch must skip bot middleware: Netlify fetch is classified as a
 * bot and would otherwise return `/api/llm-content` JSON, which Next treats
 * as a failed data route (client 500).
 */
export default async (request, context) => {
  const url = new URL(request.url)
  if (url.hostname === 'newhelp.vtex.com') {
    const canonical = new URL(request.url)
    canonical.hostname = 'help.vtex.com'
    return Response.redirect(canonical, 308)
  }

  const parsed = parsePrefixedNextDataPath(url.pathname)
  if (!parsed) {
    return context.next()
  }

  let originRes
  try {
    originRes = await context.next()
  } catch {
    originRes = null
  }

  if (originRes) {
    const originType = originRes.headers.get('content-type') || ''
    if (originType.includes('application/json')) {
      let data
      try {
        data = await originRes.clone().json()
      } catch {
        return originRes
      }
      if (!isNextPageDataPayload(data)) {
        return originRes
      }
      if (!shouldRebuildPrefixedData(parsed.locale, data)) {
        return jsonFromValue(data, originRes, 'origin-ok')
      }
    } else {
      return originRes
    }
  }

  const rebuilt = await rebuildFromHtml(url, parsed.locale, request)
  if (rebuilt) {
    return rebuilt
  }

  return originRes || context.next()
}

async function rebuildFromHtml(url, locale, request) {
  const pagePath = htmlPathFromPrefixedNextData(url.pathname)
  if (!pagePath) {
    return null
  }

  const pageUrl = new URL(pagePath, url.origin)
  pageUrl.search = url.search

  const headers = new Headers()
  headers.set('accept', 'text/html')
  headers.set(INTERNAL_HTML_FETCH_HEADER, '1')
  headers.set(
    'user-agent',
    request.headers.get('user-agent') ||
      'Mozilla/5.0 (compatible; HelpCenterLocaleFix/1.0)'
  )
  const cookie = request.headers.get('cookie')
  if (cookie) {
    headers.set('cookie', cookie)
  }

  let pageRes
  try {
    pageRes = await fetch(pageUrl, { headers, redirect: 'follow' })
  } catch {
    return null
  }

  if (!pageRes.ok) {
    return null
  }

  const contentType = pageRes.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    let data
    try {
      data = await pageRes.json()
    } catch {
      return null
    }
    if (
      isNextPageDataPayload(data) &&
      !shouldRebuildPrefixedData(locale, data)
    ) {
      return jsonFromValue(data, pageRes, 'origin-json')
    }
    return null
  }

  const html = await pageRes.text()
  const payload = pageDataFromHtml(html)
  if (!payload) {
    return null
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: jsonResponseHeaders(pageRes, 'html-next-data'),
  })
}

function jsonFromValue(data, originRes, via) {
  return new Response(JSON.stringify(data), {
    status: originRes.status,
    headers: jsonResponseHeaders(originRes, via),
  })
}

function jsonResponseHeaders(pageRes, via) {
  const headers = new Headers()
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('x-next-data-locale-fix', via)
  const cacheControl = pageRes.headers.get('cache-control')
  if (cacheControl) {
    headers.set('cache-control', cacheControl)
  }
  const netlifyCdn = pageRes.headers.get('netlify-cdn-cache-control')
  if (netlifyCdn) {
    headers.set('netlify-cdn-cache-control', netlifyCdn)
  }
  return headers
}
