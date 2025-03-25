import { gql } from '@apollo/client'
import { NavigationMenu } from '../components'

export const GetMenus = gql`
  ${NavigationMenu.fragments.entry}
  query GetMenus(
    $first: Int
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    headerMenuItems: menuItems(
      where: { location: $headerLocation }
      first: $first
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(
      where: { location: $footerLocation }
      first: $first
    ) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`
