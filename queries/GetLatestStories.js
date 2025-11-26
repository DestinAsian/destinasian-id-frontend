import { gql } from '@apollo/client'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'

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
                id
                name
                uri
                parent {
                  node {
                    id
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
