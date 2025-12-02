import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import Link from 'next/link'
import destinasianLogoBlk from '../../assets/logo/destinasian-indo-logo.png'
import destinasianLogoWht from '../../assets/logo/DAI_logo.png'
import { IoSearchOutline } from 'react-icons/io5'
import Container from '../../components/Container/Container'
import FullMenu from '../../components/FullMenu/FullMenu'
import styles from './HomepageHeader.module.scss'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'

let cx = classNames.bind(styles)

export default function HomepageHeader({
  primaryMenuItems,
  secondaryMenuItems,
  thirdMenuItems,
  fourthMenuItems,
  fifthMenuItems,
  featureMenuItems,
  latestStories,
  menusLoading,
  latestLoading,
  searchQuery,
  setSearchQuery,
  isNavShown,
  setIsNavShown,
  isScrolled,
}) {
  const isDesktop = useMediaQuery({ minWidth: 768 })
  const [isMenuOpen, setMenuOpen] = useState(false)
  // Tambahkan class "menu-open" ke <body> saat menu dibuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }, [isMenuOpen])
  // Clear search input
  const clearSearch = () => {
    setSearchQuery('') // Reset the search query
  }

 

  const isSearchResultsVisible = !!searchQuery


 

  return (
    <header className={cx('component', { white: isNavShown })}>
      {/* Responsive header */}
      {isDesktop || (!isDesktop && !isNavShown) ? (
        <Container>
          <div
            className={cx('navbar', {
              sticky: isScrolled && !isNavShown && !isMenuOpen,
            })}
          >
            {/* DAI logo */}

            <Link href="/" className={cx('title')}>
              <div className={cx('brand')}>
                {isNavShown ? (
                  <Image
                    src={destinasianLogoWht.src}
                    alt="Destinasian Logo"
                    fill
                    sizes="100%"
                    priority
                  />
                ) : (
                  <Image
                    src={
                      isScrolled
                        ? destinasianLogoBlk.src
                        : destinasianLogoWht.src
                    }
                    alt="Destinasian Logo"
                    fill
                    sizes="100%"
                    priority
                  />
                )}
              </div>
            </Link>

            {/* Homepage */}
            <Container>
              {/* Menu Button */}
              {isNavShown == false ? (
                <div className={cx('menu-button-wrapper')}>
                  <div className={cx('search-button')}>
                    {/* search button */}
                    <button
                      type="button"
                      className={cx('search-icon')}
                      onClick={() => {
                        setIsNavShown(!isNavShown)
                        setSearchQuery('')
                      }}
                      aria-label="Toggle navigation"
                      aria-controls={cx('full-menu-wrapper')}
                      aria-expanded={!isNavShown}
                    >
                      <IoSearchOutline className={cx('search-icon')} />
                    </button>
                  </div>
                  <div className={cx('menu-button')}>
                    {/* Divider */}
                    {isScrolled ? (
                      <div className={cx('divider-vertical')} />
                    ) : (
                      <div className={cx('divider-vertical-white')} />
                    )}
                    {/* menu button */}
                    {isScrolled ? (
                      <button
                        type="button"
                        className={cx('menu-icon')}
                        onClick={() => {
                          setIsNavShown(!isNavShown)
                          setSearchQuery('')
                        }}
                        aria-label="Toggle navigation"
                        aria-controls={cx('full-menu-wrapper')}
                        aria-expanded={!isNavShown}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="200"
                          height="200"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="1"
                            y="3"
                            width="100"
                            height="2"
                            fill="black"
                          />
                          <rect
                            x="1"
                            y="11"
                            width="100"
                            height="2"
                            fill="black"
                          />
                          <rect
                            x="1"
                            y="19"
                            width="100"
                            height="2"
                            fill="black"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={cx('menu-icon')}
                        onClick={() => {
                          setIsNavShown(!isNavShown)
                          setSearchQuery('')
                        }}
                        aria-label="Toggle navigation"
                        aria-controls={cx('full-menu-wrapper')}
                        aria-expanded={!isNavShown}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="200"
                          height="200"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="1"
                            y="3"
                            width="100"
                            height="2"
                            fill="white"
                          />
                          <rect
                            x="1"
                            y="11"
                            width="100"
                            height="2"
                            fill="white"
                          />
                          <rect
                            x="1"
                            y="19"
                            width="100"
                            height="2"
                            fill="white"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className={cx('menu-button')}>
                  {/* close button */}
                  <button
                    type="button"
                    className={cx('close-icon')}
                    onClick={() => {
                      setIsNavShown(!isNavShown)
                      setSearchQuery('')
                    }}
                    aria-label="Toggle navigation"
                    aria-controls={cx('full-menu-wrapper')}
                    aria-expanded={!isNavShown}
                  >
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="512.000000pt"
                      height="512.000000pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path
                          d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              )}
            </Container>
          </div>
        </Container>
      ) : (
        <Container>
          <div className={cx('close-button', { sticky: isScrolled })}>
            {/* close button */}
            <button
              type="button"
              className={cx('close-icon')}
              onClick={() => {
                setIsNavShown(!isNavShown)
                clearSearch
              }}
              aria-label="Toggle navigation"
              aria-controls={cx('primary-navigation')}
              aria-expanded={!isNavShown}
            >
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="512.000000pt"
                height="512.000000pt"
                viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                  fill="#fff"
                  stroke="none"
                >
                  <path
                    d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                  />
                </g>
              </svg>
            </button>
          </div>
        </Container>
      )}

      {/* Full menu */}
      <div
        className={cx(['full-menu-wrapper', isNavShown ? 'show' : undefined])}
      >
        <FullMenu
          primaryMenuItems={primaryMenuItems}
          secondaryMenuItems={secondaryMenuItems}
          thirdMenuItems={thirdMenuItems}
          fourthMenuItems={fourthMenuItems}
          fifthMenuItems={fifthMenuItems}
          featureMenuItems={featureMenuItems}
          latestStories={latestStories}
          clearSearch={clearSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          menusLoading={menusLoading}
          latestLoading={latestLoading}
          isSearchResultsVisible={isSearchResultsVisible}
        />
      </div>
    </header>
  )
}
