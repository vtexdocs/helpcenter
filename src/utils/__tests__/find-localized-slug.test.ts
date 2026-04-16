import { describe, it, expect } from 'vitest'
import { findLocalizedSlug } from '../find-localized-slug'
import type { NavbarItem } from 'types/navigation'

const mockNavbar: NavbarItem[] = [
  {
    documentation: 'Tutorials',
    slugPrefix: 'docs/tutorials',
    name: { en: 'Tutorials', es: 'Tutoriales', pt: 'Tutoriais' },
    categories: [
      {
        name: { en: 'Category A', es: 'Categor\u00eda A', pt: 'Categoria A' },
        slug: { en: 'category-a', es: 'categoria-a', pt: 'categoria-a' },
        origin: '',
        type: 'category',
        children: [
          {
            name: {
              en: 'Subcategory',
              es: 'Subcategor\u00eda',
              pt: 'Subcategoria',
            },
            slug: {
              en: 'subcategory',
              es: 'subcategoria',
              pt: 'subcategoria',
            },
            origin: '',
            type: 'category',
            children: [
              {
                name: {
                  en: 'My Article',
                  es: 'Mi Art\u00edculo',
                  pt: 'Meu Artigo',
                },
                slug: {
                  en: 'my-article',
                  es: 'mi-articulo',
                  pt: 'meu-artigo',
                },
                origin: '',
                type: 'markdown',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    documentation: 'FAQ',
    slugPrefix: 'faq',
    name: { en: 'FAQ', es: 'FAQ', pt: 'FAQ' },
    categories: [
      {
        name: { en: 'General', es: 'General', pt: 'Geral' },
        slug: { en: 'general', es: 'general', pt: 'geral' },
        origin: '',
        type: 'category',
        children: [
          {
            name: {
              en: 'FAQ Item',
              es: 'Elemento FAQ',
              pt: 'Item FAQ',
            },
            slug: {
              en: 'faq-item',
              es: 'elemento-faq',
              pt: 'item-faq',
            },
            origin: '',
            type: 'markdown',
            children: [],
          },
        ],
      },
    ],
  },
]

describe('findLocalizedSlug', () => {
  it('returns localized slug when match found at grandchild level', () => {
    expect(findLocalizedSlug(mockNavbar, 'my-article', 'pt')).toBe('meu-artigo')
  })

  it('returns localized slug when match found at child level', () => {
    expect(findLocalizedSlug(mockNavbar, 'subcategory', 'es')).toBe(
      'subcategoria'
    )
  })

  it('returns original slug when no match found', () => {
    expect(findLocalizedSlug(mockNavbar, 'nonexistent', 'pt')).toBe(
      'nonexistent'
    )
  })

  it('returns original slug when slug is empty string', () => {
    expect(findLocalizedSlug(mockNavbar, '', 'en')).toBe('')
  })

  it('handles object slugs with all locale variants', () => {
    // Search by es slug, get en version
    expect(findLocalizedSlug(mockNavbar, 'mi-articulo', 'en')).toBe(
      'my-article'
    )
  })

  it('handles URL-encoded slugs', () => {
    expect(findLocalizedSlug(mockNavbar, 'meu-artigo', 'es')).toBe(
      'mi-articulo'
    )
  })

  it('searches across all navbar sections', () => {
    expect(findLocalizedSlug(mockNavbar, 'faq-item', 'pt')).toBe('item-faq')
  })

  it('returns original slug for empty navbar', () => {
    expect(findLocalizedSlug([], 'anything', 'en')).toBe('anything')
  })
})
