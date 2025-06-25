import type {
  NavbarItem,
  Document,
  LocalizedText,
  LocalizedSlug,
} from '../types/navigation'

const ENUMERABLE_SECTIONS_SLUGS = ['docs/tracks']
const ENUMERATION_TYPE = 'track'

export const enumerateNavigation = (navbar: NavbarItem[]) => {
  return navbar.map((item) => {
    if (!ENUMERABLE_SECTIONS_SLUGS.includes(item.slugPrefix)) return item
    item.categories = item.categories.map((category) => {
      category.children = enumerateChildren(
        category,
        category.type === ENUMERATION_TYPE
      )
      return category
    })
    return item
  })
}

const enumerateChildren = (
  document: Document,
  enumerate: boolean
): Document[] => {
  const children = document.children.map((currDoc, index) => {
    if (enumerate) {
      currDoc.name = enumerateName(currDoc.name, index + 1)
      if (typeof currDoc.slug === 'object') {
        currDoc.slug = enumerateSlug(currDoc.slug, index + 1)
      }
    }
    currDoc.children = enumerateChildren(
      currDoc,
      ENUMERATION_TYPE === currDoc.type
    )
    return currDoc
  })

  return children
}

const enumerateName = (name: LocalizedText, id: number): LocalizedText => {
  name.en = id + '. ' + name.en
  name.es = id + '. ' + name.es
  name.pt = id + '. ' + name.pt

  return name
}

const enumerateSlug = (slug: LocalizedSlug, id: number): LocalizedSlug => {
  slug.en = id + '-' + slug.en
  slug.es = id + '-' + slug.es
  slug.pt = id + '-' + slug.pt

  return slug
}
