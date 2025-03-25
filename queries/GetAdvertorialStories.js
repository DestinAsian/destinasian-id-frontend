import { gql } from '@apollo/client'

export const GetAdvertorialStories = gql`
  query GetAdvertorialStories($search: String) {
    tags(first: 100, where: { search: $search, hideEmpty: true }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          contentNodes(
            where: {
              contentTypes: ADVERTORIAL
              status: PUBLISH
              orderby: { field: DATE, order: DESC }
            }
          ) {
            edges {
              node {
                id
                databaseId
                ... on Advertorial {
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
