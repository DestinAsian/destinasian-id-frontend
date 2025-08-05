import classNames from 'classnames/bind'
import styles from './CategoryDesktopHeaderTravelGuide.module.scss'
import { useState, useEffect, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import { IoSearchOutline } from 'react-icons/io5'
import dynamic from 'next/dynamic'

import { GetSearchResults } from '../../queries/GetSearchResults'
import destinasianLogoBlk from '../../assets/logo/destinasian-indo-logo.png'
import destinasianLogoWht from '../../assets/logo/DAI_logo.png'

import FullMenu from '../../components/FullMenu/FullMenu'
const SearchResults = dynamic(() => import('../../components/SearchResults/SearchResults'))

const cx = classNames.bind(styles)
const POSTS_PER_PAGE = 1000

export default function CategoryDesktopHeaderTravelGuide({
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

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen)
  }, [isMenuOpen])

  const toggleNav = () => {
    setIsNavShown(!isNavShown)
    setSearchQuery('')
  }

  const { data, loading, error } = useQuery(GetSearchResults, {
    variables: { first: POSTS_PER_PAGE, after: null, search: searchQuery },
    skip: !searchQuery,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const isSearchResultsVisible = !!searchQuery

  const contentNodesPosts = useMemo(() => {
    const result = []
    const seenIds = new Set()

    data?.categories?.edges?.forEach(({ node }) => {
      if (!seenIds.has(node.databaseId)) {
        seenIds.add(node.databaseId)
        result.push(node)
      }
    })

    data?.tags?.edges?.forEach(({ node }) => {
      node.contentNodes?.edges?.forEach(({ node }) => {
        if (!seenIds.has(node.databaseId)) {
          seenIds.add(node.databaseId)
          result.push(node)
        }
      })
    })

    return result.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [data])

  const logoImage = isNavShown ? destinasianLogoWht : destinasianLogoBlk

  return (
    <header className={cx('component', { sticky: isScrolled, navShown: isNavShown, 'menu-active': isNavShown })}>
      {isDesktop || (!isDesktop && !isNavShown) ? (
        <div className={cx('navbar', { sticky: isScrolled && !isNavShown && !isMenuOpen, 'menu-active': isNavShown })}>
          <Link href="/" className={cx('title')}>
            <div className={cx('brand')}>
              <Image src={logoImage} alt="Destinasian Logo" fill sizes="auto" priority />
            </div>
          </Link>

          {!isNavShown ? (
            <div className={cx('menu-button-wrapper')}>
              <div className={cx('search-button')}>
                <button
                  type="button"
                  className={cx('search-icon')}
                  onClick={toggleNav}
                  aria-label="Toggle navigation"
                  aria-controls={cx('full-menu-wrapper')}
                  aria-expanded={!isNavShown}
                >
                  <IoSearchOutline className={cx('search-icon')} />
                </button>
              </div>

              <div className={cx('menu-button')}>
                <div className={cx('divider-vertical')} />
                <button
                  type="button"
                  className={cx('menu-icon')}
                  onClick={toggleNav}
                  aria-label="Toggle navigation"
                  aria-controls={cx('full-menu-wrapper')}
                  aria-expanded={!isNavShown}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="3" width="100" height="2" fill="black" />
                    <rect x="1" y="11" width="100" height="2" fill="black" />
                    <rect x="1" y="19" width="100" height="2" fill="black" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className={cx('menu-button')}>
              <button
                type="button"
                className={cx('close-icon')}
                onClick={toggleNav}
                aria-label="Close navigation"
                aria-controls={cx('full-menu-wrapper')}
                aria-expanded={!isNavShown}
              >
                ×
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={cx('close-button', { sticky: isScrolled })}>
          <button
            type="button"
            className={cx('close-icon')}
            onClick={toggleNav}
            aria-label="Close navigation"
            aria-controls={cx('primary-navigation')}
            aria-expanded={!isNavShown}
          >
            ×
          </button>
        </div>
      )}

      <div className={cx('search-bar-wrapper')}>
        <div className={cx('search-result-wrapper')}>
          {error && <div className={cx('alert-error')}>An error has occurred. Please refresh and try again.</div>}
          {isSearchResultsVisible && (
            <SearchResults searchResults={contentNodesPosts} isLoading={loading} />
          )}
        </div>
      </div>

      <div className={cx(['full-menu-wrapper', isNavShown && 'show'])}>
        <FullMenu
          primaryMenuItems={primaryMenuItems}
          secondaryMenuItems={secondaryMenuItems}
          thirdMenuItems={thirdMenuItems}
          fourthMenuItems={fourthMenuItems}
          fifthMenuItems={fifthMenuItems}
          featureMenuItems={featureMenuItems}
          latestStories={latestStories}
          clearSearch={() => setSearchQuery('')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          menusLoading={menusLoading}
          latestLoading={latestLoading}
          contentNodesPosts={contentNodesPosts}
          searchResultsLoading={loading}
          searchResultsError={error}
          isSearchResultsVisible={isSearchResultsVisible}
        />
      </div>
    </header>
  )
}
