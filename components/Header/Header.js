import classNames from 'classnames/bind'
import Link from 'next/link'
import destinasianLogo from '../../assets/logo/destinasian-indo-logo.png'
import dynamic from 'next/dynamic'
import styles from './Header.module.scss'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useQuery } from '@apollo/client'
import { GetSearchResults } from '../../queries/GetSearchResults'
import { FaSearch } from 'react-icons/fa'

const Container = dynamic(() => import('../../components/Container/Container'))
const FullMenu = dynamic(() => import('../../components/FullMenu/FullMenu'))
const SearchResults = dynamic(() => import('../../components/SearchResults/SearchResults'))

const cx = classNames.bind(styles)

export default function Header({
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
  const clearSearch = () => setSearchQuery('')

  const { data, loading, error } = useQuery(GetSearchResults, {
    variables: { first: 1000, after: null, search: searchQuery },
    skip: !searchQuery,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const isSearchResultsVisible = !!searchQuery
  const uniquePosts = new Map()

  data?.categories?.edges?.forEach(({ node }) => {
    if (!uniquePosts.has(node.databaseId)) uniquePosts.set(node.databaseId, node)
  })

  data?.tags?.edges?.forEach(({ node }) => {
    node?.contentNodes?.edges?.forEach(({ node: post }) => {
      if (!uniquePosts.has(post.databaseId)) uniquePosts.set(post.databaseId, post)
    })
  })

  const contentNodesPosts = Array.from(uniquePosts.values()).sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <header className={cx('component', { sticky: isScrolled, navShown: isNavShown })}>
      {(isDesktop || (!isDesktop && !isNavShown)) ? (
        <Container>
          <div className={cx('navbar')}>
            <Link href="/" className={cx('title')}>
              <div className={cx('brand')}>
                <Image
                  src={destinasianLogo.src}
                  alt="Destinasian Logo"
                  width={120}
                  height={32}
                  priority
                />
              </div>
            </Link>
            <div className={cx('menu-button-wrapper')}>
              <button
                type="button"
                className={cx('search-icon')}
                onClick={() => { setIsNavShown(!isNavShown); clearSearch() }}
                aria-label="Toggle search"
              >
                <FaSearch className={cx('search-icon')} />
              </button>
              <button
                type="button"
                className={cx('menu-icon')}
                onClick={() => { setIsNavShown(!isNavShown); clearSearch() }}
                aria-label="Toggle menu"
              >
                <span className={cx('bar')}></span>
                <span className={cx('bar')}></span>
                <span className={cx('bar')}></span>
              </button>
            </div>
          </div>
        </Container>
      ) : (
        <Container>
          <div className={cx('close-button')}>
            <button
              type="button"
              className={cx('close-icon')}
              onClick={() => { setIsNavShown(!isNavShown); clearSearch() }}
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>
        </Container>
      )}

      {isSearchResultsVisible && (
        <div className={cx('search-bar-wrapper')}>
          <div className={cx('search-result-wrapper')}>
            {error && <div className={cx('alert-error')}>Terjadi kesalahan. Silakan muat ulang.</div>}
            <SearchResults searchResults={contentNodesPosts} isLoading={loading} />
          </div>
        </div>
      )}

      <div className={cx(['full-menu-wrapper', isNavShown && 'show'])}>
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
          searchResultsLoading={loading}
          searchResultsError={error}
          isSearchResultsVisible={isSearchResultsVisible}
        />
      </div>
    </header>
  )
}
