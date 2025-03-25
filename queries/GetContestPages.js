import { gql } from '@apollo/client'

export const GetContestPages = gql`
  query GetContestPages($first: Int) {
    contests(
      first: $first
      where: { status: PUBLISH, orderby: { field: DATE, order: ASC } }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          uri
          title
          content
          excerpt
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
  }
`
