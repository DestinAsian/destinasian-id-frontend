import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './TagStories.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetTagStories } from '../../queries/GetTagStories'
import dynamic from 'next/dynamic'

const PostTwoColumns = dynamic(() => import('../../components/PostTwoColumns/PostTwoColumns'))
const Button = dynamic(() => import('../../components/Button/Button'))

let cx = classNames.bind(styles)

export default function TagStories(tagUri) {
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const postsPerPage = 4
  const uri = tagUri?.tagUri

  let storiesVariable = {
    first: postsPerPage,
    after: null,
    id: uri,
    contentTypes: [
      CONTENT_TYPES.EDITORIAL,
      CONTENT_TYPES.POST,
      CONTENT_TYPES.UPDATE,
    ],
  }

  // Query untuk ambil post berdasarkan tag
  const { data, error, loading, fetchMore } = useQuery(GetTagStories, {
    variables: storiesVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev

    const prevEdges = data?.tag?.contentNodes?.edges || []
    const newEdges = fetchMoreResult?.tag?.contentNodes?.edges || []

    return {
      ...data,
      tag: {
        ...data?.tag,
        contentNodes: {
          ...data?.tag?.contentNodes,
          edges: [...prevEdges, ...newEdges],
          pageInfo: fetchMoreResult?.tag?.contentNodes?.pageInfo,
        },
      },
    }
  }

  // Fetch more ketika scroll sampai bawah
  const fetchMorePosts = () => {
    if (!isFetchingMore && data?.tag?.contentNodes?.pageInfo?.hasNextPage) {
      setIsFetchingMore(true)
      fetchMore({
        variables: {
          after: data?.tag?.contentNodes?.pageInfo?.endCursor,
        },
        updateQuery,
      }).then(() => {
        setIsFetchingMore(false)
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight

      if (scrolledToBottom) {
        fetchMorePosts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchMorePosts])

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  if (loading) {
    return (
      <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
        <Button className="gap-x-4">{'Loading...'}</Button>
      </div>
    )
  }

  const allPosts = data?.tag?.contentNodes?.edges?.map((post) => post.node)

  // Hilangkan duplikat post
  const mergedPosts = [...allPosts].reduce((uniquePosts, post) => {
    if (!uniquePosts.some((uniquePost) => uniquePost?.id === post?.id)) {
      uniquePosts.push(post)
    }
    return uniquePosts
  }, [])

  return (
    <div className={cx('component')}>
      {mergedPosts?.length !== 0 &&
        mergedPosts?.map((post) => (
          <div className={cx('post-wrapper')} key={post?.id}>
            <PostTwoColumns
              title={post?.title}
              excerpt={post?.excerpt}
              content={post?.content}
              date={post?.date}
              author={post?.author?.node?.name}
              uri={post?.uri}
              parentCategory={
                post?.categories?.edges[0]?.node?.parent?.node?.name
              }
              category={post?.categories?.edges[0]?.node?.name}
              categoryUri={post?.categories?.edges[0]?.node?.uri}
              featuredImage={post?.featuredImage?.node}
              chooseYourCategory={post?.acfCategoryIcon?.chooseYourCategory}
              chooseIcon={post?.acfCategoryIcon?.chooseIcon?.mediaItemUrl}
              categoryLabel={post?.acfCategoryIcon?.categoryLabel}
              locationValidation={post?.acfLocationIcon?.fieldGroupName}
              locationLabel={post?.acfLocationIcon?.locationLabel}
              locationUrl={post?.acfLocationIcon?.locationUrl}
            />
          </div>
        ))}

      {mergedPosts?.length === 0 && (
        <div className="mx-auto my-0 flex min-h-60 max-w-[100vw] items-center justify-center md:max-w-[700px]">
          {'There is no results in this tag...'}
        </div>
      )}

      {mergedPosts?.length !== 0 && mergedPosts?.length && (
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
          {data?.tag?.contentNodes?.pageInfo?.hasNextPage &&
            data?.tag?.contentNodes?.pageInfo?.endCursor && (
              <Button
                onClick={() => {
                  if (
                    !isFetchingMore &&
                    data?.tag?.contentNodes?.pageInfo?.hasNextPage
                  ) {
                    fetchMorePosts()
                  }
                }}
                className="gap-x-4"
              >
                {isFetchingMore ? 'Loading...' : 'Load More'}
              </Button>
            )}
        </div>
      )}
    </div>
  )
}
