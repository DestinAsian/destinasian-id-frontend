import React, { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryStories.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import dynamic from 'next/dynamic'

const Button = dynamic(() => import('../../components/Button/Button'))
const PostTwoColumns = dynamic(() =>
  import('../../components/PostTwoColumns/PostTwoColumns'),
)
const TextTwoColumns = dynamic(() =>
  import('../../components/PostTwoColumns/TextTwoColumns'),
)

const cx = classNames.bind(styles)

export default function CategoryStories(categoryUri) {
  const postsPerPage = 4
  const [visibleCount, setVisibleCount] = useState(postsPerPage)

  const uri = categoryUri?.categoryUri
  const pinPosts = categoryUri?.pinPosts
  const name = categoryUri?.name
  const parent = categoryUri?.parent

  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.node?.name?.toLowerCase() || ''

  const isTravelGuideCategory =
    travelGuideRoots.includes(activeCategoryName) ||
    travelGuideRoots.includes(parentCategoryName)

  const contentTypes = isTravelGuideCategory
    ? [CONTENT_TYPES.TRAVEL_GUIDES]
    : [CONTENT_TYPES.POST]

  const { data, error, loading, fetchMore } = useQuery(GetCategoryStories, {
    variables: {
      first: 20, // ambil banyak data sekaligus untuk slicing lokal
      after: null,
      id: uri,
      contentTypes,
    },
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

  const fetchMorePosts = () => {
    setVisibleCount((prev) => prev + postsPerPage)
    if (!loading && data?.category?.contentNodes?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { after: data?.category?.contentNodes?.pageInfo?.endCursor },
        updateQuery,
      })
    }
  }

  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (loading) {
    return (
      <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
        <Button className="gap-x-4">Loading...</Button>
      </div>
    )
  }

  const allPosts =
    data?.category?.contentNodes?.edges?.map((post) => post.node) || []
  const allPinPosts = pinPosts?.pinPost ? [pinPosts.pinPost] : []

  const mergedPosts = [...allPinPosts, ...allPosts].reduce(
    (uniquePosts, post) => {
      if (!uniquePosts.some((p) => p?.id === post?.id)) uniquePosts.push(post)
      return uniquePosts
    },
    [],
  )

  // ⬇️ Logic tampil: potong dari index 2 jika travelGuideCategory
  const startIndex = isTravelGuideCategory ? 2 : 0
  const postsToDisplay = mergedPosts.slice(
    startIndex,
    startIndex + visibleCount,
  )

  return (
    <div className={cx('component')}>
      {postsToDisplay.length > 0 ? (
        postsToDisplay.map((post) => {
          const guideInfo = post?.guide_book_now // 🔹 ADDED: Guide Info retrieval

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
                      {/* <span className={cx('separator')}>|</span> */}
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
                parentCategory={
                  post?.categories?.edges[0]?.node?.parent?.node?.name
                }
                category={post?.categories?.edges[0]?.node?.name}
                categoryUri={post?.categories?.edges[0]?.node?.uri}
              />
            </div>
          )
        })
      ) : (
        <div className="mx-auto my-0 flex min-h-60 max-w-[100vw] items-center justify-center md:max-w-[700px]">
          There is no results in this category...
        </div>
      )}

      {mergedPosts.length - startIndex > visibleCount && (
        <div className="mx-auto my-0 flex w-[100vw] justify-center">
          <Button onClick={fetchMorePosts} className="gap-x-4">
            {loading ? 'Loading...' : 'LOAD MORE...'}
          </Button>
        </div>
      )}
    </div>
  )
  // return (
  //   <div className={cx('component')}>
  //     {postsToDisplay.length > 0 ? (
  //       postsToDisplay.map((post) => (

  //         <div key={post?.id} className={cx('post-wrapper')}>
  //           {/* <PostTwoColumns
  //             title={post?.title}
  //             excerpt={post?.excerpt}
  //             content={post?.content}
  //             date={post?.date}
  //             author={post?.author?.node?.name}
  //             uri={post?.uri}
  //             parentCategory={post?.categories?.edges[0]?.node?.parent?.node?.name}
  //             category={post?.categories?.edges[0]?.node?.name}
  //             categoryUri={post?.categories?.edges[0]?.node?.uri}
  //             featuredImage={post?.featuredImage?.node}
  //           /> */}
  //           <PostTwoColumns
  //             title={post?.title}
  //             uri={post?.uri}
  //             featuredImage={post?.featuredImage?.node}
  //           />
  //           {/* ⬇️ Tambahan guide info di bawah gambar */}
  //         {guideInfo && (
  //           <div className={cx('guide-info')}>
  //             <span className={cx('guide-name')}>{guideInfo?.guideName}</span>
  //             {guideInfo?.linkLocation && (
  //               <a
  //                 href={guideInfo.linkLocation}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className={cx('guide-location')}
  //               >
  //                 {guideInfo?.guideLocation}
  //               </a>
  //             )}
  //             <span className={cx('separator')}>|</span>
  //             <span className={cx('guide-price')}>{guideInfo?.guidePrice}</span>
  //             <span className={cx('separator')}>|</span>
  //             {guideInfo?.linkBookNow && (
  //               <a
  //                 href={guideInfo.linkBookNow}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className={cx('book-now-button')}
  //               >
  //                 Book Now
  //               </a>
  //             )}
  //           </div>
  //         )}
  //           <TextTwoColumns
  //             title={post?.title}
  //             excerpt={post?.excerpt}
  //             uri={post?.uri}
  //             parentCategory={post?.categories?.edges[0]?.node?.parent?.node?.name}
  //             category={post?.categories?.edges[0]?.node?.name}
  //             categoryUri={post?.categories?.edges[0]?.node?.uri}
  //           />
  //         </div>
  //       ))
  //     ) : (
  //       <div className="mx-auto my-0 flex min-h-60 max-w-[100vw] items-center justify-center md:max-w-[700px]">
  //         There is no results in this category...
  //       </div>
  //     )}

  //     {mergedPosts.length - startIndex > visibleCount && (
  //       <div className="mx-auto my-0 flex w-[100vw] justify-center">
  //         <Button onClick={fetchMorePosts} className="gap-x-4">
  //           {loading ? 'Loading...' : 'LOAD MORE...'}
  //         </Button>
  //       </div>
  //     )}
  //   </div>
  // )
}
