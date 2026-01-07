'use client'

import React, { useState, useMemo } from 'react'
import useSWR from 'swr'
import classNames from 'classnames/bind'
import styles from './CategoryStories.module.scss'

import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import { graphQLFetcher } from '../../lib/graphqlFetcher'

import Button from '../Button/Button'
import PostTwoColumns from '../PostTwoColumns/PostTwoColumns'
import TextTwoColumns from '../PostTwoColumns/TextTwoColumns'

const cx = classNames.bind(styles)

export default function CategoryStories({
  categoryUri,
  pinPosts,
  name,
  parent,
}) {
  const POSTS_PER_LOAD = 4

  const [visibleCount, setVisibleCount] = useState(POSTS_PER_LOAD)

  // preload result (pengganti fetchMore)
  const [preloadedEdges, setPreloadedEdges] = useState([])

  /* ===========================
     1. CONTENT TYPE LOGIC (TIDAK DIUBAH)
     =========================== */
  const TRAVEL_GUIDE_ROOTS = ['bali', 'jakarta', 'bandung', 'surabaya']

  const isTravelGuideCategory =
    TRAVEL_GUIDE_ROOTS.includes(name?.toLowerCase() || '') ||
    TRAVEL_GUIDE_ROOTS.includes(parent?.toLowerCase() || '')

  const contentTypes = isTravelGuideCategory
    ? [CONTENT_TYPES.TRAVEL_GUIDES]
    : [CONTENT_TYPES.POST]

  /* ===========================
     2. INITIAL FETCH (SWR)
     =========================== */
  const { data, error } = useSWR(
    categoryUri
      ? [
          GetCategoryStories,
          {
            first: POSTS_PER_LOAD,
            after: null,
            id: categoryUri,
            contentTypes,
          },
        ]
      : null,
    ([query, variables]) => graphQLFetcher(query, variables),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  useSWR(
    data?.category?.contentNodes?.pageInfo?.hasNextPage
      ? [
          GetCategoryStories,
          {
            first: 30, // preload besar, tetap aman
            after: data.category.contentNodes.pageInfo.endCursor,
            id: categoryUri,
            contentTypes,
          },
        ]
      : null,
    ([query, variables]) =>
      graphQLFetcher(query, variables).then((res) => {
        const edges =
          res?.category?.contentNodes?.edges || []

        setPreloadedEdges(edges)
        return res
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>

  /* ===========================
     4. MERGE DATA (TIDAK DIUBAH)
     =========================== */
  const allPosts = useMemo(() => {
    const initialEdges =
      data?.category?.contentNodes?.edges || []

    const loadedPosts = [...initialEdges, ...preloadedEdges].map(
      (e) => e.node
    )

    const pin1 = pinPosts?.pinPost ? [pinPosts.pinPost] : []
    const pin2 = pinPosts?.secondPinPost
      ? [pinPosts.secondPinPost]
      : []

    return [...pin1, ...pin2, ...loadedPosts].filter(
      (v, i, a) =>
        a.findIndex((t) => t.id === v.id) === i
    )
  }, [data, preloadedEdges, pinPosts])

  /* ===========================
     5. VISIBLE POSTS (TIDAK DIUBAH)
     =========================== */
  const visiblePosts = allPosts.slice(0, visibleCount)

  const renderPost = (post) => {
    const guideInfo = post?.guide_book_now

    return (
      <div key={post.id} className={cx('post-wrapper')}>
        <PostTwoColumns
          title={post.title}
          uri={post.uri}
          featuredImage={post.featuredImage?.node}
        />

        {guideInfo && (
          <div className={cx('guide-info')}>
            {guideInfo.guideName && (
              <span className={cx('guide-name')}>
                {guideInfo.guideName}
              </span>
            )}

            {guideInfo.guideLocation &&
              guideInfo.linkLocation && (
                <a
                  href={guideInfo.linkLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx('guide-location')}
                >
                  {guideInfo.guideLocation}
                </a>
              )}

            {guideInfo.guidePrice && (
              <>
                <span className={cx('separator')}>|</span>
                <span className={cx('guide-price')}>
                  {guideInfo.guidePrice}
                </span>
              </>
            )}

            {guideInfo.linkBookNow && (
              <>
                <span className={cx('separator')}>|</span>
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
          title={post.title}
          excerpt={post.excerpt}
          uri={post.uri}
          parentCategory={
            post.categories?.edges[0]?.node?.parent?.node?.name
          }
          category={post.categories?.edges[0]?.node?.name}
          categoryUri={post.categories?.edges[0]?.node?.uri}
        />
      </div>
    )
  }

  return (
    <div className={cx('component')}>
      {visiblePosts.map(renderPost)}

      {allPosts.length > visibleCount && (
        <div className="mx-auto my-0 flex w-full justify-center">
          <Button
            onClick={() =>
              setVisibleCount((prev) => prev + POSTS_PER_LOAD)
            }
            className="gap-x-4"
          >
            LOAD MORE...
          </Button>
        </div>
      )}
    </div>
  )
}
