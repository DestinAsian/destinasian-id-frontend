'use client'

import React, { useState, useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './CategorySecondStories.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetCategoryStories } from '../../queries/GetCategoryStories'

import Button from '../../components/Button/Button'
import PostTwoColumns from '../../components/PostTwoColumns/PostTwoColumns'
import TextTwoColumns from '../../components/PostTwoColumns/TextTwoColumns'

const cx = classNames.bind(styles)

export default function CategorySecondStories({
  categoryUri,
  pinPosts,
  name,
  parent,
}) {
  const postsPerPage = 6
  const [visibleCount, setVisibleCount] = useState(postsPerPage)

  const uri = categoryUri
  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']

  /** =========================
   *  CATEGORY TYPE CHECK
   *  ========================= */
  const isTravelGuideCategory = useMemo(() => {
    const active = name?.toLowerCase() || ''
    const parentName = parent?.node?.name?.toLowerCase() || ''
    return (
      travelGuideRoots.includes(active) ||
      travelGuideRoots.includes(parentName)
    )
  }, [name, parent])

  const contentTypes = useMemo(
    () =>
      isTravelGuideCategory
        ? [CONTENT_TYPES.TRAVEL_GUIDES]
        : [CONTENT_TYPES.POST],
    [isTravelGuideCategory],
  )

  /** =========================
   *  APOLLO QUERY
   *  ========================= */
  const { data, error, loading, fetchMore } = useQuery(GetCategoryStories, {
    variables: {
      first: 30,
      after: null,
      id: uri,
      contentTypes,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  /** =========================
   *  APOLLO MERGE HANDLING
   *  ========================= */
  const handleFetchMore = () => {
    const pageInfo = data?.category?.contentNodes?.pageInfo
    if (!pageInfo?.hasNextPage) return

    fetchMore({
      variables: { after: pageInfo.endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev

        return {
          ...prev,
          category: {
            ...prev.category,
            contentNodes: {
              ...prev.category.contentNodes,
              edges: [
                ...prev.category.contentNodes.edges,
                ...fetchMoreResult.category.contentNodes.edges,
              ],
              pageInfo: fetchMoreResult.category.contentNodes.pageInfo,
            },
          },
        }
      },
    })
  }

  const fetchMorePosts = () => {
    setVisibleCount((prev) => prev + postsPerPage)
    handleFetchMore()
  }

  /** =========================
   *  POST PROCESSING
   *  ========================= */
  const mergedPosts = useMemo(() => {
    const allPosts = data?.category?.contentNodes?.edges?.map((p) => p.node) || []
    const pinned = pinPosts?.pinPost ? [pinPosts.pinPost] : []

    const merged = [...pinned, ...allPosts]
    const unique = []

    for (const post of merged) {
      if (post && !unique.some((x) => x?.id === post.id)) {
        unique.push(post)
      }
    }
    return unique
  }, [data, pinPosts])

  const startIndex = isTravelGuideCategory ? 2 : 0
  const postsToDisplay = mergedPosts.slice(startIndex, startIndex + visibleCount)

  /** =========================
   *  RENDERING
   *  ========================= */
  if (error)
    return <pre className="text-red-500">{JSON.stringify(error, null, 2)}</pre>

  if (!data && loading) {
    return (
      <div className="mx-auto flex max-w-full justify-center md:max-w-[700px]">
        <Button disabled className="gap-x-4 opacity-60">
          Loading...
        </Button>
      </div>
    )
  }

  return (
    <div className={cx('component')}>
      {postsToDisplay.length > 0 ? (
        <div className={cx('grid-layout')}>
          {postsToDisplay.map((post) => {
            const guideInfo = post?.guide_book_now

            return (
              <div key={post?.id} className={cx('post-wrapper')}>
                <PostTwoColumns
                  title={post?.title}
                  uri={post?.uri}
                  featuredImage={post?.featuredImage?.node}
                />

                {/* GUIDE META */}
                {guideInfo && (
                  <div className={cx('guide-info')}>
                    {guideInfo?.guideName && (
                      <span className={cx('guide-name')}>
                        {guideInfo.guideName}
                      </span>
                    )}

                    {guideInfo?.guideLocation && guideInfo?.linkLocation && (
                      <>
                        {guideInfo?.guideName && (
                          <span className={cx('separator')}>|</span>
                        )}
                        <a
                          href={guideInfo.linkLocation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cx('guide-location')}
                        >
                          {guideInfo.guideLocation}
                        </a>
                      </>
                    )}

                    {guideInfo?.guidePrice && (
                      <>
                        {(guideInfo?.guideName || guideInfo?.guideLocation) && (
                          <span className={cx('separator')}>|</span>
                        )}
                        <span className={cx('guide-price')}>
                          {guideInfo.guidePrice}
                        </span>
                      </>
                    )}

                    {guideInfo?.linkBookNow && (
                      <>
                        {(guideInfo?.guideName ||
                          guideInfo?.guideLocation ||
                          guideInfo?.guidePrice) && (
                          <span className={cx('separator')}>|</span>
                        )}
                        <a
                          href={guideInfo.linkBookNow}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cx('book-now-button')}
                        >
                          Book Now
                        </a>
                      </>
                    )}
                  </div>
                )}

                <TextTwoColumns
                  title={post?.title}
                  excerpt={post?.excerpt}
                  uri={post?.uri}
                  parentCategory={
                    post?.categories?.edges[0]?.node?.parent?.node?.name
                  }
                  category={post?.categories?.edges[0]?.node?.name}
                  categoryUri={post?.categories?.edges[0]?.node?.uri}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mx-auto flex min-h-60 items-center justify-center">
          There are no results in this category...
        </div>
      )}

      {mergedPosts.length - startIndex > visibleCount && (
        <div className="mx-auto flex w-full justify-center">
          <Button
            onClick={fetchMorePosts}
            disabled={loading}
            className="gap-x-4"
          >
            {loading ? 'Loading...' : 'LOAD MORE...'}
          </Button>
        </div>
      )}
    </div>
  )
}
