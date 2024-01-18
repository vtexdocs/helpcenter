/** @type {import('next').NextConfig} */
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL

module.exports = {
  siteUrl,
  generateIndexSitemap: false,
  exclude: ['server-sitemap.xml'],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/server-sitemap.xml`],
  },
}
