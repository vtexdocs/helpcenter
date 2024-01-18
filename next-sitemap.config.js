/** @type {import('next').NextConfig} */
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL

module.exports = {
  siteUrl,
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `${siteUrl}/pt/${path}`,
          hreflang: 'pt',
        },
        {
          href: `${siteUrl}/es/${path}`,
          hreflang: 'es',
        },
      ],
    }
  },
  generateIndexSitemap: false,
  exclude: ['/404', '/*/404', '/500', '/*/500', 'server-sitemap.xml'],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/404'],
      },
      { userAgent: '*', allow: '/' },
    ],
    additionalSitemaps: [`${siteUrl}/server-sitemap.xml`],
  },
}
