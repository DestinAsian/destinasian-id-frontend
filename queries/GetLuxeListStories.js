import { gql } from '@apollo/client'

export const GetLuxeListStories = gql`
  query GetLuxeListStories($first: Int, $after: String, $id: Int) {
    luxeListBy(luxeListId: $id) {
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
              content
              uri
              featuredImage {
                node {
                  id
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
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
