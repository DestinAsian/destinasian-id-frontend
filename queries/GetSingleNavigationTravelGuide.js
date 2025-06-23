import { gql } from '@apollo/client'

export const GetSingleNavigationTravelGuide = gql`
  query GetSingleNavigationTravelGuide($id: ID!) {
    travelGuide(id: $id, idType: DATABASE_ID) {
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
