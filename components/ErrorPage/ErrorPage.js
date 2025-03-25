import { useQuery } from '@apollo/client'
import { useState } from 'react'
import className from 'classnames/bind'
import { SearchInput, SearchResults, FeaturedImage, Button } from '../../components'
import styles from './ErrorPage.module.scss'
import { GetSearchResults } from '../../queries/GetSearchResults'
import appConfig from '../../app.config'
import Link from 'next/link'

let cx = className.bind(styles)

export default function ErrorPage({ image, title, content }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const postsPerPage = 5

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('') // Reset the search query
  }

  // Add search query function
  const {
    data: searchResultsData,
    loading: searchResultsLoading,
    error: searchResultsError,
    fetchMore,
  } = useQuery(GetSearchResults, {
    variables: {
      first: appConfig.postsPerPage,
      after: '',
      search: searchQuery,
    },
    skip: searchQuery === '',
    fetchPolicy: 'network-only',
  })

  // Update query when load more button clicked
  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev

    return {
      ...searchResultsData,
      tags: {
        ...searchResultsData?.tags,
        edges: [
          ...searchResultsData?.tags?.edges,
          ...fetchMoreResult?.tags?.edges,
        ],
        pageInfo: fetchMoreResult?.tags?.pageInfo,
      },
    }
  }

  // Check if the search query is empty and no search results are loading, then hide the SearchResults component
  const isSearchResultsVisible = !!searchQuery

  // Create a Set to store unique databaseId values
  const uniqueDatabaseIds = new Set()

  // Initialize an array to store unique posts
  const contentNodesPosts = []

  // Loop through all the contentNodes posts
  searchResultsData?.tags?.edges.forEach((contentNodes) => {
    contentNodes.node?.contentNodes?.edges.forEach((post) => {
      const { databaseId } = post.node

      // Check if the databaseId is unique (not in the Set)
      if (!uniqueDatabaseIds.has(databaseId)) {
        uniqueDatabaseIds.add(databaseId) // Add the databaseId to the Set
        contentNodesPosts.push(post.node) // Push the unique post to the array
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
    <div className={cx(['component', className])}>
      <div className={cx('image-wrapper')}>
        {image && (
          <FeaturedImage image={image} className={cx('image')} priority />
        )}
      </div>
      {/* <div className={cx('title-wrapper')}>{title}</div> */}
      <div className={cx('upper-wrapper')}>
        <div
          className={cx('content-wrapper')}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className={cx('search-bar-wrapper')}>
          <div className={cx('search-input-wrapper')}>
            <SearchInput
              value={searchQuery}
              onChange={(newValue) => setSearchQuery(newValue)}
              clearSearch={clearSearch}
            />
          </div>
          <div className={cx('search-result-wrapper')}>
            {searchResultsError && (
              <div className="alert-error">
                {'An error has occurred. Please refresh and try again.'}
              </div>
            )}
            {isSearchResultsVisible && (
              <SearchResults
                searchResults={contentNodesPosts}
                isLoading={searchResultsLoading}
              />
            )}
            {searchResultsData?.tags?.pageInfo?.hasNextPage &&
              searchResultsData?.tags?.pageInfo?.endCursor && (
                <div className="mx-auto my-0 flex w-[100vw] justify-center	">
                  <Button
                    onClick={() => {
                      if (
                        !isFetchingMore &&
                        searchResultsData?.tags?.pageInfo?.hasNextPage
                      ) {
                        setIsFetchingMore(true) // Set flag to indicate fetch in progress
                        fetchMore({
                          variables: {
                            first: postsPerPage,
                            after: searchResultsData?.tags?.pageInfo?.endCursor,
                          },
                          updateQuery,
                        }).then(() => {
                          setIsFetchingMore(false) // Reset the flag after fetch is done
                        })
                      }
                    }}
                    className="gap-x-4	"
                  >
                    {isFetchingMore ? (
                      'Loading...' // Display loading text when fetching
                    ) : (
                      <>
                        Load More{' '}
                        <svg
                          className="h-auto w-8 origin-center rotate-90"
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
                              d="M1387 5110 c-243 -62 -373 -329 -272 -560 27 -62 77 -114 989 -1027
l961 -963 -961 -963 c-912 -913 -962 -965 -989 -1027 -40 -91 -46 -200 -15
-289 39 -117 106 -191 220 -245 59 -28 74 -31 160 -30 74 0 108 5 155 23 58
22 106 70 1198 1160 1304 1302 1202 1185 1202 1371 0 186 102 69 -1202 1371
-1102 1101 -1140 1137 -1198 1159 -67 25 -189 34 -248 20z"
                            />
                          </g>
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className={cx('footer-wrapper')}>
        {'Go to '}
        <Link href="/">{'DestinAsian.com'}</Link>
      </div>
    </div>
  )
}
