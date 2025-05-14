



import { gql } from '@apollo/client'

export const GetAllGuides = gql`
  query GetAllGuides {
    guides(first: 100) {
      edges {
        node {
          id
          title
          slug
          uri
          content
          link
          featuredImage {
            node {
              mediaItemUrl
              title
            }
          }
          categories {
            nodes {
              id
              name
              slug
              uri
              parentId
            }
          }
        }
      }
    }
  }
`



// import { gql } from '@apollo/client'

// export const GetGuides = gql`
//   queryAllGuides($id: ID!) {
//     guide(id: $id, idType: DATABASE_ID) {
//       content
//       id
//       link
//       slug
//       title
//       uri
//       featuredImage {
//         node {
//           mediaItemUrl
//           title
//         }
//       }
//       categories(first: 10) {
//         edges {
//           node {
//             children(first: 10) {
//               edges {
//                 node {
//                   id
//                   name
//                   slug
//                   uri
//                 }
//               }
//             }
//             contentNodes(first: 10) {
//               edges {
//                 node {
//                   id
//                   ... on Guide {
//                     id
//                     slug
//                     content
//                     link
//                     title
//                     uri
//                     featuredImage {
//                       node {
//                         mediaItemUrl
//                       }
//                     }
//                     categories {
//                       nodes {
//                         name
//                         uri
//                         slug
//                       }
//                     }
//                     contentTypeName
//                   }
//                 }
//               }
//             }
//             parent {
//               node {
//                 name
//                 slug
//                 uri
//                 id
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `



