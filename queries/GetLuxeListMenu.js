import { gql } from '@apollo/client'

export const GetLuxeListMenu = gql`
  query GetLuxeListMenu($first: Int, $after: String, $id: ID = "") {
    luxeList(id: $id, idType: DATABASE_ID) {
      title
      uri
      children(
        first: $first
        after: $after
        where: { orderby: { field: MENU_ORDER, order: ASC } }
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            ... on LuxeList {
              id
              title
              uri
              categories {
                edges {
                  node {
                    id
                    name
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
