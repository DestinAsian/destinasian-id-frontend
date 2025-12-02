'use client'

import classNames from 'classnames/bind'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu'
import styles from './FullMenu.module.scss'

const cx = classNames.bind(styles)

const SearchTags = dynamic(
  () => import('../../components/SearchTags/SearchTags'),
  { ssr: false }
)

export default function FullMenu({
  primaryMenuItems,
  secondaryMenuItems,
  thirdMenuItems,
  fourthMenuItems,
  fifthMenuItems,
  menusLoading,
  latestLoading,
}) {
  // Kontrol visibilitas menu saat search aktif
  const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false)

  // LOADING STATE
  if (menusLoading || latestLoading) {
    return (
      <div className="mx-auto flex max-w-[100vw] justify-center md:max-w-[700px]">
        <svg
          aria-hidden="true"
          className="h-[80vh] w-8 animate-spin fill-black text-gray-300"
          viewBox="0 0 100 101"
        >
          <path
            d="M100 50.6C100 78.2 77.6 100.6 50 100.6C22.4 100.6 0 78.2 0 50.6C0 23 22.4 0.6 50 0.6C77.6 0.6 100 23 100 50.6Z"
            fill="currentColor"
          />
          <path
            d="M93.97 39.04C96.39 38.40 97.86 35.91 97.01 33.55C95.29 28.82 92.87 24.36 89.82 20.34C85.84 15.11 80.88 10.72 75.21 7.41C69.54 4.10 63.28 1.94 56.77 1.05C51.77 0.37 46.69 0.44 41.73 1.28C39.26 1.69 37.81 4.19 38.45 6.62C39.08 9.04 41.57 10.47 44.05 10.10C47.85 9.54 51.72 9.52 55.54 10.04C60.86 10.77 65.99 12.54 70.63 15.25C75.27 17.96 79.33 21.56 82.58 25.84C84.91 28.91 86.80 32.29 88.18 35.87C89.08 38.21 91.54 39.68 93.97 39.04Z"
            fill="currentFill"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cx('component')}>
      <div className={cx('full-menu-content', { searchVisible: isSearchResultsVisible })}>

        {/* SEARCH BAR */}
        <div className={cx('search-bar-wrapper')}>
          <SearchTags setIsSearchResultsVisible={setIsSearchResultsVisible} />
        </div>

        {/* MENU WRAPPER – otomatis hidden jika search aktif */}
        <div className={cx('menu-wrapper', { hidden: isSearchResultsVisible })}>
          <div className={cx('second-wrapper')}>
            <NavigationMenu
              className={cx('primary-navigation')}
              menuItems={primaryMenuItems}
            />
          </div>

          <div className={cx('first-wrapper')}>
            <NavigationMenu
              className={cx('secondary-navigation')}
              menuItems={secondaryMenuItems}
            />
          </div>

          <div className={cx('third-wrapper')}>
            <NavigationMenu
              className={cx('third-navigation')}
              menuItems={thirdMenuItems}
            />
          </div>

          <div className={cx('fourth-wrapper')}>
            <div className={cx('left-wrapper')}>
              <NavigationMenu
                className={cx('fourth-navigation')}
                menuItems={fourthMenuItems}
              />
            </div>

            <div className={cx('right-wrapper')}>
              <NavigationMenu
                className={cx('fifth-navigation')}
                menuItems={fifthMenuItems}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}