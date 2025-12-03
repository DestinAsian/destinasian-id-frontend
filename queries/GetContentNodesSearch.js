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
        date
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
          date
          categories {
            edges {
              node {
                name
                uri
              }
              isPrimary
            }
          }
        }

        ... on TravelGuide {
          date
          categories {
            edges {
              node {
                name
                uri
              }
              isPrimary
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
