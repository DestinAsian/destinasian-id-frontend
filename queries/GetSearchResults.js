import { gql } from '@apollo/client'

export const GetSearchResults = gql`
  query GetSearchResults($first: Int!, $after: String, $search: String) {
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
          uri
          databaseId
          name
          description
          parent {
            node {
              name
            }
          }
          children {
            edges {
              node {
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
          contentNodes(first: 10, where: { contentTypes: POST }) {
            edges {
              node {
                ... on Post {
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
              contentTypes: [
                POST
                PAGE
                TRAVER_GUIDE
                HONORS_CIRCLE
                CONTEST
                LUXURY_TRAVEL
              ]
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
                ... on HonorsCircle {
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
                ... on Editorial {
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
                  categories {
                    edges {
                      node {
                        name
                        uri
                      }
                    }
                  }
                }
                ... on Update {
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
                  categories {
                    edges {
                      node {
                        name
                        uri
                      }
                    }
                  }
                }
                ... on Advertorial {
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
                ... on LuxeList {
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
                ... on ReadersChoiceAward {
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
                ... on LuxuryTravel {
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
