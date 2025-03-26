/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { withPlaiceholder } = require('@plaiceholder/next')

const nextConfig = {
  experimental: {
    largePageDataBytes: 2000 * 1000,
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
    domains: [
      'raw.githubusercontent.com',
      'github.com',
      'avatars.githubusercontent.com',
      'user-images.githubusercontent.com',
    ],
    unoptimized: process.env.NODE_ENV === 'development',
    minimumCacheTTL: 3600,
    deviceSizes: [640, 1080, 1920],
    imageSizes: [32, 96, 256],
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
  },
  webpack: (config, options) => {
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } }
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
    navigationJsonUrl:
      'https://leafy-mooncake-7c2e5e.netlify.app/navigation.json',
    contentOrg: '',
    contentRepo: '',
    contentBranch: '',
  },
  async redirects() {
    return []
  },
  i18n: {
    locales: ['en', 'pt', 'es'],
    defaultLocale: 'en',
  },
}

// Use the same plugin configuration pattern as devportal
module.exports = () => {
  const plugins = [withPlaiceholder]
  return plugins.reduce((acc, plugin) => plugin(acc), {
    ...nextConfig,
  })
}
