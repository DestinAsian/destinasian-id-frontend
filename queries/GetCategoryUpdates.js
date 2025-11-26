import { gql } from '@apollo/client'

export const GetCategoryUpdates = gql`
  query GetCategoryUpdates($include: [ID] = "41") {
    category(id: "3", idType: DATABASE_ID) {
      id
      name
      children(where: { include: $include }) {
        edges {
          node {
            id
            name
            uri
            parent {
              node {
                id
                name
              }
            }
            contentNodes(first: 10) {
              edges {
                node {
                  uri
                  ... on Post {
                    title
                    uri
                    featuredImage {
                      node {
                        mediaItemUrl
                      }
                    }
                    categories {
                      nodes {
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
    }
  }
`
