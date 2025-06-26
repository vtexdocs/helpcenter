export interface LocalizedText {
  en: string
  es: string
  pt: string
}

export interface LocalizedSlug {
  en: string
  es: string
  pt: string
}

export interface Document {
  slug: string | LocalizedSlug
  name: LocalizedText
  type: string
  origin: string
  children: Document[]
}

export interface NavbarItem {
  documentation: string
  name: LocalizedText
  slugPrefix: string
  categories: Document[]
}

export interface NavigationData {
  navbar: NavbarItem[]
}
