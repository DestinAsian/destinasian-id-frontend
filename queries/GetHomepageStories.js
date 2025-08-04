import { gql } from '@apollo/client'
import  FeaturedImage from '../components/FeaturedImage/FeaturedImage'

export const GetHomepageStories = gql`
  ${FeaturedImage.fragments.entry}
  query GetHomepageStories($first: Int, $after: String) {
    contentNodes(
      first: $first
      after: $after
      where: {
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
        contentTypes: [GUIDE]
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          uri
          ... on Guide {
            title
            contentTypeName
            content
            date
            ...FeaturedImageFragment
            categories {
              edges {
                node {
                  name
                  uri
                  parent {
                    node {
                      name
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