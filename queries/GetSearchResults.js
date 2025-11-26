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
                  id
                  title
                  uri
                }
                ... on TravelGuide {
                  id
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
                id
                uri
                databaseId
                contentType {
                  node {
                    id
                    label
                    graphqlPluralName
                  }
                }
                ... on Post {
                  id
                  title
                  excerpt
                  date
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
                  excerpt
                  date
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
                ... on Page {
                  id
                  title
                  date
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
                }
                ... on Contest {
                  id
                  title
                  excerpt
                  date
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