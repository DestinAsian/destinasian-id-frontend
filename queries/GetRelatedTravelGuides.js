import { gql } from '@apollo/client'

export const GetRelatedTravelGuides = gql`
  query GetRelatedTravelGuides($tagIn: [ID!], $notIn: [ID!]) {
    travelGuides(first: 4, where: { tagIn: $tagIn, notIn: $notIn }) {
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
                children {
                  edges {
                    node {
                      id
                      name
                      uri
                    }
                  }
                }
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
