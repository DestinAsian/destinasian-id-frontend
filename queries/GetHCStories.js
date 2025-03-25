import { gql } from '@apollo/client'

export const GetHCStories = gql`
  query GetHCStories($search: String) {
    tags(first: 100, where: { search: $search, hideEmpty: true }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          contentNodes(
            first: 10
            where: {
              contentTypes: HONORS_CIRCLE
              status: PUBLISH
              orderby: { field: DATE, order: DESC }
            }
          ) {
            edges {
              node {
                id
                databaseId
                ... on HonorsCircle {
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
          }
        }
      }
    }
  }
`
