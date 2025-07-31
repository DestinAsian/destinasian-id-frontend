import { gql } from '@apollo/client'

export const GetCategoryStories = gql`
  query GetCategoryStories($first: Int = 100, $after: String, $id: ID!) {
    category(id: $id, idType: DATABASE_ID) {
      name
      parent {
        node {
          name
        }
      }
      contentNodes(
        first: $first
        after: $after
        where: {
          status: PUBLISH
          contentTypes: [POST, TRAVEL_GUIDE]
          orderby: [{ field: DATE, order: DESC }]
        }
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            ... on Post {
              id
              title
              content
              date
              uri
              excerpt
              featuredImage {
                node {
                  id
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              author {
                node {
                  name
                }
              }
              categories(where: { childless: true }) {
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
            ... on TravelGuide {
              id
              title
              content
              date
              uri
              excerpt
              guide_book_now {
                fieldGroupName
                guideName
                linkBookNow
                guidePrice
                linkLocation
                guideLocation
              }
              featuredImage {
                node {
                  id
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              author {
                node {
                  name
                }
              }
              categories(where: { childless: true }) {
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
  }
`
