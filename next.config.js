const { withFaust, getWpHostname } = require('@faustwp/core')

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['node_modules'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getWpHostname(),
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'backend.destinasian.co.id',
      'destinasian.co.id',
    ],
  },

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    localeDetection: false,
  },

  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icons/favicon.ico',
        permanent: true,
      },
      {
        source: '/advertorial/:slug*',
        destination: '/partner-content/:slug*',
        permanent: true, // 301 permanent redirect
      },
      // Tambahkan redirect lain sesuai kebutuhan
    ]
  },

  async rewrites() {
    return [
      // Sitemap index
      {
        source: '/sitemap_index.xml',
        destination: 'https://backend.destinasian.co.id/sitemap_index.xml',
      },
      // Semua sitemap lain (misalnya post-sitemap.xml, page-sitemap.xml, category-sitemap.xml, dll)
      {
        source: '/:slug*-sitemap.xml',
        destination: 'https://backend.destinasian.co.id/:slug*-sitemap.xml',
      },
      // Robots.txt
    {
      source: '/robots.txt',
      destination: 'https://backend.destinasian.co.id/robots.txt',
    },
    ]
  },
})