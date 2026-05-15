import { describe, it, expect } from 'vitest'

import {
  safeDecodeURIComponent,
  extractLocaleFromPath,
  removeLocaleFromPath,
  ALLOWED_LOCALES,
} from '../locale-utils'

describe('safeDecodeURIComponent', () => {
  it('decodes standard UTF-8 encoded string', () => {
    expect(safeDecodeURIComponent('%C3%A9')).toBe('é')
  })

  it('returns original string on valid ASCII input', () => {
    expect(safeDecodeURIComponent('hello-world')).toBe('hello-world')
  })

  it('handles Latin-1 encoded characters (charCode 128-255)', () => {
    expect(safeDecodeURIComponent('%E9')).toBe('é')
  })

  it('returns original string when all decoding fails', () => {
    expect(safeDecodeURIComponent('%ZZ%ZZ')).toBe('%ZZ%ZZ')
  })

  it('handles empty string', () => {
    expect(safeDecodeURIComponent('')).toBe('')
  })

  it('decodes multiple encoded characters', () => {
    expect(safeDecodeURIComponent('%C3%A1%C3%A9')).toBe('áé')
  })
})

describe('extractLocaleFromPath', () => {
  it('extracts en from /en/docs/tutorials/foo', () => {
    expect(extractLocaleFromPath('/en/docs/tutorials/foo')).toBe('en')
  })

  it('extracts pt from /pt/faq/bar', () => {
    expect(extractLocaleFromPath('/pt/faq/bar')).toBe('pt')
  })

  it('extracts es from /es/announcements/something', () => {
    expect(extractLocaleFromPath('/es/announcements/something')).toBe('es')
  })

  it('returns null for /docs/tutorials/foo (no locale prefix)', () => {
    expect(extractLocaleFromPath('/docs/tutorials/foo')).toBeNull()
  })

  it('returns null for /fr/docs/foo (unsupported locale)', () => {
    expect(extractLocaleFromPath('/fr/docs/foo')).toBeNull()
  })

  it('returns null for / (root)', () => {
    expect(extractLocaleFromPath('/')).toBeNull()
  })
})

describe('removeLocaleFromPath', () => {
  it('removes /en from /en/docs/tutorials/foo', () => {
    expect(removeLocaleFromPath('/en/docs/tutorials/foo')).toBe(
      '/docs/tutorials/foo'
    )
  })

  it('returns / when path is just /en', () => {
    expect(removeLocaleFromPath('/en')).toBe('/')
  })

  it('returns path unchanged when no locale prefix', () => {
    expect(removeLocaleFromPath('/docs/tutorials/foo')).toBe(
      '/docs/tutorials/foo'
    )
  })
})

describe('ALLOWED_LOCALES', () => {
  it('contains en, es, pt', () => {
    expect(ALLOWED_LOCALES).toEqual(['en', 'es', 'pt'])
  })
})
