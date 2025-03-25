import { gql } from '@apollo/client'

export const GetChildrenNavigation = gql`
  query GetChildrenNavigation($id: ID!) {
    category(id: $id, idType: DATABASE_ID) {
      parent {
        node {
          name
          uri
          children(where: { childless: true }) {
            edges {
              node {
                name
                uri
              }
            }
          }
          parent {
            node {
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
