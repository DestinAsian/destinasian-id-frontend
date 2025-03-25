import { gql } from '@apollo/client'

export const HeaderFooterVisibilityFragment = gql`
  fragment HeaderFooterVisibilityFragment on Page_Headerfootervisibility {
    footerVisibility
    headerVisibility
  }
`
