import classNames from 'classnames/bind'
import { gql } from '@apollo/client'
import styles from './NavigationMenu.module.scss'
import stylesFromWP from './NavigationMenuClassesFromWP.module.scss'
import flatListToHierarchical from '../../utilities/flatListToHierarchical'
import Link from 'next/link'
import { useMemo } from 'react'

const cx = classNames.bind(styles)
const cxFromWp = classNames.bind(stylesFromWP)

export default function NavigationMenu({ menuItems, className }) {
  if (!menuItems?.length) return null

  const firstItem = menuItems[0]
  const menuName = firstItem?.menu?.node?.name

  // Memoized hierarchy conversion
  const hierarchicalMenuItems = useMemo(
    () => flatListToHierarchical(menuItems),
    [menuItems]
  )

  const renderMenu = (items) => (
    <ul className={cx('menu')}>
      {items.map(({ id, path, label, children = [], cssClasses }) => (
        <li key={id} className={cxFromWp(cssClasses)}>
          {path && (
            <Link href={path} className={cx('menu-item')}>
              {label || ''}
            </Link>
          )}
          {children.length > 0 && renderMenu(children)}
        </li>
      ))}
    </ul>
  )

  return (
    <nav
      className={cx('component', className)}
      role="navigation"
      aria-label={menuName}
    >
      <ul className={cx('menu-name')}>
        {firstItem?.path && firstItem.path !== '#' ? (
          <Link href={firstItem.path}>{menuName}</Link>
        ) : (
          menuName
        )}
      </ul>
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
