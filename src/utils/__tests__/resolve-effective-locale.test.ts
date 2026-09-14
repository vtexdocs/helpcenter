import { resolveEffectiveLocale } from '../article-page/resolveEffectiveLocale'

describe('resolveEffectiveLocale', () => {
  it('keeps the requested locale when the slug exists in that locale', () => {
    const result = resolveEffectiveLocale({
      currentLocale: 'pt',
      mdFileExists: true,
      mdFileExistsForCurrentLocale: true,
      docsPathsForSlug: [
        { locale: 'en', path: 'docs/en/tracks/amazon.md' },
        { locale: 'es', path: 'docs/es/tracks/amazon.md' },
        { locale: 'pt', path: 'docs/pt/tracks/amazon.md' },
      ],
      categoryLocales: [],
    })

    expect(result.effectiveLocale).toBe('pt')
    expect(result.effectiveMdFilePath).toBeUndefined()
  })

  it('does not pick the first locale when en/es/pt share a slug', () => {
    const result = resolveEffectiveLocale({
      currentLocale: 'pt',
      mdFileExists: true,
      mdFileExistsForCurrentLocale: false,
      docsPathsForSlug: [
        { locale: 'en', path: 'docs/en/tracks/amazon.md' },
        { locale: 'es', path: 'docs/es/tracks/amazon.md' },
        { locale: 'pt', path: 'docs/pt/tracks/amazon.md' },
      ],
      categoryLocales: [],
    })

    expect(result.effectiveLocale).toBe('pt')
  })

  it('overrides only when the slug belongs to exactly one other locale', () => {
    const result = resolveEffectiveLocale({
      currentLocale: 'en',
      mdFileExists: true,
      mdFileExistsForCurrentLocale: false,
      docsPathsForSlug: [
        { locale: 'pt', path: 'docs/pt/tracks/meu-artigo.md' },
      ],
      categoryLocales: [],
    })

    expect(result.effectiveLocale).toBe('pt')
    expect(result.effectiveMdFilePath).toBe('docs/pt/tracks/meu-artigo.md')
  })

  it('does not override category covers that exist in multiple locales', () => {
    const result = resolveEffectiveLocale({
      currentLocale: 'pt',
      mdFileExists: false,
      mdFileExistsForCurrentLocale: false,
      categoryLocales: ['es', 'pt'],
    })

    expect(result.effectiveLocale).toBe('pt')
  })

  it('overrides category covers that belong to exactly one other locale', () => {
    const result = resolveEffectiveLocale({
      currentLocale: 'en',
      mdFileExists: false,
      mdFileExistsForCurrentLocale: false,
      categoryLocales: ['pt'],
    })

    expect(result.effectiveLocale).toBe('pt')
  })
})
