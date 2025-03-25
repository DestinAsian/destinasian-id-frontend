import { gql } from '@apollo/client'

export const GetHomepageBannerAds = gql`
  query GetBannerAds($first: Int) {
    bannerAds(first: $first, where: { search: "homepage" }) {
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
