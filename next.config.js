/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withPlaiceholder } = require('@plaiceholder/next')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  generateBuildId: async () => {
    // Force unique build ID to bust CDN cache
    return `build-${Date.now()}`
  },
  experimental: {
    largePageDataBytes: 500 * 1000,
    workerThreads: false,
    cpus: 4,
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 3600,
  images: {
    // Fallback to domains for Next.js 13.0.5 compatibility
    domains: [
      'raw.githubusercontent.com',
      'cdn.jsdelivr.net',
      'cdn.statically.io',
      'github.com',
      'avatars.githubusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.statically.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      // Allow all other HTTPS domains for backward compatibility
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
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
  },
  async headers() {
    return [
      {
        // Match all pages to ensure CDN varies cache by locale cookies
        source: '/:path*',
        headers: [
          {
            key: 'Netlify-Vary',
            value: 'cookie=NEXT_LOCALE|nf_lang',
          },
        ],
      },
    ]
  },
  async redirects() {
    return []
  },
  i18n: {
    locales: ['en', 'pt', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
}

module.exports = withBundleAnalyzer(withPlaiceholder(nextConfig))
