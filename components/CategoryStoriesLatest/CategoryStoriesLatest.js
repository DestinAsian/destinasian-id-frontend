'use client'

import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import { useQuery } from '@apollo/client'

import styles from './CategoryStoriesLatest.module.scss'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import GuideLatestStories from '../../components/GuideLatestStories/GuideLatestStories'

const cx = classNames.bind(styles)

export default function CategoryStoriesLatest({ categoryUri, pinPosts }) {
  const uri = categoryUri?.categoryUri || categoryUri?.id || categoryUri || ''
  const shouldSkip = !uri

  // Gunakan state untuk mencegah hydration mismatch di Next.js
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Query data kategori hanya dengan contentType TRAVEL_GUIDES
  const { data, error, loading } = useQuery(GetCategoryStories, {
    variables: {
      first: 3,
      after: null,
      id: uri,
      contentTypes: [CONTENT_TYPES.TRAVEL_GUIDES],
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    skip: shouldSkip || !mounted,
  })

  // Placeholder saat loading
  if (!mounted || loading) {
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

  // Ambil daftar post
  const fetchedPosts =
    data?.category?.contentNodes?.edges?.map((edge) => edge.node) || []

  // Jika ada pinPost, tampilkan itu terlebih dahulu
  const displayedPost = pinPosts?.pinPost || fetchedPosts[0]
  if (!displayedPost) return null

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
