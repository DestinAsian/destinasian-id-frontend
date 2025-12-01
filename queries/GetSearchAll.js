import { gql } from '@apollo/client'

export const GetSearchAll = gql`
  query GetSearchAll($search: String!, $first: Int = 20) {
    contentNodes(
      where: {
        search: $search
        status: PUBLISH
        contentTypes: [POST, TRAVEL_GUIDE, CONTEST]
      }
      first: $first
    ) {
      nodes {
        __typename
        id
        uri

        ... on Post {
          title
          excerpt
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories(where: { childless: true }) {
            edges {
              node {
                name
                uri
              }
            }
          }
          contentType {
            node {
              label
            }
          }
        }

        ... on TravelGuide {
          title
          excerpt
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories(where: { childless: true }) {
            edges {
              node {
                name
                uri
              }
            }
          }
          contentType {
            node {
              label
            }
          }
        }

        ... on Contest {
          title
          excerpt
          slug
          featuredImage {
            node {
              sourceUrl
              altText
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
  }
`
