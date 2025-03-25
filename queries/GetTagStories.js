import { gql } from '@apollo/client'

export const GetTagStories = gql`
  query GetTagStories(
    $first: Int
    $after: String
    $id: ID!
    $contentTypes: [ContentTypesOfTagEnum]
  ) {
    tag(id: $id, idType: DATABASE_ID) {
      name
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
              acfCategoryIcon {
                categoryLabel
                chooseYourCategory
                chooseIcon {
                  mediaItemUrl
                }
              }
              acfLocationIcon {
                fieldGroupName
                locationLabel
                locationUrl
              }
            }
            ... on Editorial {
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
            ... on Update {
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
  }
`
