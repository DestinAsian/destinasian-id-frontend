
import { gql } from '@apollo/client'

export const GetSecondaryHeaders = gql`
  query GetSecondaryHeaders($include: [ID] = ["3", "29", "20"]) {
    categories(where: {include: $include, orderby: COUNT}) {
      edges {
        node {
          id
          name
          slug
          uri
          link
        }
      }
    }
    guide(id: $id, idType: DATABASE_ID) {
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