// lib/graphqlFetcher.js
import useSWR from 'swr'
import { graphQLFetcher } from './graphqlFetcher'

export const useSWRGraphQL = (key, query, variables = {}) => {
  return useSWR(
    key ? [key, variables] : null,
    ([, vars]) => graphQLFetcher(query, vars),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )
}
