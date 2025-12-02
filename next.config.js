const { withFaust, getWpHostname } = require('@faustwp/core')

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
    domains: ['backend.destinasian.co.id/id/wp', 'destinasian.co.id'],
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
        permanent: true,
      },
    ]
  },
})
