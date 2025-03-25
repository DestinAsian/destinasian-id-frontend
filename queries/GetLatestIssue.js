import { gql } from '@apollo/client'

export const GetLatestIssue = gql`
  query GetLatestIssue($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      subscribeImages {
        bundleIssue {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        latestIssue {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`
