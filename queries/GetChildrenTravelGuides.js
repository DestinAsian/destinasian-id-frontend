import { gql } from '@apollo/client'

export const GetChildrenTravelGuides = gql`
  query childrentravelguides($id: ID = "15393") {
    category(id: $id, idType: DATABASE_ID) {
      id
      children(first: 4) {
        edges {
          node {
            id
            name
            uri
            categoryImages {
              categoryImages {
                mediaItemUrl
                sourceUrl
              }
              categorySlide1 {
                id
                mediaItemUrl
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`
