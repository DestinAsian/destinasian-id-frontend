import { gql } from '@apollo/client'
import { FeaturedImage } from '../components/FeaturedImage/FeaturedImage' // pastikan path sesuai

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
  ${FeaturedImage.fragments.entry}
`
