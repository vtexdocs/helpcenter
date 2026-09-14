import { LocaleType } from 'utils/typings/unionTypes'

type DocsPathEntry = { locale: string; path: string }

type ResolveEffectiveLocaleParams = {
  currentLocale: LocaleType
  mdFileExists: boolean
  mdFileExistsForCurrentLocale: boolean
  docsPathsForSlug?: DocsPathEntry[]
  categoryLocales: string[]
}

type ResolveEffectiveLocaleResult = {
  effectiveLocale: LocaleType
  effectiveMdFilePath?: string
}

function isLocaleType(value: string): value is LocaleType {
  return value === 'en' || value === 'pt' || value === 'es'
}

/**
 * Recover the intended locale when Netlify routes a locale-specific slug to
 * the wrong handler. Only override when the slug belongs to exactly one other
 * locale — shared slugs (e.g. amazon in en/es/pt) must keep the requested
 * locale, otherwise picking docsPaths[slug][0] switches PT/ES to English.
 */
export function resolveEffectiveLocale({
  currentLocale,
  mdFileExists,
  mdFileExistsForCurrentLocale,
  docsPathsForSlug,
  categoryLocales,
}: ResolveEffectiveLocaleParams): ResolveEffectiveLocaleResult {
  let effectiveLocale = currentLocale
  let effectiveMdFilePath: string | undefined

  const uniqueSlugLocales = [
    ...new Set((docsPathsForSlug ?? []).map((entry) => entry.locale)),
  ]

  if (
    !mdFileExistsForCurrentLocale &&
    mdFileExists &&
    uniqueSlugLocales.length === 1 &&
    isLocaleType(uniqueSlugLocales[0]) &&
    uniqueSlugLocales[0] !== currentLocale
  ) {
    effectiveLocale = uniqueSlugLocales[0]
    effectiveMdFilePath = docsPathsForSlug?.find(
      (entry) => entry.locale === effectiveLocale
    )?.path
  }

  const uniqueCategoryLocales = [...new Set(categoryLocales)]
  if (
    uniqueCategoryLocales.length === 1 &&
    !uniqueCategoryLocales.includes(currentLocale) &&
    isLocaleType(uniqueCategoryLocales[0])
  ) {
    effectiveLocale = uniqueCategoryLocales[0]
  }

  return { effectiveLocale, effectiveMdFilePath }
}
