'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './TagStories.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetTagStories } from '../../queries/GetTagStories'
import dynamic from 'next/dynamic'

const PostTwoColumns = dynamic(() =>
  import('../../components/PostTwoColumns/PostTwoColumns'),
)
const TextTwoColumns = dynamic(() =>
  import('../../components/PostTwoColumns/TextTwoColumns'),
)
const Button = dynamic(() => import('../../components/Button/Button'))

let cx = classNames.bind(styles)

export default function TagStories({ tagUri }) {
  const postsPerPage = 4
  const [visibleCount, setVisibleCount] = useState(postsPerPage)
  const [delayedLoaded, setDelayedLoaded] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const uri = tagUri

  const storiesVariable = {
    first: postsPerPage,
    after: null,
    id: uri,
    contentTypes: [CONTENT_TYPES.POST, CONTENT_TYPES.TRAVEL_GUIDES],
  }

  const { data, error, loading, fetchMore } = useQuery(GetTagStories, {
    variables: storiesVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // UpdateQuery untuk gabung data lama + baru
  const updateQuery = useCallback((prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev
    const prevEdges = prev?.tag?.contentNodes?.edges || []
    const newEdges = fetchMoreResult?.tag?.contentNodes?.edges || []

    return {
      ...prev,
      tag: {
        ...prev?.tag,
        contentNodes: {
          ...prev?.tag?.contentNodes,
          edges: [...prevEdges, ...newEdges],
          pageInfo: fetchMoreResult?.tag?.contentNodes?.pageInfo,
        },
      },
    }
  }, [])

  // ✅ Fetch More
  const fetchMorePosts = useCallback(() => {
    if (!isFetchingMore && data?.tag?.contentNodes?.pageInfo?.hasNextPage) {
      setIsFetchingMore(true)
      fetchMore({
        variables: {
          after: data?.tag?.contentNodes?.pageInfo?.endCursor,
        },
        updateQuery,
      }).finally(() => {
        setIsFetchingMore(false)
        setVisibleCount((prev) => prev + postsPerPage)
      })
    }
  }, [isFetchingMore, data, fetchMore, updateQuery])

  // Auto load ketika scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 50

      if (scrolledToBottom) {
        fetchMorePosts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchMorePosts])

  // Delay render biar smooth
  useEffect(() => {
    const timeout = setTimeout(() => setDelayedLoaded(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  // Ambil semua post
  const allPosts = useMemo(() => {
    const content = data?.tag?.contentNodes?.edges || []
    return content.map((post) => post.node)
  }, [data])

  // Hilangkan duplikat
  const mergedPosts = useMemo(() => {
    return allPosts.filter(
      (post, index, self) =>
        index === self.findIndex((p) => p?.id === post?.id),
    )
  }, [allPosts])

  // Slice untuk delay
  const initialPosts = mergedPosts.slice(0, postsPerPage)
  const delayedPosts = delayedLoaded
    ? mergedPosts.slice(postsPerPage, visibleCount)
    : []

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  // Loading awal
  if (loading && !data) {
    return (
      <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
        <Button className="gap-x-4">{'Loading...'}</Button>
      </div>
    )
  }

  // Render tiap post
  const renderPost = (post) => {
    const guideInfo = post?.guide_book_now
    return (
      <div key={post?.id} className={cx('post-wrapper')}>
        <PostTwoColumns
          title={post?.title}
          uri={post?.uri}
          featuredImage={post?.featuredImage?.node}
        />
        {guideInfo && (
          <div className={cx('guide-info')}>
            {guideInfo?.guideName && (
              <span className={cx('guide-name')}>{guideInfo.guideName}</span>
            )}
            {guideInfo?.guideLocation && guideInfo?.linkLocation && (
              <a
                href={guideInfo.linkLocation}
                target="_blank"
                rel="noopener noreferrer"
                className={cx('guide-location')}
              >
                {guideInfo.guideLocation}
              </a>
            )}
            {guideInfo?.guidePrice && (
              <>
                <span className={cx('separator')}>|</span>
                <span className={cx('guide-price')}>
                  {guideInfo.guidePrice}
                </span>
              </>
            )}
            {guideInfo?.linkBookNow && (
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
          title={post?.title}
          excerpt={post?.excerpt}
          uri={post?.uri}
          parentCategory={post?.categories?.edges[0]?.node?.parent?.node?.name}
          category={post?.categories?.edges[0]?.node?.name}
          categoryUri={post?.categories?.edges[0]?.node?.uri}
        />
      </div>
    )
  }

  return (
    <div className={cx('component')}>
      {[...initialPosts, ...delayedPosts].map(renderPost)}

      {/* Loading saat scroll sama dengan loading awal */}
      {isFetchingMore && (
        <div className="mx-auto my-4 flex max-w-[100vw] justify-center md:max-w-[700px]">
          <Button className="gap-x-4">{'Loading...'}</Button>
        </div>
      )}

      {/* Tombol Load More manual */}
      {data?.tag?.contentNodes?.pageInfo?.hasNextPage &&
        mergedPosts.length > visibleCount &&
        !isFetchingMore && (
          <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
            <Button onClick={fetchMorePosts} className="gap-x-4">
              {'Load More'}
            </Button>
          </div>
        )}
    </div>
  )
}
