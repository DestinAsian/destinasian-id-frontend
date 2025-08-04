import { gql } from '@apollo/client'

export const GetTravelGuides = gql`
  query GetTravelGuides($search: String) {
    tags(first: 10, where: { search: $search, hideEmpty: true }) {
      edges {
        node {
          honorsCircles(where: { status: PUBLISH }, first: 10) {
            edges {
              node {
                id
                databaseId
                title
                uri
                featuredImage {
                  node {
                    sourceUrl
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
