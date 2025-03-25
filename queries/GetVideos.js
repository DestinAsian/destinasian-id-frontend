import { gql } from '@apollo/client'

export const GetVideos = gql`
  query GetVideos($first: Int, $after: String) {
    videos(
      first: $first
      after: $after
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      pageInfo {
        startCursor
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
          videosAcf {
            videoLink
            guidesCategoryLink
            guidesCategoryText
            customLink
            customText
          }
        }
      }
    }
  }
`
