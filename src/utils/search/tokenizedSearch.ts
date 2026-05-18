/** Stopwords por idioma base (pt/en/es), alinhado à busca de Known Issues. */
export const STOPWORDS_BY_LOCALE: Record<string, Set<string>> = {
  pt: new Set([
    'a',
    'ao',
    'aos',
    'as',
    'à',
    'às',
    'com',
    'da',
    'das',
    'de',
    'do',
    'dos',
    'e',
    'em',
    'na',
    'nas',
    'no',
    'nos',
    'ou',
    'para',
    'por',
    'sem',
  ]),
  en: new Set([
    'a',
    'an',
    'and',
    'as',
    'at',
    'by',
    'for',
    'from',
    'in',
    'is',
    'of',
    'on',
    'or',
    'the',
    'to',
    'with',
    'it',
  ]),
  es: new Set([
    'a',
    'al',
    'con',
    'de',
    'del',
    'el',
    'en',
    'es',
    'la',
    'las',
    'los',
    'o',
    'para',
    'por',
    'un',
    'una',
    'y',
    'lo',
  ]),
}

export function getStopwordSet(locale: string): Set<string> {
  const localeKey = (locale ?? 'pt').split('-')[0]
  return STOPWORDS_BY_LOCALE[localeKey] ?? STOPWORDS_BY_LOCALE.pt
}

/**
 * Normaliza a busca, remove aspas tipográficas, divide em termos e remove stopwords.
 */
export function getSearchTerms(rawSearch: string, locale: string): string[] {
  const normalized = rawSearch.toLowerCase()
  const stopwords = getStopwordSet(locale)
  return normalized
    .replace(/["'\u201C\u201D\u2018\u2019]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((term) => term && !stopwords.has(term))
}

/** `fields` devem estar em minúsculas. */
export function termMatchesInFields(term: string, fields: string[]): boolean {
  return fields.some((field) => field.includes(term))
}

/** Equivalente ao hasSearch de Known Issues: sem termos = tudo passa; senão basta um termo bater em qualquer campo. */
export function itemMatchesAnyTerm(terms: string[], fields: string[]): boolean {
  if (terms.length === 0) return true
  return terms.some((term) => termMatchesInFields(term, fields))
}

/** Conta quantos termos da busca aparecem em qualquer um dos campos (no máximo um ponto por termo). */
export function countTermMatches(terms: string[], fields: string[]): number {
  if (terms.length === 0) return 0
  return terms.reduce(
    (count, term) => count + (termMatchesInFields(term, fields) ? 1 : 0),
    0
  )
}
