import { gql } from '@apollo/client'

export const GetContentNodesSearch = gql`
  query GetContentNodesSearch($search: String!, $first: Int = 30) {
    contentNodes(
      where: { search: $search, status: PUBLISH, contentTypes: [POST, TRAVEL_GUIDE] }
      first: $first
    ) {
      nodes {
        __typename
        id
        uri
        date

        ... on NodeWithTitle {
          title
        }

        ... on NodeWithExcerpt {
          excerpt
        }

        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
            }
          }
        }

        ... on Post {
          categories {
            edges {
              node {
                name
              }
              isPrimary
            }
          }
        }

        ... on TravelGuide {
          categories {
            edges {
              node {
                name
              }
              isPrimary
            }
          }
        }
      }
    }
  }
`
