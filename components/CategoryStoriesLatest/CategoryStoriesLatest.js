'use client'

import classNames from 'classnames/bind'
import styles from './CategoryStoriesLatest.module.scss'
import { useQuery } from '@apollo/client'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import GuideLatestStories from '../../components/GuideLatestStories/GuideLatestStories'

const cx = classNames.bind(styles)

export default function CategoryStoriesLatest({ categoryUri, pinPosts, name, parent }) {
  const uri = categoryUri?.categoryUri || categoryUri?.id || categoryUri || ''
  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.node?.name?.toLowerCase() || ''

  // Detect if this category is part of Travel Guides
  const isTravelGuideCategory =
    travelGuideRoots.includes(activeCategoryName) ||
    travelGuideRoots.includes(parentCategoryName)

  // Skip rendering completely if not a Travel Guide category
  if (!isTravelGuideCategory) return null

  const shouldSkip = !uri

  const { data, error, loading } = useQuery(GetCategoryStories, {
    variables: {
      first: 3,
      after: null,
      id: uri,
      contentTypes: [CONTENT_TYPES.TRAVEL_GUIDES],
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    skip: shouldSkip,
  })

  if (shouldSkip || loading) return null
  if (error) return null

  // Get all travel guides from query
  const fetchedGuides = data?.category?.contentNodes?.edges?.map((edge) => edge.node) || []

  // Use pinned guide if available, otherwise pick the first one from fetched data
  const pinned = pinPosts?.pinPost
  const displayedGuide = pinned
    ? pinned
    : fetchedGuides.find((item) => item.__typename === 'TravelGuide')

  if (!displayedGuide) return null

  return (
    <div className={cx('component')}>
      <div className={cx('post-wrapper')}>
        <GuideLatestStories
          title={displayedGuide.title}
          excerpt={displayedGuide.excerpt}
          content={displayedGuide.content}
          date={displayedGuide.date}
          author={displayedGuide.author?.node?.name}
          uri={displayedGuide.uri}
          parentCategory={displayedGuide.categories?.edges?.[0]?.node?.parent?.node?.name}
          category={displayedGuide.categories?.edges?.[0]?.node?.name}
          categoryUri={displayedGuide.categories?.edges?.[0]?.node?.uri}
          featuredImage={displayedGuide.featuredImage?.node}
          caption={displayedGuide.featuredImage?.node?.caption}
        />
      </div>
    </div>
  )
}