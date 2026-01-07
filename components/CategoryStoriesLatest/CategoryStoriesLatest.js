'use client'

import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import useSWR from 'swr'

import styles from './CategoryStoriesLatest.module.scss'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import GuideLatestStories from '../../components/GuideLatestStories/GuideLatestStories'
import { graphQLFetcher } from '../../lib/graphqlFetcher'

const cx = classNames.bind(styles)

export default function CategoryStoriesLatest({
  categoryUri,
  pinPosts,
  contentType = CONTENT_TYPES.TRAVEL_GUIDES,
}) {
  const uri = categoryUri?.categoryUri || categoryUri?.id || categoryUri || ''
  const shouldSkip = !uri

  // Hindari hydration mismatch (LOGIKA TETAP)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Jika POST → jangan render
  if (contentType === CONTENT_TYPES.POST) {
    return null
  }

  const swrKey =
    mounted &&
    !shouldSkip &&
    contentType === CONTENT_TYPES.TRAVEL_GUIDES
      ? [
          GetCategoryStories,
          {
            first: 3,
            after: null,
            id: uri,
            contentTypes: [CONTENT_TYPES.TRAVEL_GUIDES],
          },
        ]
      : null

  const { data, error, isLoading } = useSWR(
    swrKey,
    ([query, variables]) => graphQLFetcher(query, variables),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  // Placeholder loading (TETAP SAMA)
  if (!mounted || isLoading) {
    return (
      <div className={cx('component', 'stable-placeholder')}>
        <div className={cx('skeleton')}>
          <div className={cx('skeleton-image')} />
          <div className={cx('skeleton-lines')}>
            <div className={cx('skeleton-line')} />
            <div className={cx('skeleton-line', 'short')} />
          </div>
        </div>
      </div>
    )
  }

  if (shouldSkip || error) return null

  // Ambil post
  const fetchedPosts =
    data?.category?.contentNodes?.edges?.map((edge) => edge.node) || []

  const displayedPost = pinPosts?.pinPost || fetchedPosts[0]
  if (!displayedPost) return null

  if (displayedPost.__typename !== 'TravelGuide') {
    return null
  }

  return (
    <div className={cx('component')}>
      <div className={cx('post-wrapper')}>
        <GuideLatestStories
          title={displayedPost.title}
          excerpt={displayedPost.excerpt}
          content={displayedPost.content}
          date={displayedPost.date}
          author={displayedPost.author?.node?.name}
          uri={displayedPost.uri}
          parentCategory={
            displayedPost.categories?.edges?.[0]?.node?.parent?.node?.name
          }
          category={displayedPost.categories?.edges?.[0]?.node?.name}
          categoryUri={displayedPost.categories?.edges?.[0]?.node?.uri}
          featuredImage={displayedPost.featuredImage?.node}
          caption={displayedPost.featuredImage?.node?.caption}
        />
      </div>
    </div>
  )
}
