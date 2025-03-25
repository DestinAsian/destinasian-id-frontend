import { gql } from '@apollo/client'

export const GetPartnerContent = gql`
  query GetPartnerContent($first: Int, $search: String, $id: ID!) {
    advertorials(
      first: $first
      where: {
        status: PUBLISH
        search: $search
        orderby: { field: DATE, order: DESC }
      }
    ) {
      edges {
        node {
          title
          excerpt
          uri
          featuredImage {
            node {
              id
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    }
    honorsCircles(
      first: $first
      where: {
        status: PUBLISH
        search: $search
        orderby: { field: DATE, order: DESC }
      }
    ) {
      edges {
        node {
          title
          excerpt
          uri
          featuredImage {
            node {
              id
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    }
    page(id: $id, idType: URI) {
      title
      uri
    }
  }
`
