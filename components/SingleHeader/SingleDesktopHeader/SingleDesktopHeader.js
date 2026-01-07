'use client'

import React from 'react'
import classNames from 'classnames/bind'
import Link from 'next/link'

import TravelGuidesMenu from '../../../components/TravelGuidesMenu/TravelGuidesMenu'
import styles from './SingleDesktopHeader.module.scss'

const cx = classNames.bind(styles)

export default function SingleDesktopHeader({
  categories = [],
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const toggleGuides = () => {
    setIsGuidesNavShown(!isGuidesNavShown)
    setSearchQuery('')
  }

  return (
    <>
      {/* TOP NAV */}
      <nav className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          {/* GUIDES BUTTON */}
          <button
            type="button"
            className={cx('menu-button', 'menu-button-guides', {
              active: isGuidesNavShown,
            })}
            onClick={toggleGuides}
            aria-label="Toggle guides navigation"
          >
            <span className={cx('menu-title')}>Guides</span>
          </button>

          {/* CATEGORY LINKS */}
          {categories.map(({ node }) => (
            <Link
              key={node.id}
              href={node.uri}
              className={cx('menu-button')}
            >
              <span className={cx('menu-title')}>{node.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* GUIDES DROPDOWN */}
      {isGuidesNavShown && (
        <div className={cx('full-menu-content', 'show')}>
          <div className={cx('full-menu-wrapper')}>
            <TravelGuidesMenu />
          </div>
        </div>
      )}
    </>
  )
}
