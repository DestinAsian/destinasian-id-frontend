'use client'

import React, { useEffect, useState, useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryStories.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import dynamic from 'next/dynamic'

const Button = dynamic(() => import('../Button/Button'))
const PostTwoColumns = dynamic(() => import('../PostTwoColumns/PostTwoColumns'))
const TextTwoColumns = dynamic(() => import('../PostTwoColumns/TextTwoColumns'))

const cx = classNames.bind(styles)

export default function CategoryStories({ categoryUri, pinPosts, name, parent }) {
  const uri = categoryUri
  const postsPerPage = 4

  const [visibleCount, setVisibleCount] = useState(postsPerPage)
  const [delayedLoaded, setDelayedLoaded] = useState(false)

  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.toLowerCase() || ''

  const isTravelGuideCategory =
    travelGuideRoots.includes(activeCategoryName) ||
    travelGuideRoots.includes(parentCategoryName)

  const contentTypes = isTravelGuideCategory
    ? [CONTENT_TYPES.TRAVEL_GUIDES]
    : [CONTENT_TYPES.POST]

  const { data, error, loading, fetchMore } = useQuery(GetCategoryStories, {
    variables: {
      first: 20,
      after: null,
      id: uri,
      contentTypes,
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })

  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev
    const prevEdges = prev?.category?.contentNodes?.edges || []
    const newEdges = fetchMoreResult?.category?.contentNodes?.edges || []

    return {
      ...prev,
      category: {
        ...prev.category,
        contentNodes: {
          ...prev.category.contentNodes,
          edges: [...prevEdges, ...newEdges],
          pageInfo: fetchMoreResult.category.contentNodes.pageInfo,
        },
      },
    }
  }

  const fetchMorePosts = () => {
    setVisibleCount((prev) => prev + postsPerPage)
    if (!loading && data?.category?.contentNodes?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { after: data.category.contentNodes.pageInfo.endCursor },
        updateQuery,
      })
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => setDelayedLoaded(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  if (error) return <pre>{JSON.stringify(error)}</pre>

  const allPosts = useMemo(() => {
    const content = data?.category?.contentNodes?.edges || []
    const contentPosts = content.map((post) => post.node)
    const allPin = pinPosts?.pinPost ? [pinPosts.pinPost] : []
    return [...allPin, ...contentPosts].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
    )
  }, [data, pinPosts])

  const initialPosts = allPosts.slice(0, 4)
  const delayedPosts = delayedLoaded ? allPosts.slice(4, visibleCount) : []

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
              <span className={cx('guide-name')}>
                {guideInfo.guideName}
              </span>
            )}
            {guideInfo?.guideLocation && guideInfo?.linkLocation && (
              <>
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

      {allPosts.length > visibleCount && (
        <div className="mx-auto my-0 flex w-[100vw] justify-center">
          <Button onClick={fetchMorePosts} className="gap-x-4">
            {loading ? 'Loading...' : 'LOAD MORE...'}
          </Button>
        </div>
      )}
    </div>
  )
}
