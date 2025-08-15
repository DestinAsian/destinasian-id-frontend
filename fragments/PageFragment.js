// queries/fragments/PageFragment.js
import { gql } from '@apollo/client'

export const PageFragment = gql`
  fragment PageFragment on Page {
    id
    databaseId
    slug
    title
    uri
    date
    modified
    content
    featuredImage {
      node {
        id
        altText
        sourceUrl
        srcSet
        sizes
      }
    }
    author {
      node {
        id
        name
        slug
        avatar {
          url
          width
          height
        }
      }
    }
    seo {
      title
      metaDesc
      metaKeywords
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
    }
  }
`
