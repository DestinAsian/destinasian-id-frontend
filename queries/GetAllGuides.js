import { gql } from '@apollo/client'

export const GetAllGuides = gql`
  query GetAllGuides {
    guides(first: 100) {
      edges {
        node {
          id
          title
          slug
          uri
          content
          link
          featuredImage {
            node {
              id
              mediaItemUrl
              title
            }
          }
          categories {
            nodes {
              id
              name
              slug
              uri
              parentId
            }
          }
        }
      }
    }
  }
`
