import { gql } from '@apollo/client'

export const GetCategoryUpdates = gql`
  query GetCategoryUpdates($include: [ID] = "41") {
    category(id: "3", idType: DATABASE_ID) {
      id
      name
      slug
      children(where: { include: $include }) {
        edges {
          node {
            id
            name
            slug
            description
            uri
            parent {
              node {
                name
              }
            }
            contentNodes(first: 1000) {
              edges {
                cursor
                node {
                  id
                  databaseId
                  date
                  link
                  slug
                  uri
                  contentTypeName
                  ... on Post {
                    id
                    slug
                    title
                    uri
                    excerpt
                    featuredImage {
                      node {
                        mediaItemUrl
                      }
                    }
                    categories {
                      nodes {
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
