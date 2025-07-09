import { gql } from '@apollo/client'

export const GetCategoryUpdates = gql`
  query GetCategoryUpdates($include: [ID] = "41") {
    category(id: "3", idType: DATABASE_ID) {
      id
      name
      slug
      children(where: { include: $include }) {
        edges {
          node {
            id
            name
            slug
            description
            uri
            parent {
              node {
                name
              }
            }
            contentNodes(first: 100) {
              edges {
                cursor
                node {
                  id
                  databaseId
                  date
                  link
                  slug
                  uri
                  contentTypeName
                  ... on Post {
                    id
                    slug
                    title
                    uri
                    excerpt
                    featuredImage {
                      node {
                        mediaItemUrl
                      }
                    }
                    categories {
                      nodes {
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


// import { gql } from '@apollo/client'

// export const GetCategoryUpdates = gql`
//   query GetCategoryUpdates($first: Int, $after: String, $id: ID!) {
//     category(id: $id, idType: DATABASE_ID) {
//       name
//       parent {
//         node {
//           name
//         }
//       }
//       contentNodes(
//         first: $first
//         after: $after
//         where: {
//           status: PUBLISH
//           contentTypes: [POST, TRAVEL_GUIDE]
//           orderby: [{ field: DATE, order: DESC }]
//         }
//       ) {
//         pageInfo {
//           endCursor
//           hasNextPage
//         }
//         edges {
//           node {
//             ... on Post {
//               id
//               title
//               content
//               date
//               uri
//               excerpt
//               featuredImage {
//                 node {
//                   id
//                   sourceUrl
//                   altText
//                   mediaDetails {
//                     width
//                     height
//                   }
//                 }
//               }
//               author {
//                 node {
//                   name
//                 }
//               }
//               categories(where: { childless: true }) {
//                 edges {
//                   node {
//                     name
//                     uri
//                     parent {
//                       node {
//                         name
//                       }
//                     }
//                   }
//                 }
//               }
//               children(where: { include: $include }) {
//                 edges {
//                   node {
//                     id
//                     name
//                     slug
//                     description
//                     uri
//                     parent {
//                       node {
//                         name
//                       }
//                     }
//                     contentNodes(first: 1000) {
//                       edges {
//                         cursor
//                         node {
//                           id
//                           databaseId
//                           date
//                           link
//                           slug
//                           uri
//                           contentTypeName
//                           ... on Post {
//                             id
//                             slug
//                             title
//                             uri
//                             excerpt
//                             featuredImage {
//                               node {
//                                 mediaItemUrl
//                               }
//                             }
//                             categories {
//                               nodes {
//                                 name
//                               }
//                             }
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             ... on TravelGuide {
//               id
//               title
//               content
//               date
//               uri
//               excerpt
//               featuredImage {
//                 node {
//                   id
//                   sourceUrl
//                   altText
//                   mediaDetails {
//                     width
//                     height
//                   }
//                 }
//               }
//               author {
//                 node {
//                   name
//                 }
//               }
//               categories(where: { childless: true }) {
//                 edges {
//                   node {
//                     name
//                     uri
//                     parent {
//                       node {
//                         name
//                       }
//                     }
//                   }
//                 }
//               }
//               children(where: { include: $include }) {
//                 edges {
//                   node {
//                     id
//                     name
//                     slug
//                     description
//                     uri
//                     parent {
//                       node {
//                         name
//                       }
//                     }
//                     contentNodes(first: 1000) {
//                       edges {
//                         cursor
//                         node {
//                           id
//                           databaseId
//                           date
//                           link
//                           slug
//                           uri
//                           contentTypeName
//                           ... on Post {
//                             id
//                             slug
//                             title
//                             uri
//                             excerpt
//                             featuredImage {
//                               node {
//                                 mediaItemUrl
//                               }
//                             }
//                             categories {
//                               nodes {
//                                 name
//                               }
//                             }
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `