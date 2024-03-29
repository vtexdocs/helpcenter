/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSidePropsContext } from 'next'
import { ISitemapField, getServerSideSitemapLegacy } from 'next-sitemap'
import getNavigation from 'utils/getNavigation'

const DOMAIN_URL = 'https://leafy-mooncake-7c2e5e.netlify.app'

function getEndpoint(element: any, slugPrefix: string) {
  let urls: ISitemapField[] = []
  if (element.children) {
    const children = element.children.flatMap((e: any) => {
      return getEndpoint(e, slugPrefix)
    })
    urls = children
  }

  if (element.type === 'markdown') {
    const url: ISitemapField = {
      loc: '',
    }
    url.loc = `${DOMAIN_URL}/${slugPrefix}/${element.slug}`
    url.lastmod = new Date().toISOString()
    url.alternateRefs = [
      {
        href: `${DOMAIN_URL}/pt/${slugPrefix}/${element.slug}`,
        hreflang: 'pt',
      },
      {
        href: `${DOMAIN_URL}/es/${slugPrefix}/${element.slug}`,
        hreflang: 'es',
      },
    ]
    urls.push(url)
  }
  return urls
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let urls: ISitemapField[] = []
  const documentations = await getNavigation()

  for (let i = 0; i < documentations.length; i++) {
    const documentation = documentations[i]
    for (let j = 0; j < documentation.categories.length; j++) {
      const category = documentation.categories[j]
      urls = urls.concat(getEndpoint(category, documentation.slugPrefix))
    }
  }

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
