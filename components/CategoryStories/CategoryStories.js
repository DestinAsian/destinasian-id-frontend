import React, { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryStories.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import dynamic from 'next/dynamic'

const Button = dynamic(() => import('../../components/Button/Button'))
const PostTwoColumns = dynamic(() => import('../../components/PostTwoColumns/PostTwoColumns'))

const cx = classNames.bind(styles)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function CategoryStories(categoryUri) {
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const postsPerPage = 4
  const uri = categoryUri?.categoryUri
  const pinPosts = categoryUri?.pinPosts
  const name = categoryUri?.name
  const children = categoryUri?.children
  const parent = categoryUri?.parent

  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.node?.name?.toLowerCase() || ''
  const isTravelGuideCategory = travelGuideRoots.includes(activeCategoryName) || travelGuideRoots.includes(parentCategoryName)

  const contentTypes = isTravelGuideCategory ? [CONTENT_TYPES.TRAVEL_GUIDES] : [CONTENT_TYPES.POST]

  const storiesVariable = {
    first: postsPerPage,
    after: null,
    id: uri,
    contentTypes,
  }

  const { data, error, loading, fetchMore } = useQuery(GetCategoryStories, {
    variables: storiesVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev

    const prevEdges = data?.category?.contentNodes?.edges || []
    const newEdges = fetchMoreResult?.category?.contentNodes?.edges || []

    return {
      ...data,
      category: {
        ...data?.category,
        contentNodes: {
          ...data?.category?.contentNodes,
          edges: [...prevEdges, ...newEdges],
          pageInfo: fetchMoreResult?.category?.contentNodes?.pageInfo,
        },
      },
    }
  }

  const getFormattedUri = (post) => {
    const categoryEdge = post?.categories?.edges?.[0]
    const category = categoryEdge?.node?.name?.toLowerCase()
    const parentCategory = categoryEdge?.node?.parent?.node?.name?.toLowerCase()
    const slug = post?.slug

    const isTravelGuideParent = travelGuideRoots.includes(category)
    const isTravelGuideChild = travelGuideRoots.includes(parentCategory)

    if (isTravelGuideParent) return `/travel-guides/${category}/${slug}`
    if (isTravelGuideChild) return `/travel-guides/${parentCategory}/${slug}`

    return post?.uri
  }

  const fetchMorePosts = () => {
    if (!isFetchingMore && data?.category?.contentNodes?.pageInfo?.hasNextPage) {
      setIsFetchingMore(true)
      fetchMore({
        variables: { after: data?.category?.contentNodes?.pageInfo?.endCursor },
        updateQuery,
      }).then(() => setIsFetchingMore(false))
    }
  }

  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (loading) {
    return (
      <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
        <Button className="gap-x-4">{'Loading...'}</Button>
      </div>
    )
  }

  const allPosts = data?.category?.contentNodes?.edges?.map((post) => post.node)
  const allPinPosts = pinPosts?.pinPost ? [pinPosts.pinPost] : []
  const mergedPosts = [...allPinPosts, ...allPosts].reduce((uniquePosts, post) => {
    if (!uniquePosts.some((uniquePost) => uniquePost?.id === post?.id)) {
      uniquePosts.push(post)
    }
    return uniquePosts
  }, [])

  return (
    <div className={cx('component')}>
      {mergedPosts?.length !== 0 &&
        mergedPosts.map((post) => (
          <div key={post?.id} className={cx('post-wrapper')}>
            <PostTwoColumns
              title={post?.title}
              excerpt={post?.excerpt}
              content={post?.content}
              date={post?.date}
              author={post?.author?.node?.name}
              uri={post?.uri}
              parentCategory={post?.categories?.edges[0]?.node?.parent?.node?.name}
              category={post?.categories?.edges[0]?.node?.name}
              categoryUri={post?.categories?.edges[0]?.node?.uri}
              featuredImage={post?.featuredImage?.node}
            />
          </div>
        ))}

      {mergedPosts?.length === 0 && (
        <div className="mx-auto my-0 flex min-h-60 max-w-[100vw] items-center justify-center md:max-w-[700px]">
          {'There is no results in this category...'}
        </div>
      )}

      {mergedPosts?.length !== 0 && (
        <div className="mx-auto my-0 flex w-[100vw] justify-center">
          {data?.category?.contentNodes?.pageInfo?.hasNextPage && (
            <Button
              onClick={fetchMorePosts}
              className="gap-x-4"
            >
              {isFetchingMore ? 'Loading...' : <>LOAD MORE... </>}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
