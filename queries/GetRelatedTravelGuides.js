import { gql } from '@apollo/client'

export const GetRelatedTravelGuides = gql`
  query GetRelatedTravelGuides($tagIn: [ID!], $notIn: [ID!]) {
    travelGuides(
      first: 4
      where: { tagIn: $tagIn, notIn: $notIn }
    ) {
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
                children {
                  edges {
                    node {
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
