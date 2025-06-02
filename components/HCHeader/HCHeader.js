import classNames from 'classnames/bind'
import Link from 'next/link'
import destinasianLogo from '../../assets/logo/destinasian-logo.png'
import dynamic from 'next/dynamic'

const Container = dynamic(() => import('../../components/Container/Container'))
const FullMenu = dynamic(() => import('../../components/FullMenu/FullMenu'))
const SearchInput = dynamic(() => import('../../components/SearchInput/SearchInput'))
const SearchResults = dynamic(() => import('../../components/SearchResults/SearchResults'))
import styles from './HCHeader.module.scss'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useQuery } from '@apollo/client'
import { GetSearchResults } from '../../queries/GetSearchResults'

let cx = classNames.bind(styles)

export default function HCHeader({
  primaryMenuItems,
  secondaryMenuItems,
  thirdMenuItems,
  fourthMenuItems,
  fifthMenuItems,
  featureMenuItems,
  latestStories,
  menusLoading,
  latestLoading,
}) {
  const isDesktop = useMediaQuery({ minWidth: 768 })
  const [isNavShown, setIsNavShown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Stop scrolling pages when isNavShown
  useEffect(() => {
    if (isNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isNavShown])

  // Add sticky header on scroll
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  const postsPerPage = 1000

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('') // Reset the search query
  }

  // Add search query function
  const {
    data: searchResultsData,
    loading: searchResultsLoading,
    error: searchResultsError,
  } = useQuery(GetSearchResults, {
    variables: {
      first: postsPerPage,
      after: null,
      search: searchQuery,
    },
    skip: searchQuery === '',
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Check if the search query is empty and no search results are loading, then hide the SearchResults component
  const isSearchResultsVisible = !!searchQuery

  // Create a Set to store unique databaseId values
  const uniqueDatabaseIds = new Set()

  // Initialize an array to store unique posts
  const contentNodesPosts = []

  // Loop through categories (assuming similar structure)
  searchResultsData?.categories?.edges?.forEach((post) => {
    const { databaseId } = post.node

    if (!uniqueDatabaseIds.has(databaseId)) {
      uniqueDatabaseIds.add(databaseId)
      contentNodesPosts.push(post.node)
    }
  })

  // Loop through tags
  searchResultsData?.tags?.edges?.forEach((contentNodes) => {
    contentNodes.node?.contentNodes?.edges.forEach((post) => {
      const { databaseId } = post.node

      if (!uniqueDatabaseIds.has(databaseId)) {
        uniqueDatabaseIds.add(databaseId)
        contentNodesPosts.push(post.node)
      }
    })
  })

  // Sort contentNodesPosts array by date
  contentNodesPosts.sort((a, b) => {
    // Assuming your date is stored in 'date' property of the post objects
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    // Compare the dates
    return dateB - dateA
  })

  return (
    <header className={cx('component', { sticky: isScrolled })}>
      {/* Responsive header */}
      {isDesktop || (!isDesktop && !isNavShown) ? (
        <Container>
          <div className={cx('navbar')}>
            {/* DA logo */}
            <Link href="/" className={cx('title')}>
              <div className={cx('brand')}>
                {isNavShown ? (
                  <Image
                    src={destinasianLogo.src}
                    alt="Destinasian Logo"
                    fill
                    sizes="100%"
                    priority
                  />
                ) : (
                  <Image
                    src={destinasianLogo.src}
                    alt="DestinAsian Logo"
                    fill
                    sizes="100%"
                    priority
                  />
                )}
              </div>
            </Link>

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
                    <FaSearch className={cx('search-icon')} />
                  </button>
                </div>
                <div className={cx('menu-button')}>
                  {/* menu button */}
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
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="40.000000pt"
                      height="40.000000pt"
                      viewBox="0 0 40.000000 40.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,40.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path
                          d="M12 368 c-18 -18 -14 -46 7 -58 26 -13 336 -13 362 0 21 12 25 40 7
58 -17 17 -359 17 -376 0z"
                        />
                        <path
                          d="M12 228 c-7 -7 -12 -20 -12 -29 0 -35 23 -40 205 -37 157 3 179 5
189 21 8 12 8 22 0 35 -10 15 -32 17 -190 20 -131 2 -183 -1 -192 -10z"
                        />
                        <path
                          d="M17 89 c-20 -12 -22 -40 -5 -57 17 -17 359 -17 376 0 18 18 14 46 -7
58 -26 13 -340 13 -364 -1z"
                        />
                      </g>
                    </svg>
                  </button>
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
          </div>
        </Container>
      ) : (
        <Container>
          <div className={cx('close-button')}>
            {/* close button */}
            <button
              type="button"
              className={cx('close-icon')}
              onClick={() => {
                setIsNavShown(!isNavShown)
                setSearchQuery('')
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
        </Container>
      )}

      {/* Search Bar */}
      <div className={cx('search-bar-wrapper', { stickySearch: isScrolled })}>
        <div className={cx('search-input-wrapper')}>
          <SearchInput
            value={searchQuery}
            onChange={(newValue) => setSearchQuery(newValue)}
            clearSearch={clearSearch}
          />
        </div>
        <div className={cx('search-result-wrapper')}>
          {searchResultsError && (
            <div className={cx('alert-error')}>
              {'An error has occurred. Please refresh and try again.'}
            </div>
          )}

          {/* Conditionally render the SearchResults component */}
          {isSearchResultsVisible && (
            <SearchResults
              searchResults={contentNodesPosts}
              isLoading={searchResultsLoading}
            />
          )}
        </div>
      </div>

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
          contentNodesPosts={contentNodesPosts}
          searchResultsLoading={searchResultsLoading}
          searchResultsError={searchResultsError}
          isSearchResultsVisible={isSearchResultsVisible}
        />
      </div>
    </header>
  )
}
