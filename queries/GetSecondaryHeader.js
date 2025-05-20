import { gql } from '@apollo/client'

export const GetSecondaryHeader = gql`
  query GetSecondaryHeader($id: ID!) {
    category(id: $id, idType: DATABASE_ID) {
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
    post(id: $id, idType: DATABASE_ID) {
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
