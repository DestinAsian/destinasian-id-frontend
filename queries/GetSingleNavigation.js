import { gql } from '@apollo/client'

export const GetSingleNavigation = gql`
  query GetSingleNavigation($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      categories(where: { childless: true }) {
        edges {
          node {
            name
            uri
            parent {
              node {
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
                      name
                      uri
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
