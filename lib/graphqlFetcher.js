// lib/graphqlFetcher.js
import { getApolloClient } from '@faustwp/core'

export const graphQLFetcher = async (query, variables = {}) => {
  const client = getApolloClient()

  const { data } = await client.query({
    query,
    variables,
    fetchPolicy: 'network-only',
  })

  return data
}
