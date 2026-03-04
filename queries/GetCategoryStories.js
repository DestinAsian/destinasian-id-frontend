import { gql } from '@apollo/client'

export const GetCategoryStories = gql`
  query GetCategoryStories(
    $first: Int
    $after: String
    $id: ID!
    $contentTypes: [ContentTypesOfCategoryEnum]
  ) {
    category(id: $id, idType: DATABASE_ID) {
      id
      name
      parent {
        node {
          id
          name
        }
      }
      contentNodes(
        first: $first
        after: $after
        where: {
          status: PUBLISH
          contentTypes: $contentTypes
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
              uri
              excerpt
              content
              featuredImage {
                node {
                  id
                  sourceUrl
                  mediaItemUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              author {
                node {
                  id
                  name
                }
              }
              categories(where: { childless: true }) {
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
            ... on TravelGuide {
              id
              title
              uri
              excerpt
              content
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
                  mediaItemUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              author {
                node {
                  id
                  name
                }
              }
              categories(where: { childless: true }) {
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
    }
  }
`
