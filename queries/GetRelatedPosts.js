import { gql } from '@apollo/client'

export const GetRelatedPosts = gql`
  query GetRelatedPosts($tagIn: [ID!], $notIn: [ID!]) {
    posts(first: 4, where: { tagIn: $tagIn, notIn: $notIn }) {
      edges {
        node {
          databaseId
          title
          uri
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            edges {
              node {
                name
                uri
              }
            }
          }
          tags {
            edges {
              node {
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
