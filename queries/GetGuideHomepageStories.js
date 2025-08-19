import { gql } from '@apollo/client'

export const GetGuideHomepageStories = gql`
  query GetGuideHomepageStories {
    contentNodes(
      first: 12
      where: {
        contentTypes: GUIDE
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
          ... on Guide {
            title
            content
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