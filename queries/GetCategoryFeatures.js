import { gql } from '@apollo/client'

export const GetCategoryFeatures = gql`
  query GetCategoryFeatures($id: ID = "20") {
    category(id: $id, idType: DATABASE_ID) {
      id
      name
      uri
      categoryImages {
        categoryImagesCaption
      }
      posts(first: 3) {
        edges {
          node {
            id
            uri
            date
            excerpt
            categories {
              edges {
                node {
                  parent {
                    node {
                      name
                    }
                  }
                }
              }
            }
            featuredImage {
              node {
                mediaItemUrl
              }
            }
          }
        }
      }
    }
  }
`
