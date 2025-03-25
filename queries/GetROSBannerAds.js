import { gql } from '@apollo/client'

export const GetROSBannerAds = gql`
  query GetBannerAds($first: Int) {
    bannerAds(first: $first, where: { search: "ros" }) {
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
