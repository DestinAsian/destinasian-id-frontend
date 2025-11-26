import { gql } from '@apollo/client'

export const GetGuideHomepageStories = gql`
  query GetGuideHomepageStories {
    contentNodes(
      first: 12
      where: {
        contentTypes: TRAVEL_GUIDE
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
          ... on TravelGuide {
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
