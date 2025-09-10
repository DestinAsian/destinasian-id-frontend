import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'

import Heading from '../../components/Heading/Heading'
import TravelGuidesMenu from '../../components/TravelGuidesMenu/TravelGuidesMenu'
import styles from './TravelGuidesEntryHeader.module.scss'

const cx = classNames.bind(styles)

export default function TravelGuidesEntryHeader({ title }) {
  const [isNavShown, setIsNavShown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Prevent body scroll when navigation menu is open
  useEffect(() => {
    document.body.style.overflow = isNavShown ? 'hidden' : 'visible'
  }, [isNavShown])

  // Detect scroll to add sticky behavior
  useEffect(() => {
    let prevScrollPos = window.scrollY

    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show sticky menu only if not at bottom
      if (
        currentScrollPos < prevScrollPos &&
        currentScrollPos > 0 &&
        currentScrollPos + windowHeight < documentHeight
      ) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      prevScrollPos = currentScrollPos
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleNav = () => setIsNavShown((prev) => !prev)

  return (
    <div className={cx('component', isNavShown && 'show')}>
      <div className={cx('content-wrapper', isNavShown && 'show')}>
        <div className={cx('title-wrapper')}>
          {title && <Heading className={cx('title')}>{title}</Heading>}
        </div>

        {/* Menu buttons */}
        <div className={cx(isScrolled ? 'sticky-text-menu-wrapper' : 'text-menu-wrapper')}>
          <div className={cx('menu-button')}>
            {!isNavShown ? (
              <button
                type="button"
                className={cx('menu-icon')}
                onClick={toggleNav}
                aria-label="Open navigation menu"
              >
                All Guides
              </button>
            ) : (
              <button
                type="button"
                className={cx('close-icon')}
                onClick={toggleNav}
                aria-label="Close navigation menu"
              >
                {/* Close icon */}
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <g fill="#000000" stroke="none">
                    <path d="M2330 5109 c-305-29-646-126-910-259..." />
                  </g>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Full menu */}
        <div className={cx('full-menu-wrapper', isNavShown && 'show')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </div>
  )
}
