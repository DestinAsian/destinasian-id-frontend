import { gql } from '@apollo/client'

export const GetTravelGuides = gql`
  query GetTravelGuides($search: String) {
    tags(first: 1000, where: { search: $search, hideEmpty: true }) {
      edges {
        node {
          advertorials(where: { status: PUBLISH }, first: 10) {
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
