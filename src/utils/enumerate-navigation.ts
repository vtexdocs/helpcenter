interface NavbarItem {
  documentantion: string
  slugPrefix: string
  categories: Document[]
}

interface Document {
  name: { en: string; es: string; pt: string }
  children: Document[]
}

export const enumerateNavigation = (navbar: NavbarItem[]) => {
  const enumerableSectionsSlugs = ['docs/tracks']
  const enumerationLevel = 2

  return navbar.map((item) => {
    if (!enumerableSectionsSlugs.includes(item.slugPrefix)) return item
    item.categories = item.categories.map((category) => {
      category.children = enumerateChildren(category, 1, enumerationLevel)
      return category
    })
    return item
  })
}

const enumerateChildren = (
  document: Document,
  currLevel: number,
  enumerationLevel: number
): Document[] => {
  const children = document.children.map((currDoc, index) => {
    if (enumerationLevel !== currLevel)
      currDoc.children = enumerateChildren(
        currDoc,
        currLevel + 1,
        enumerationLevel
      )
    else currDoc.name = enumerateName(currDoc.name, index + 1)

    return currDoc
  })

  return children
}

const enumerateName = (
  name: { en: string; es: string; pt: string },
  id: number
) => {
  name.en = id + '. ' + name.en
  name.es = id + '. ' + name.es
  name.pt = id + '. ' + name.pt

  return name
}
