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
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
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
        permanent: true, // This indicates a 301 permanent redirect
      },
      {
        source: '/travel-guide/bali',
        destination: '/category/bali',
        permanent: true,
      },
      {
        source: '/travel-guide/jakarta',
        destination: '/category/jakarta',
        permanent: true,
      },
      {
        source: '/travel-guide/bandung',
        destination: '/category/bandung',
        permanent: true,
      },
      {
        source: '/travel-guide/surabaya',
        destination: '/category/surabaya',
        permanent: true,
      },

      // Redirect untuk semua anak kategori
      {
        source: '/travel-guide/bali/:slug*',
        destination: '/category/bali/:slug*',
        permanent: true,
      },
      {
        source: '/travel-guide/jakarta/:slug*',
        destination: '/category/jakarta/:slug*',
        permanent: true,
      },
      {
        source: '/travel-guide/bandung/:slug*',
        destination: '/category/bandung/:slug*',
        permanent: true,
      },
      {
        source: '/travel-guide/surabaya/:slug*',
        destination: '/category/surabaya/:slug*',
        permanent: true,
      },
    ]
  },
})
