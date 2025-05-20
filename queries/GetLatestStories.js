import { gql } from '@apollo/client'
import { FeaturedImage } from '../components'

export const GetLatestStories = gql`
  ${FeaturedImage.fragments.entry}
  query GetLatestStories($first: Int) {
    posts(first: $first, where: { status: PUBLISH }) {
      edges {
        node {
          id
          title
          content
          date
          uri
          excerpt
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
    guides(first: $first, where: { status: PUBLISH }) {
      edges {
        node {
          id
          title
          content
          date
          uri
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
`
