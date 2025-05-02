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
            categoryId
            description
            uri
            guides {
              nodes {
                title
              }
            }
            contentNodes(first: 1000) {
              edges {
                cursor
                node {
                  id
                  databaseId
                  date
                  guid
                  isContentNode
                  link
                  slug
                  status
                  uri
                  contentTypeName
                  ... on Post {
                    id
                    slug
                    title
                    uri
                    featuredImage {
                      node {
                        caption
                        mediaItemUrl
                        title
                        date
                        link
                      }
                    }
                  }
                }
              }
            }
          }
          cursor
        }
      }
    }
  }
`
