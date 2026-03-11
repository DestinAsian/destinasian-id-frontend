// lib/useSWRGraphQL
import useSWR from 'swr'
import { graphQLFetcher } from './graphqlFetcher'

export const useSWRGraphQL = (key, query, variables = {}, options = {}) => {
  const {
    apollo = {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
      ensureFresh: true,
      staleTimeMs: 30000,
    },
    swr = {},
  } = options

  return useSWR(
    key ? [key, variables, apollo] : null,
    ([, vars, apolloOptions]) => graphQLFetcher(query, vars, apolloOptions),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 30000,
      ...swr,
    },
  )
}
