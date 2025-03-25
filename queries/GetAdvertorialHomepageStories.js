import { gql } from '@apollo/client'

export const GetAdvertorialHomepageStories = gql`
  query GetAdvertorialHomepageStories {
    contentNodes(
      first: 12
      where: {
        contentTypes: ADVERTORIAL
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
`
