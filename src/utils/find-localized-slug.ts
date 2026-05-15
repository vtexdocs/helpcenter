import type { Document, LocalizedSlug, NavbarItem } from 'types/navigation'

function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str)
  } catch {
    return str
  }
}

function searchDocument(
  doc: Document,
  decodedSlug: string,
  locale: string
): string | null {
  for (const child of doc.children) {
    const result = searchDocument(child, decodedSlug, locale)
    if (result !== null) return result
  }

  if (typeof doc.slug === 'object') {
    const slugObj = doc.slug as LocalizedSlug
    const match = Object.values(slugObj).find((s) => s === decodedSlug)
    if (match) {
      return slugObj[locale as keyof LocalizedSlug] || null
    }
  }

  return null
}

/**
 * Finds the localized version of a slug by searching the navigation tree.
 * Matches the slug against all locale variants and returns the version
 * for the requested locale.
 */
export function findLocalizedSlug(
  navbar: NavbarItem[],
  slug: string,
  locale: string
): string {
  if (!slug) return slug

  const decodedSlug = safeDecodeURIComponent(slug)

  for (const item of navbar) {
    for (const category of item.categories) {
      const result = searchDocument(category, decodedSlug, locale)
      if (result !== null) return result
    }
  }

  return slug
}
