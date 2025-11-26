import { gql } from '@apollo/client'

export const GetRelatedPosts = gql`
  query GetRelatedPosts($tagIn: [ID!], $notIn: [ID!]) {
    posts(first: 4, where: { tagIn: $tagIn, notIn: $notIn }) {
      edges {
        node {
          id
          databaseId
          title
          uri
          excerpt
          featuredImage {
            node {
              id
              sourceUrl
              altText
            }
          }
          categories {
            edges {
              node {
                id
                name
                uri
              }
            }
          }
          tags {
            edges {
              node {
                id
                databaseId
                name
              }
            }
          }
        }
      }
    }
  }
`
