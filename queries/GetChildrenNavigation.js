import { gql } from '@apollo/client'

export const GetChildrenNavigation = gql`
  query GetChildrenNavigation($id: ID!) {
    category(id: $id, idType: DATABASE_ID) {
      parent {
        node {
          id
          name
          uri
          children(where: { childless: true }) {
            edges {
              node {
                id
                name
                uri
              }
            }
          }
          parent {
            node {
              id
              name
            }
          }
          countryCode {
            countryCode
          }
          destinationGuides {
            destinationGuides
          }
        }
      }
    }
  }
`
