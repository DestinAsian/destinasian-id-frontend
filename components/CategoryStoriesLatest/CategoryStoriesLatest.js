'use client'

import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryStoriesLatest.module.scss'
import { useQuery } from '@apollo/client'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import { GetTravelGuidesMenu } from '../../queries/GetTravelGuidesMenu'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import GuideLatestStories from '../../components/GuideLatestStories/GuideLatestStories'

const cx = classNames.bind(styles)

export default function CategoryStoriesLatest({ categoryUri, pinPosts, name, parent }) {
  const uri = categoryUri?.categoryUri || categoryUri?.id || categoryUri || ''
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.node?.name?.toLowerCase() || ''
  const shouldSkip = !uri

  // Ambil daftar root Travel Guides dari GraphQL
  const { data: guidesMenuData } = useQuery(GetTravelGuidesMenu, {
    fetchPolicy: 'cache-first',
  })

  // Fallback list jika data belum ada
  const staticFallback = ['bali', 'jakarta', 'bandung', 'surabaya']

  const travelGuideRoots =
    guidesMenuData?.categories?.edges?.map(
      (edge) => edge?.node?.slug?.toLowerCase()
    ) || staticFallback

  // Deteksi apakah kategori saat ini termasuk Travel Guide
  const isTravelGuideCategory =
    travelGuideRoots.includes(activeCategoryName) ||
    travelGuideRoots.includes(parentCategoryName)

  const contentTypes = isTravelGuideCategory
    ? [CONTENT_TYPES.TRAVEL_GUIDES]
    : [CONTENT_TYPES.POST]

  // Gunakan useState agar tidak langsung re-render sebelum data siap
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Jalankan hanya di client-side agar hindari hydration mismatch
    setMounted(true)
  }, [])

  // Ambil data artikel
  const { data, error, loading } = useQuery(GetCategoryStories, {
    variables: {
      first: 3,
      after: null,
      id: uri,
      contentTypes,
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    skip: shouldSkip || !mounted, // ⛔ hindari query sebelum client siap
  })

  // Saat belum mounted atau loading, tahan tampilan tetap stabil
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

  const fetchedPosts =
    data?.category?.contentNodes?.edges?.map((edge) => edge.node) || []

  const pinned = isTravelGuideCategory ? pinPosts?.pinPost : null

  const displayedPost = pinned
    ? pinned
    : fetchedPosts.find((item) => item.__typename === 'TravelGuide')

  if (!displayedPost) return null
  if (!isTravelGuideCategory && pinned) return null

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
          parentCategory={displayedPost.categories?.edges?.[0]?.node?.parent?.node?.name}
          category={displayedPost.categories?.edges?.[0]?.node?.name}
          categoryUri={displayedPost.categories?.edges?.[0]?.node?.uri}
          featuredImage={displayedPost.featuredImage?.node}
          caption={displayedPost.featuredImage?.node?.caption}
        />
      </div>
    </div>
  )
}