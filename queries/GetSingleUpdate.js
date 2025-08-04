import { gql } from '@apollo/client'

export const GetSingleUpdate = gql`
  query GetSingleUpdate($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      uri
      featuredImage {
        node {
          mediaItemUrl
          title
          caption
        }
      }
      categories {
        nodes {
          id
          name
          slug
          parent {
            node {
              id
              slug
            }
          }
        }
      }
    }
  }
`
