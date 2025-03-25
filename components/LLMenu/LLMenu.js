import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import { Button, LLPost, FeaturedImage } from '../../components'
import styles from './LLMenu.module.scss'
import React, { useState, useEffect } from 'react'
import { GetLuxeListMenu } from '../../queries/GetLuxeListMenu'
import Link from 'next/link'

let cx = classNames.bind(styles)

export default function LLMenu({ mainLogo, secondaryLogo, databaseId, uri }) {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const postsPerPage = 20

  // Get Pages
  const { data, error, loading, fetchMore } = useQuery(GetLuxeListMenu, {
    variables: {
      first: postsPerPage,
      after: null,
      id: databaseId,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // const updateQuery = (prev, { fetchMoreResult }) => {
  //   if (!fetchMoreResult) return prev

  //   return {
  //     ...data,
  //     luxeList: {
  //       ...data?.luxeList,
  //       children: {
  //         ...prev?.luxeList?.children,
  //         edges: [
  //           ...prev?.luxeList?.children?.edges,
  //           ...fetchMoreResult?.luxeList?.children?.edges,
  //         ],
  //         pageInfo: fetchMoreResult?.luxeList?.children?.pageInfo,
  //       },
  //     },
  //   }
  // }

  // // Fetch more stories when scroll to bottom
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrolledToBottom =
  //       window.scrollY + window.innerHeight >=
  //       document.documentElement.scrollHeight

  //     if (
  //       scrolledToBottom &&
  //       !isFetchingMore &&
  //       data?.luxeList?.children?.pageInfo?.hasNextPage
  //     ) {
  //       fetchMore({
  //         variables: {
  //           first: postsPerPage,
  //           after: data?.luxeList?.children?.pageInfo?.endCursor,
  //         },
  //         updateQuery,
  //       })
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll)

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [data, fetchMore])

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
  const allPosts =
    data?.luxeList?.children?.edges.map((post) => post.node) || []

  // Function to filter out duplicate categories
  const uniqueCategories = allPosts
    .reduce((unique, post) => {
      const categoryName = post?.categories?.edges[0]?.node?.name
      if (categoryName && !unique.includes(categoryName)) {
        unique.push(categoryName)
      }
      return unique
    }, [])
    .sort() // Sort alphabetically

  return (
    <div className={cx('component')}>
      {/* Full menu */}
      <div className={cx('full-menu-content')}>
        <div className={cx('ll-menu-header')}>
          {data?.luxeList?.uri && data?.luxeList?.title && (
            <div className={cx('title-header-wrapper')}>
              <Link href={data?.luxeList?.uri}>
                <span>{data?.luxeList?.title}</span>
              </Link>
            </div>
          )}
          {/* <div className={cx('image-wrapper')}>
            {secondaryLogo && uri ? (
              <Link href={uri}>
                <FeaturedImage
                  image={secondaryLogo}
                  className={cx('image')}
                  priority
                />
              </Link>
            ) : mainLogo && uri ? (
              <Link href={uri}>
                <FeaturedImage
                  image={mainLogo}
                  className={cx('image')}
                  priority
                />
              </Link>
            ) : null}
          </div> */}
        </div>
        <div className={cx('menu-wrapper')}>
          {uniqueCategories.map((categoryName, index) => (
            <div className={cx('menu-list-wrapper')} key={index}>
              <div className={cx('category-wrapper')}>
                <h2 className={cx('category')}>{categoryName}</h2>
              </div>
              {allPosts.map((post) => {
                const postCategory = post?.categories?.edges[0]?.node?.name
                if (postCategory === categoryName) {
                  return (
                    <div className={cx('content-wrapper')} key={post?.id}>
                      <div className={cx('title-wrapper')}>
                        {post?.uri && (
                          <Link href={post?.uri}>
                            <h2 className={cx('title')}>{post?.title}</h2>
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          ))}
          {/* {uniqueCategories.length && (
            <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
              {data?.luxeList?.children?.pageInfo?.hasNextPage &&
                data?.luxeList?.children?.pageInfo?.endCursor && (
                  <Button
                    onClick={() => {
                      if (
                        !isFetchingMore &&
                        data?.luxeList?.children?.pageInfo?.hasNextPage
                      ) {
                        setIsFetchingMore(true)
                        fetchMore({
                          variables: {
                            first: postsPerPage,
                            after:
                              data?.luxeList?.children?.pageInfo?.endCursor,
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
                            fill="#ffffff"
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
          )} */}
        </div>
      </div>
    </div>
  )
}
