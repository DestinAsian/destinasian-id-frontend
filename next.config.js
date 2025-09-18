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
        source: '/advertorial/:slug*', // All advertorial slug redirect to partner-content
        destination: '/partner-content/:slug*',
        permanent: true, // 301 permanent redirect
      },
      // Tambahkan redirect lain sesuai kebutuhan
    ]
  },
})
