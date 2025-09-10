'use client'

import React, { useEffect, useState, useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryStoriesGuide.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import GuideTwoStories from '../GuideTwoStories/GuideTwoStories'

const cx = classNames.bind(styles)

export default function CategoryStoriesGuide({ categoryUri }) {
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { categoryUri: uri, name, parent } = categoryUri || {}
  const categoryName = name?.toLowerCase() || ''
  const parentName = parent?.node?.name?.toLowerCase() || ''

  const isTravelGuide =
    ['bali', 'jakarta', 'bandung', 'surabaya'].includes(categoryName) ||
    ['bali', 'jakarta', 'bandung', 'surabaya'].includes(parentName)

  const { data, loading, error, fetchMore } = useQuery(GetCategoryStories, {
    variables: {
      first: 4,
      after: null,
      id: uri,
      contentTypes: [isTravelGuide ? CONTENT_TYPES.TRAVEL_GUIDES : CONTENT_TYPES.POST],
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })

  const posts = useMemo(() => data?.category?.contentNodes?.edges || [], [data])
  const pageInfo = data?.category?.contentNodes?.pageInfo

  // Auto-load remaining posts after first render
  useEffect(() => {
    if (pageInfo?.hasNextPage && !isFetchingMore) {
      setIsFetchingMore(true)
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
                  ...(prev.category.contentNodes.edges || []),
                  ...(fetchMoreResult.category.contentNodes.edges || []),
                ],
                pageInfo: fetchMoreResult.category.contentNodes.pageInfo,
              },
            },
          }
        },
      }).finally(() => setIsFetchingMore(false))
    }
  }, [pageInfo, fetchMore, isFetchingMore])

  // Prevent UI flicker/wobble by skipping render until data is ready
  if (loading || error || !posts.length) return null

  const filteredPosts = posts.filter(({ node }) => node.__typename === 'TravelGuide')

  return (
    <div className={cx('component')}>
      {filteredPosts.map((item) => (
        <div key={item.id} className={cx('post-wrapper')}>
          <GuideTwoStories
            title={item.title}
            excerpt={item.excerpt}
            content={item.content}
            date={item.date}
            author={item.author?.node?.name}
            uri={item.uri}
            parentCategory={item.categories?.edges?.[0]?.node?.parent?.node?.name}
            category={item.categories?.edges?.[0]?.node?.name}
            categoryUri={item.categories?.edges?.[0]?.node?.uri}
            featuredImage={item.featuredImage?.node}
          />
        </div>
      ))}
    </div>
  )
}
