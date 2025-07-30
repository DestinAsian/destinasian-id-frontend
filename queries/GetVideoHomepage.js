import { gql } from '@apollo/client'

export const GetVideoHomepage = gql`
  query GetVideoHomepage {
    videos(
      first: 1
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
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
            customLink
            customText
          }
        }
      }
    }
  }
`
