import { gql } from '@apollo/client'

export const GetSearchResults = gql`
  query GetSearchResults($first: Int!, $after: String, $search: String!) {
    tags(
      first: $first
      after: $after
      where: { search: $search, hideEmpty: true }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          contentNodes(
            where: {
              status: PUBLISH
              contentTypes: [POST, TRAVEL_GUIDE, CONTEST]
            }
            first: $first
          ) {
            edges {
              node {
                __typename
                id
                uri
                databaseId

                contentType {
                  node {
                    label
                  }
                }

                # POST
                ... on Post {
                  title
                  excerpt
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
                }

                # TRAVEL GUIDE
                ... on TravelGuide {
                  title
                  excerpt
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
                }

                # CONTEST
                ... on Contest {
                  title
                  excerpt
                  featuredImage {
                    node {
                      sourceUrl
                      altText
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
