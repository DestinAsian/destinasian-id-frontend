import { gql } from '@apollo/client'

export const GetIndoCategory = gql`
  query GetIndoCategory($include: [ID] = ["14616", "14601", "14606", "14611"]) {
    categories(where: { include: $include }) {
      edges {
        node {
          id
          name
          slug
          uri
          link
          description
          categoryImages {
            categoryImages {
              mediaItemUrl
            }
            categorySlide1 {
              mediaItemUrl
            }
          }
        }
      }
    }
  }
`
