import { gql } from '@apollo/client'

export const GetSearchResults = gql`
  query GetSearchResults($first: Int!, $after: String, $search: String!) {
    categories(
      first: $first
      after: $after
      where: { search: $search, hideEmpty: true }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          uri
          databaseId
          name
          description
          parent {
            node {
              id
              name
            }
          }
          children {
            edges {
              node {
                id
                name
                uri
              }
            }
          }
          categoryImages {
            changeToSlider
            categoryImages {
              sourceUrl
            }
            categorySlide1 {
              sourceUrl
            }
          }
          destinationGuides {
            guidesTitle
          }
          contentNodes(
            first: 10
            where: { contentTypes: [POST, TRAVEL_GUIDE] }
          ) {
            edges {
              node {
                id
                ... on Post {
                  title
                  uri
                }
                ... on TravelGuide {
                  title
                  uri
                }
              }
            }
          }
        }
      }
    }
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
        node {
          contentNodes(
            where: {
              status: PUBLISH
              contentTypes: [POST, TRAVEL_GUIDE, CONTEST]
            }
            first: $first
          ) {
            edges {
              node {
                uri
                databaseId
                contentType {
                  node {
                    label
                    graphqlPluralName
                  }
                }
                ... on Post {
                  title
                  excerpt
                  date
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                      mediaDetails {
                        width
                        height
                      }
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
                  title
                  excerpt
                  date
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                      mediaDetails {
                        width
                        height
                      }
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
                ... on Page {
                  title
                  date
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                      mediaDetails {
                        width
                        height
                      }
                    }
                  }
                }
                ... on Contest {
                  title
                  excerpt
                  date
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                      mediaDetails {
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cursor
      }
    }
  }
`
