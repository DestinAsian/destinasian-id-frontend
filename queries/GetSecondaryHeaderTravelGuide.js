import { gql } from '@apollo/client'

export const GetSecondaryHeaderTravelGuide = gql`
  query GetSecondaryHeaderTravelGuide($id: ID!) {
    category(id: $id, idType: DATABASE_ID) {
      destinationGuides {
        destinationGuides
      }
      parent {
        node {
          children(where: { childless: true }) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
      children {
        edges {
          node {
            id
          }
        }
      }
    }
    travelGuide(id: $id, idType: DATABASE_ID) {
      categories(where: { childless: true }) {
        edges {
          node {
            parent {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`
