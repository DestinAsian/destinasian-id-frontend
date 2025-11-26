import { gql } from '@apollo/client'

export const GetSingleNavigation = gql`
  query GetSingleNavigation($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      categories(where: { childless: true }) {
        edges {
          node {
            id
            name
            uri
            parent {
              node {
                id
                name
                uri
                countryCode {
                  countryCode
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
          }
        }
      }
    }
  }
`
