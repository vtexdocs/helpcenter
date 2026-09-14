/**
 * Parse `/_next/data/{build}/(pt|es)/...json` and rebuild the HTML path.
 * English data URLs have no locale segment and must not be intercepted —
 * they are the files Netlify already serves correctly.
 */

export function parsePrefixedNextDataPath(pathname) {
  const match = pathname.match(
    /^\/_next\/data\/[^/]+\/(pt|es)(?:\/(.*))?\.json$/
  )
  if (!match) {
    return null
  }
  const locale = match[1]
  const rest = match[2] || ''
  return { locale, rest }
}

export function htmlPathFromPrefixedNextData(pathname) {
  const parsed = parsePrefixedNextDataPath(pathname)
  if (!parsed) {
    return null
  }
  const { locale, rest } = parsed
  if (!rest) {
    return `/${locale}`
  }
  return `/${locale}/${rest}`
}

export function servedLocaleFromPageData(data) {
  const pageProps = data?.pageProps
  if (!pageProps || typeof pageProps !== 'object') {
    return null
  }
  const locale = pageProps.locale
  if (locale === 'en' || locale === 'pt' || locale === 'es') {
    return locale
  }
  const filePath =
    pageProps.componentProps?.path || pageProps.path || pageProps.mdFilePath
  const match = String(filePath || '').match(/(?:^|\/)docs\/(en|pt|es)\//)
  return match ? match[1] : null
}

/**
 * Shared slugs are the only case where Netlify returns English JSON for a
 * pt/es data URL. Unique-locale slugs already have the right static file.
 */
export function shouldRebuildPrefixedData(urlLocale, data) {
  const servedLocale = servedLocaleFromPageData(data)
  return Boolean(servedLocale && servedLocale !== urlLocale)
}

export function isNextPageDataPayload(data) {
  return Boolean(data && typeof data === 'object' && data.pageProps)
}

export function pageDataFromHtml(html) {
  const idIndex = html.indexOf('id="__NEXT_DATA__"')
  if (idIndex === -1) {
    return null
  }
  const openEnd = html.indexOf('>', idIndex)
  if (openEnd === -1) {
    return null
  }
  const jsonStart = openEnd + 1
  const jsonEnd = html.indexOf('</script>', jsonStart)
  if (jsonEnd === -1) {
    return null
  }
  try {
    const nextData = JSON.parse(html.slice(jsonStart, jsonEnd))
    const pageProps = nextData?.props?.pageProps
    if (!pageProps || typeof pageProps !== 'object') {
      return null
    }
    const payload = {
      pageProps,
      __N_SSG: nextData.gsp !== false,
    }
    if (nextData.props?.__N_SSP) {
      payload.__N_SSP = true
      delete payload.__N_SSG
    }
    return payload
  } catch {
    return null
  }
}
