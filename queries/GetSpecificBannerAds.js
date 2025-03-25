import { gql } from '@apollo/client'

export const GetSpecificBannerAds = gql`
  query GetBannerAds($first: Int, $search: String) {
    bannerAds(first: $first, where: { search: $search }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          content
          title
        }
      }
    }
  }
`
