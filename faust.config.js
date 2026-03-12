import { hooks, setConfig } from '@faustwp/core'
import templates from './wp-templates'
import possibleTypes from './possibleTypes.json'

const APOLLO_FILTER_NAMESPACE = 'destinasian/apollo-config'

if (!globalThis.__DESTINASIAN_APOLLO_FILTERS__) {
  hooks.addFilter(
    'apolloClientOptions',
    `${APOLLO_FILTER_NAMESPACE}/client-options`,
    (apolloClientOptions) => {
      const nextOptions = { ...apolloClientOptions }

      // Apollo Client 3.14 deprecates connectToDevTools.
      delete nextOptions.connectToDevTools

      // Use the new devtools option in browser only.
      nextOptions.devtools = { enabled: typeof window !== 'undefined' }

      return nextOptions
    },
  )

  hooks.addFilter(
    'apolloClientInMemoryCacheOptions',
    `${APOLLO_FILTER_NAMESPACE}/cache-options`,
    (inMemoryCacheOptions) => {
      const nextOptions = { ...inMemoryCacheOptions }

      // Remove deprecated/legacy flag if present.
      delete nextOptions.canonizeResults

      return nextOptions
    },
  )

  globalThis.__DESTINASIAN_APOLLO_FILTERS__ = true
}

export default setConfig({
  wpUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://backend.destinasian.co.id/id/wp',
  frontendUrl: process.env.FRONTEND_URL || 'https://destinasian.co.id',

  apiBasePath: '/api/faust',

  templates,
  experimentalPlugins: [],
  experimentalToolbar: true,
  possibleTypes,
})
