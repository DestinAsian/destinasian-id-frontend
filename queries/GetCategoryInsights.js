import { gql } from '@apollo/client'

export const GetCategoryInsights = gql`
  query GetCategoryInsights($id: ID = "29") {
    category(id: $id, idType: DATABASE_ID) {
      id
      name
      slug
      uri
      categoryImages {
        categoryImagesCaption
      }
      posts(first: 1000) {
        edges {
          node {
            id
            slug
            uri
            excerpt
            featuredImage {
              node {
                mediaItemUrl
                slug
                description
                id
                uri
                title
              }
            }
          }
        }
      }
    }
  }
`
