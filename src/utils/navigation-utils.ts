export interface LocalizedContent {
  en: string
  pt: string
  es: string
  [key: string]: string
}

export type LocalizedSlug = string | LocalizedContent

export interface NavigationItem {
  name: LocalizedContent
  slug?: LocalizedSlug
  origin?: string
  type?: string
  children?: NavigationItem[]
  documentation?: string
  slugPrefix?: string
  categories?: NavigationItem[]
}

export interface NavigationStructure {
  navbar: NavigationItem[]
}

export type localeType = 'en' | 'pt' | 'es'

// Define a more specific type for the flattened JSON structure
export type FlattenedRecord = Record<
  string,
  string | LocalizedContent | unknown
>

export const flattenJSON = (
  obj: Record<string, unknown> = {},
  res: FlattenedRecord = {},
  extraKey = ''
): FlattenedRecord => {
  for (const key in obj) {
    if (typeof obj[key] !== 'object' || obj[key] === null) {
      res[extraKey + key] = obj[key]
    } else {
      flattenJSON(
        obj[key] as Record<string, unknown>,
        res,
        `${extraKey}${key}.`
      )
    }
  }
  return res
}

export const getKeyByValue = (
  object: Record<string, unknown>,
  value: string
): string | undefined => {
  return Object.keys(object).find((key) => object[key] === value)
}

export const getKeysByValue = (
  object: Record<string, unknown>,
  value: string
): string[] => {
  return Object.keys(object).filter((key) => object[key] === value)
}

export const getParents = (
  path: string[] | null,
  data: string,
  flattenedSidebar: FlattenedRecord,
  locale: localeType = 'en',
  parentsArray: string[],
  parent?: string
): string[] => {
  if (!path) return parentsArray

  const pathParts = path.join('.').split('children')
  const desiredData =
    data === 'name' || data === 'slug' ? `${data}.${locale}` : data
  pathParts.splice(-1)
  let prev = ''
  pathParts.forEach((el) => {
    el = prev + el
    prev = el + 'children'
    const localizedData = flattenedSidebar[`${el}${desiredData}`] as
      | string
      | undefined
    const unlocalizedData = flattenedSidebar[`${el}${data}`] as
      | string
      | undefined
    if (
      localizedData &&
      (!parent ||
        (typeof localizedData === 'string' && localizedData.includes(parent)))
    ) {
      parentsArray.push(localizedData)
    } else if (unlocalizedData && typeof unlocalizedData === 'string') {
      parentsArray.push(unlocalizedData)
    }
  })
  return parentsArray
}

export const getChildren = (
  path: string,
  data: string,
  flattenedSidebar: FlattenedRecord,
  locale: localeType = 'en',
  childrenArray: string[]
): string[] => {
  const childrenBasePath = path?.split('slug')[0].concat('children.')
  const desiredData = data === 'name' ? `${data}.${locale}` : data
  for (let i = 0; i < 100; i++) {
    const completePath = childrenBasePath
      .concat(String(i))
      .concat(`.${desiredData}`)
    const value = flattenedSidebar[completePath]
    if (!value) {
      break
    }
    if (typeof value === 'string') {
      childrenArray.push(value)
    }
  }
  return childrenArray
}

/**
 * Get the localized value for a slug that could be either a string or a localized object
 */
export const getLocalizedSlug = (
  slug: LocalizedSlug,
  locale: localeType = 'en'
): string => {
  if (typeof slug === 'string') {
    return slug
  } else if (slug && typeof slug === 'object') {
    // If it's an object with localized versions, use the current locale or fall back to 'en'
    return slug[locale] || slug['en'] || ''
  }
  return ''
}

/**
 * Find a slug in the flattened sidebar structure, accounting for both string slugs and localized object slugs
 */
export const findSlugInSidebar = (
  flatSidebar: FlattenedRecord,
  targetSlug: string
): string | null => {
  for (const key in flatSidebar) {
    if (key.endsWith('.slug')) {
      const value = flatSidebar[key]

      // Check different formats of slug
      if (typeof value === 'string' && value === targetSlug) {
        return key
      } else if (value && typeof value === 'object') {
        // If it's an object, check if any locale matches our target slug
        const localizedValue = value as LocalizedContent
        for (const locale in localizedValue) {
          if (localizedValue[locale] === targetSlug) {
            return key
          }
        }
      }
    }
  }
  return null
}
