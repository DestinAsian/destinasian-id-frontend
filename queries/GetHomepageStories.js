import { gql } from '@apollo/client'
import { FeaturedImage } from '../components'

export const GetHomepageStories = gql`
  ${FeaturedImage.fragments.entry}
  query GetHomepageStories($first: Int, $after: String) {
    contentNodes(
      first: $first
      after: $after
      where: {
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
        contentTypes: [GUIDE]
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          uri
          ... on Guide {
            title
            contentTypeName
            content
            date
            ...FeaturedImageFragment
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
`




// import { gql } from '@apollo/client'
// import { FeaturedImage } from '../components'

// export const GetHomepageStories = gql`
//   ${FeaturedImage.fragments.entry}
//   query GetHomepageStories($first: Int, $after: String) {
//     contentNodes(
//       first: $first
//       after: $after
//       where: {
//         status: PUBLISH
//         orderby: { field: DATE, order: DESC }
//         contentTypes: [GUIDE]
//       }
//     ) {
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//       edges {
//         node {
//           id
//           uri
//           ... on Guide {
//             id
//             title
//             uri
//             content
//             date
//             contentTypeName
//             featuredImage {
//               node {
//                 mediaItemUrl
//                 slug
//                 uri
//                 title
//                 caption
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `
// // import { gql } from '@apollo/client'
// // import { FeaturedImage } from '../components'

// // export const GetHomepageStories = gql`
// //   ${FeaturedImage.fragments.entry}
// //   query GetHomepageStories($first: Int, $after: String) {
// //     contentNodes(
// //       first: $first
// //       after: $after
// //       where: {
// //         status: PUBLISH
// //         orderby: { field: DATE, order: DESC }
// //         contentTypes: [EDITORIAL, GUIDE]
// //       }
// //     ) {
// //       pageInfo {
// //         hasNextPage
// //         endCursor
// //       }
// //       edges {
// //         node {
// //           id
// //           uri
// //           ... on Editorial {
// //             title
// //             contentTypeName
// //             content
// //             date
// //             excerpt
// //             ...FeaturedImageFragment
// //             categories {
// //               edges {
// //                 node {
// //                   name
// //                   uri
// //                   parent {
// //                     node {
// //                       name
// //                     }
// //                   }
// //                 }
// //               }
// //             }
// //             ... on Guide {
// //               id
// //               title
// //               uri
// //               content
// //               date
// //               contentTypeName
// //               featuredImage {
// //                 node {
// //                   mediaItemUrl
// //                   slug
// //                   uri
// //                   title
// //                   caption
// //                 }
// //               }
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }
// // `
