/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSidePropsContext } from 'next'
import { ISitemapField, getServerSideSitemapLegacy } from 'next-sitemap'
import getNavigation from 'utils/getNavigation'

function getURLs(category: any, slugPrefix: string): ISitemapField[] {
  const DOMAIN_URL = 'https://leafy-mooncake-7c2e5e.netlify.app'
  if (!category.children?.length) {
    return []
  }

  const urls: ISitemapField[] = category.children.flatMap(
    (doc: {
      type: string
      slug: { en: string; pt?: string; es?: string }
      children: any[]
    }) => {
      if (doc.type === 'markdown' && doc.slug) {
        return [
          {
            loc: `${DOMAIN_URL}/en/${slugPrefix}/${doc.slug.en}`,
            lastmod: new Date().toISOString(),
          },
          {
            loc: `${DOMAIN_URL}/pt/${slugPrefix}/${doc.slug.pt}`,
            lastmod: new Date().toISOString(),
          },
          {
            loc: `${DOMAIN_URL}/es/${slugPrefix}/${doc.slug.es}`,
            lastmod: new Date().toISOString(),
          },
        ]
      }
      return getURLs(doc, slugPrefix)
    }
  )
  return urls
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const navigation = await getNavigation()
  let urls: ISitemapField[] = []
  navigation.forEach((navItem: any) => {
    if (navItem.slugPrefix && Array.isArray(navItem.categories)) {
      navItem.categories.forEach((category: any) => {
        urls = urls.concat(getURLs(category, navItem.slugPrefix))
      })
    }
  })

  ctx.res.setHeader(
    'Cache-control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  ctx.res.setHeader(
    'Netlify-CDN-Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return await getServerSideSitemapLegacy(ctx, urls)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapIndex() {}
