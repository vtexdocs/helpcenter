/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withPlaiceholder } = require('@plaiceholder/next')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  experimental: {
    largePageDataBytes: 500 * 1000,
    workerThreads: false,
    cpus: 4,
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 3600,
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  webpack: (config, options) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } }
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    config.module.rules.push({
      test: /\.pem/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'raw-loader',
        },
      ],
    })

    return config
  },
  env: {
    // Source navigation from help-center-content repo by default
    navigationJsonUrl:
      'https://raw.githubusercontent.com/vtexdocs/help-center-content/main/public/navigation.json',
    contentOrg: '',
    contentRepo: '',
    contentBranch: '',
    NEXT_PUBLIC_ALLOW_INDEXING:
      process.env.NEXT_PUBLIC_ALLOW_INDEXING || 'true',
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || 'https://help.vtex.com',
  },
  async redirects() {
    return []
  },
  i18n: {
    locales: ['en', 'pt', 'es'],
    defaultLocale: 'en',
  },
}

module.exports = withBundleAnalyzer(withPlaiceholder(nextConfig))
