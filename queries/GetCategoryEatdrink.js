import { gql } from '@apollo/client'

export const GetCategoryEatdrink = gql`
  query GetCategoryEatdrink($id: ID = "651") {
    category(id: $id, idType: DATABASE_ID) {
      id
      name
      slug
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
