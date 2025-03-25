import { gql } from '@apollo/client'

export const GetFavicon = gql`
  query GetFavicon {
    favicon {
      mediaDetails {
        sizes {
          sourceUrl
          width
        }
      }
    }
  }
`
