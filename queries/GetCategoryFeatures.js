import { gql } from '@apollo/client'

export const GetCategoryFeatures = gql`
  query GetCategoryFeatures($id: ID = "20") {
    category(id: $id, idType: DATABASE_ID) {
      id
      name
      slug
      uri
      categoryImages {
        categoryImagesCaption
      }
      posts(first: 10) {
        edges {
          node {
            id
            slug
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
                slug
                title
              }
            }
          }
        }
      }
    }
  }
`
