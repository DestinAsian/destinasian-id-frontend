// lib/graphqlFetcher.js
import { getApolloClient } from '@faustwp/core'

const lastNetworkFetchMap = new Map()

const buildRequestKey = (query, variables = {}) => {
  const queryKey = query?.loc?.source?.body || String(query)
  const varsKey = JSON.stringify(variables || {})
  return `${queryKey}::${varsKey}`
}

const shouldForceNetwork = (requestKey, staleTimeMs) => {
  if (!staleTimeMs || staleTimeMs <= 0) return false

  const lastNetworkFetch = lastNetworkFetchMap.get(requestKey) || 0
  return Date.now() - lastNetworkFetch >= staleTimeMs
}

export const graphQLFetcher = async (query, variables = {}, options = {}) => {
  const client = getApolloClient()

  const {
    fetchPolicy = 'cache-first',
    nextFetchPolicy = 'cache-first',
    ensureFresh = false,
    staleTimeMs = 30000,
  } = options

  const requestKey = buildRequestKey(query, variables)
  let effectiveFetchPolicy = fetchPolicy

  // Keep fast cache-first behavior, but periodically refresh from network.
  if (ensureFresh && fetchPolicy === 'cache-first') {
    if (shouldForceNetwork(requestKey, staleTimeMs)) {
      effectiveFetchPolicy = 'network-only'
    }
  }

  const { data } = await client.query({
    query,
    variables,
    fetchPolicy: effectiveFetchPolicy,
    nextFetchPolicy,
  })

  if (effectiveFetchPolicy === 'network-only') {
    lastNetworkFetchMap.set(requestKey, Date.now())
  }

  return data
}
