
import { gql } from '@apollo/client'

export const GetContentNodesSearch = gql`
  query GetContentNodesSearch($search: String!, $first: Int = 30) {
    contentNodes(where: { search: $search, status: PUBLISH }, first: $first) {
      nodes {
        __typename
        id
        databaseId
        uri
        slug

        ... on NodeWithTitle {
          title
        }

        ... on NodeWithExcerpt {
          excerpt
        }

        ... on NodeWithContentEditor {
          content
        }

        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }

        ... on Post {
          categories {
            edges {
              node {
                name
                uri
              }
            }
          }
        }

        ... on TravelGuide {
          categories {
            edges {
              node {
                name
                uri
              }
            }
          }
        }

        contentType {
          node {
            label
          }
        }
      }
    }
  }
`
