export const ALLOWED_LOCALES = ['en', 'es', 'pt'] as const
export type AllowedLocale = (typeof ALLOWED_LOCALES)[number]

export const safeDecodeURIComponent = (str: string): string => {
  try {
    return decodeURIComponent(str)
  } catch {
    try {
      return decodeURIComponent(
        str.replace(/%([0-9A-Fa-f]{2})/g, (_, hex: string) => {
          const charCode = parseInt(hex, 16)
          if (charCode >= 128 && charCode <= 255) {
            return encodeURIComponent(String.fromCharCode(charCode))
          }
          return `%${hex}`
        })
      )
    } catch {
      return str
    }
  }
}

export const extractLocaleFromPath = (
  pathname: string
): AllowedLocale | null => {
  const segments = pathname.split('/').filter(Boolean)
  if (
    segments.length > 0 &&
    ALLOWED_LOCALES.includes(segments[0] as AllowedLocale)
  ) {
    return segments[0] as AllowedLocale
  }
  return null
}

export const removeLocaleFromPath = (pathname: string): string => {
  const currentLocale = extractLocaleFromPath(pathname)
  if (currentLocale) {
    return pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/'
  }
  return pathname
}

export const setLocaleCookies = (locale: string): void => {
  const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`
  document.cookie = `nf_lang=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`
}
