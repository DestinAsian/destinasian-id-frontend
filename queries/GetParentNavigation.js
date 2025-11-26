import { gql } from '@apollo/client'

export const GetParentNavigation = gql`
  query GetParentNavigation($id: ID!) {
    category(id: $id, idType: DATABASE_ID) {
      id
      name
      uri
      countryCode {
        countryCode
      }
      destinationGuides {
        destinationGuides
      }
      children {
        edges {
          node {
            id
            name
            uri
          }
        }
      }
    }
  }
`
