import { useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import className from 'classnames/bind'
import styles from './ContentWrapperContestFrontPage.module.scss'
import { GetContestPages } from '../../queries/GetContestPages'
import { Button, ContestPost } from '../../components'

let cx = className.bind(styles)

export default function ContentWrapperContestFrontPage() {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const postsPerPage = 4

  // Get Pages
  const { data, error, loading, fetchMore } = useQuery(GetContestPages, {
    variables: {
      first: postsPerPage,
      after: null,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return prev
    }

    return {
      ...data,
      contests: {
        ...data?.contests,
        edges: [...data?.contests?.edges, ...fetchMoreResult?.contests?.edges],
        pageInfo: fetchMoreResult?.contests?.pageInfo,
      },
    }
  }

  // Fetch more stories when scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight

      if (
        scrolledToBottom &&
        !isFetchingMore &&
        data?.contests?.pageInfo?.hasNextPage
      ) {
        fetchMore({
          variables: {
            first: postsPerPage,
            after: data?.contests?.pageInfo?.endCursor,
          },
          updateQuery,
        })
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [data, fetchMore])

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  if (loading) {
    return (
      <>
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
          <Button className="gap-x-4	">{'Loading...'}</Button>
        </div>
      </>
    )
  }

  // Declare all posts
  const allPosts = data?.contests?.edges.map((post) => post.node) || []

  return (
    <article className={cx('component')}>
      <div className={cx('full-wrapper')}>
        {allPosts.length === 0 && (
          <div className={cx('no-contest')}>
            {"We don't have any contests available right now..."}
          </div>
        )}
        {allPosts.length !== 0 &&
          allPosts.map((post, index) => (
            <React.Fragment key={post?.id}>
              <ContestPost
                title={post?.title}
                uri={post?.uri}
                featuredImage={post?.featuredImage?.node}
              />
            </React.Fragment>
          ))}
        {allPosts.length !== 0 && allPosts.length && (
          <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
            {data?.contests?.pageInfo?.hasNextPage &&
              data?.contests?.pageInfo?.endCursor && (
                <Button
                  onClick={() => {
                    if (
                      !isFetchingMore &&
                      data?.contests?.pageInfo?.hasNextPage
                    ) {
                      setIsFetchingMore(true)
                      fetchMore({
                        variables: {
                          first: postsPerPage,
                          after: data?.contests?.pageInfo?.endCursor,
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
              )}
          </div>
        )}
      </div>
    </article>
  )
}
