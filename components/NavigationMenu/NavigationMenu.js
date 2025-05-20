import classNames from 'classnames/bind'
import { gql } from '@apollo/client'
import styles from './NavigationMenu.module.scss'
import stylesFromWP from './NavigationMenuClassesFromWP.module.scss'
import flatListToHierarchical from '../../utilities/flatListToHierarchical'
import Link from 'next/link'

let cx = classNames.bind(styles)
let cxFromWp = classNames.bind(stylesFromWP)

export default function NavigationMenu({ menuItems, className }) {
  if (!menuItems) {
    return null
  }

  // Based on https://www.wpgraphql.com/docs/menus/#hierarchical-data
  const hierarchicalMenuItems = flatListToHierarchical(menuItems)
  const menuName = menuItems[0]?.menu?.node?.name

  function renderMenu(items) {
    return (
      <ul className={cx('menu')}>
        {items.map((item) => {
          const { id, path, label, children, cssClasses } = item

          // @TODO - Remove guard clause after ghost menu items are no longer appended to array.
          if (!item.hasOwnProperty('__typename')) {
            return null
          }

          return (
            <li key={id} className={cxFromWp(cssClasses)}>
              {path && (
                <Link href={path} className={cx('menu-item')}>
                  {label ?? ''}
                </Link>
              )}
              {children.length ? renderMenu(children) : null}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <nav
      className={cx(['component', className])}
      role="navigation"
      aria-label={menuName}
    >
      <ul className={cx('menu-name')}>{menuName}</ul>
      {renderMenu(hierarchicalMenuItems)}
    </nav>
  )
}

NavigationMenu.fragments = {
  entry: gql`
    fragment NavigationMenuItemFragment on MenuItem {
      id
      path
      label
      parentId
      cssClasses
      menu {
        node {
          name
        }
      }
    }
  `,
}
