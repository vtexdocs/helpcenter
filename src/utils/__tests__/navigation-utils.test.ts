import { flattenJSON, getKeyByValue } from '../navigation-utils'

const flattenedAmazon = flattenJSON({
  categories: [
    {
      slug: { en: 'marketplace', es: 'marketplace', pt: 'marketplace' },
      children: [
        {
          slug: { en: 'amazon', es: 'amazon', pt: 'amazon' },
          type: 'markdown',
        },
      ],
    },
  ],
})

describe('getKeyByValue', () => {
  it('prefers the requested locale when the same slug exists in en/es/pt', () => {
    expect(getKeyByValue(flattenedAmazon, 'amazon', 'pt')).toBe(
      'categories.0.children.0.slug.pt'
    )
    expect(getKeyByValue(flattenedAmazon, 'amazon', 'es')).toBe(
      'categories.0.children.0.slug.es'
    )
  })

  it('falls back to the first matching slug when no locale is given', () => {
    expect(getKeyByValue(flattenedAmazon, 'amazon')).toBe(
      'categories.0.children.0.slug.en'
    )
  })
})
