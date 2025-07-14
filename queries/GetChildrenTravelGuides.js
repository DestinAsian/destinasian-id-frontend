import { gql } from '@apollo/client'

export const GetChildrenTravelGuides = gql`
  query childrentravelguides($id: ID = "14737") {
    category(id: $id, idType: DATABASE_ID) {
      id
      children {
        edges {
          node {
            id
            name
            slug
            uri
            categoryImages {
              categorySlide1 {
                mediaItemUrl
              }
            }
          }
        }
      }
    }
  }
`
