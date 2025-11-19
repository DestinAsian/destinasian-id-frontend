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

const cx = classNames.bind(styles)

export default function TagStories({ tagUri }) {
  const postsPerPage = 4
  const [visibleCount, setVisibleCount] = useState(postsPerPage)
  const [delayedLoaded, setDelayedLoaded] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { data, error, loading, fetchMore } = useQuery(GetTagStories, {
    variables: {
      first: postsPerPage,
      after: null,
      id: tagUri,
      contentTypes: [CONTENT_TYPES.POST, CONTENT_TYPES.TRAVEL_GUIDES],
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  // Merge old + new data
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

  // Load more posts
  const fetchMorePosts = useCallback(() => {
    if (!isFetchingMore && data?.tag?.contentNodes?.pageInfo?.hasNextPage) {
      setIsFetchingMore(true)
      fetchMore({
        variables: { after: data?.tag?.contentNodes?.pageInfo?.endCursor },
        updateQuery,
      }).finally(() => {
        setIsFetchingMore(false)
        setVisibleCount((prev) => prev + postsPerPage)
      })
    }
  }, [isFetchingMore, data, fetchMore, updateQuery])

  // Auto-load on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 50

      if (scrolledToBottom) fetchMorePosts()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchMorePosts])

  // Delay for smoother rendering
  useEffect(() => {
    const timeout = setTimeout(() => setDelayedLoaded(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  // Collect all posts
  const allPosts = useMemo(() => {
    const edges = data?.tag?.contentNodes?.edges || []
    return edges.map((post) => post.node)
  }, [data])

  // Remove duplicates
  const mergedPosts = useMemo(() => {
    return allPosts.filter(
      (post, index, self) =>
        index === self.findIndex((p) => p?.id === post?.id),
    )
  }, [allPosts])

  const initialPosts = mergedPosts.slice(0, postsPerPage)
  const delayedPosts = delayedLoaded
    ? mergedPosts.slice(postsPerPage, visibleCount)
    : []

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  if (loading && !data) {
    return (
      <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
        <Button className="gap-x-4">Loading...</Button>
      </div>
    )
  }

  // Render individual post
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

      {isFetchingMore && (
        <div className="mx-auto my-4 flex max-w-[100vw] justify-center md:max-w-[700px]">
          <Button className="gap-x-4">Loading...</Button>
        </div>
      )}

      {data?.tag?.contentNodes?.pageInfo?.hasNextPage &&
        mergedPosts.length > visibleCount &&
        !isFetchingMore && (
          <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
            <Button onClick={fetchMorePosts} className="gap-x-4">
              Load More
            </Button>
          </div>
        )}
    </div>
  )
}
