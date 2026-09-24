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

export type NavigationNodeType =
  | 'markdown'
  | 'category'
  | 'divider'
  | 'link'
  | 'track'

export interface Document {
  slug: string | LocalizedSlug
  name: LocalizedText
  /**
   * `markdown`: article; `category`: expandable group (optional cover page);
   * `divider`: section title in the sidebar with no associated doc.
   */
  type: NavigationNodeType | string
  origin?: string
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
