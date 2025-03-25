import { gql } from '@apollo/client'

export const PostFragment = gql`
  fragment PostFragment on Post {
    id
    title
    content
    date
    uri
    excerpt
    ...FeaturedImageFragment
  }
`
