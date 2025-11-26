import { gql } from '@apollo/client'

export const GetHomepagePinPosts = gql`
  query GetHomepagePinPosts($id: ID!, $asPreview: Boolean = false) {
    page(id: $id, idType: DATABASE_ID, asPreview: $asPreview) {
      homepagePinPosts {
        pinPost1 {
          ... on Post {
            id
            slug
            uri
            title
            contentTypeName
            featuredImage {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
            excerpt
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
          ... on Guide {
            id
            slug
            uri
            title
            content
            contentTypeName
            featuredImage {
              node {
                mediaItemUrl
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
                  slug
                  uri
                  name
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
        pinPost2 {
          ... on Post {
            id
            slug
            uri
            title
            contentTypeName
            featuredImage {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
            excerpt
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
          ... on Guide {
            id
            slug
            uri
            title
            content
            contentTypeName
            featuredImage {
              node {
                mediaItemUrl
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
                  slug
                  uri
                  name
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
        pinPost3 {
          ... on Post {
            id
            slug
            uri
            title
            contentTypeName
            featuredImage {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
            excerpt
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
          ... on Guide {
            id
            slug
            uri
            title
            content
            contentTypeName
            featuredImage {
              node {
                mediaItemUrl
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
                  slug
                  uri
                  name
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
`
