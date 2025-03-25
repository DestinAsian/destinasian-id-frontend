import { gql } from '@apollo/client'
import { NavigationMenu } from '../components'

export const GetFooterMenus = gql`
  ${NavigationMenu.fragments.entry}
  query GetFooterMenus($first: Int, $footerHeaderLocation: MenuLocationEnum) {
    footerHeaderMenuItems: menuItems(
      where: { location: $footerHeaderLocation }
      first: $first
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`
