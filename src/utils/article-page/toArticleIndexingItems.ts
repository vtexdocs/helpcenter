import type { ArticleIndexingItem } from '@vtexdocs/components'

type CategoryChild = {
  name: string
  slug: string
  excerpt?: string
}

export const toArticleIndexingItems = (
  children: CategoryChild[] = []
): ArticleIndexingItem[] =>
  children.map(({ name, slug, excerpt }) => ({
    name,
    url: slug,
    description: excerpt,
  }))
