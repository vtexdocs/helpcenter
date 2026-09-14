import {
  htmlPathFromPrefixedNextData,
  isLocaleRedirectPayload,
  isNextPageDataPayload,
  isRedirectStatus,
  pageDataFromHtml,
  parsePrefixedNextDataPath,
  shouldRebuildPrefixedData,
} from '../../../netlify/edge-functions/lib/next-data-locale.js'

describe('parsePrefixedNextDataPath', () => {
  it('parses a pt article data URL', () => {
    expect(
      parsePrefixedNextDataPath(
        '/_next/data/build-1/pt/docs/tracks/amazon.json'
      )
    ).toEqual({ locale: 'pt', rest: 'docs/tracks/amazon' })
  })

  it('parses a locale-only data URL', () => {
    expect(parsePrefixedNextDataPath('/_next/data/build-1/pt.json')).toEqual({
      locale: 'pt',
      rest: '',
    })
  })

  it('ignores english unprefixed data URLs', () => {
    expect(
      parsePrefixedNextDataPath('/_next/data/build-1/docs/tracks/amazon.json')
    ).toBeNull()
  })
})

describe('htmlPathFromPrefixedNextData', () => {
  it('maps pt amazon data onto the working HTML route', () => {
    expect(
      htmlPathFromPrefixedNextData(
        '/_next/data/build-1/pt/docs/tracks/amazon.json'
      )
    ).toBe('/pt/docs/tracks/amazon')
  })

  it('maps es index data onto /es/docs/tracks', () => {
    expect(
      htmlPathFromPrefixedNextData('/_next/data/build-1/es/docs/tracks.json')
    ).toBe('/es/docs/tracks')
  })
})

describe('pageDataFromHtml', () => {
  it('extracts pageProps from __NEXT_DATA__', () => {
    const html = `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(
      {
        gsp: true,
        props: {
          pageProps: {
            locale: 'pt',
            path: 'docs/pt/tracks/Stores/Amazon/amazon.md',
          },
        },
      }
    )}</script></html>`

    expect(pageDataFromHtml(html)).toEqual({
      pageProps: {
        locale: 'pt',
        path: 'docs/pt/tracks/Stores/Amazon/amazon.md',
      },
      __N_SSG: true,
    })
  })

  it('parses pageProps that contain HTML', () => {
    const html = `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(
      {
        gsp: true,
        props: { pageProps: { content: '<p>Amazon</p>' } },
      }
    )}</script></html>`

    expect(pageDataFromHtml(html)).toEqual({
      pageProps: { content: '<p>Amazon</p>' },
      __N_SSG: true,
    })
  })

  it('returns null when the script is missing', () => {
    expect(pageDataFromHtml('<html></html>')).toBeNull()
  })
})

describe('shouldRebuildPrefixedData', () => {
  it('skips unique-locale JSON that already matches the URL', () => {
    expect(
      shouldRebuildPrefixedData('pt', {
        pageProps: { locale: 'pt', path: 'docs/pt/tracks/foo.md' },
      })
    ).toBe(false)
  })

  it('rebuilds when a shared slug was served as English', () => {
    expect(
      shouldRebuildPrefixedData('pt', {
        pageProps: {
          locale: 'en',
          path: 'docs/en/tracks/Stores/Amazon/amazon.md',
        },
      })
    ).toBe(true)
  })

  it('does not rebuild when locale cannot be inferred', () => {
    expect(shouldRebuildPrefixedData('pt', { pageProps: {} })).toBe(false)
  })

  it('rebuilds when GSP redirected a PT+ES slug to the English sibling', () => {
    expect(
      shouldRebuildPrefixedData('pt', {
        pageProps: {
          __N_REDIRECT: '/docs/tracks/installing-customer-credit',
          __N_REDIRECT_STATUS: 308,
        },
      })
    ).toBe(true)
    expect(
      shouldRebuildPrefixedData('es', {
        __N_REDIRECT: '/en/docs/tracks/installing-customer-credit',
        pageProps: {},
      })
    ).toBe(true)
  })

  it('rebuilds when the English handler returned notFound', () => {
    expect(shouldRebuildPrefixedData('pt', { notFound: true })).toBe(true)
  })
})

describe('isLocaleRedirectPayload', () => {
  it('detects Next data redirects', () => {
    expect(
      isLocaleRedirectPayload({
        pageProps: { __N_REDIRECT: '/docs/tracks/installing-customer-credit' },
      })
    ).toBe(true)
    expect(isLocaleRedirectPayload({ pageProps: { locale: 'pt' } })).toBe(false)
  })
})

describe('isRedirectStatus', () => {
  it('matches 3xx only', () => {
    expect(isRedirectStatus(307)).toBe(true)
    expect(isRedirectStatus(308)).toBe(true)
    expect(isRedirectStatus(200)).toBe(false)
    expect(isRedirectStatus(404)).toBe(false)
  })
})

describe('isNextPageDataPayload', () => {
  it('accepts Next data JSON and rejects llm-content JSON', () => {
    expect(isNextPageDataPayload({ pageProps: { locale: 'pt' } })).toBe(true)
    expect(
      isNextPageDataPayload({
        section: 'tracks',
        requestedLocale: 'es',
        content: 'Amazon',
      })
    ).toBe(false)
  })
})
