import React, { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryStoriesGuide.module.scss'
import { useQuery } from '@apollo/client'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import dynamic from 'next/dynamic'

const GuideTwoStories = dynamic(() =>
  import('../../components/GuideTwoStories/GuideTwoStories')
)
const BannerFokusDA = dynamic(() =>
  import('../../components/BannerFokusDA/BannerFokusDA')
)

const cx = classNames.bind(styles)

export default function CategoryStoriesGuide(categoryUri, guideStories) {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const postsPerPage = 4

  const uri = categoryUri?.categoryUri
  const name = categoryUri?.name
  const children = categoryUri?.children
  const parent = categoryUri?.parent

  // Cek apakah kategori termasuk travel guides
  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.node?.name?.toLowerCase() || ''

  let contentTypes = [CONTENT_TYPES.POST]
  const isTravelGuideCategory =
    travelGuideRoots.includes(activeCategoryName) ||
    travelGuideRoots.includes(parentCategoryName)

  if (isTravelGuideCategory) {
    contentTypes = [CONTENT_TYPES.TRAVEL_GUIDES]
  }

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

  const fetchMorePosts = () => {
    if (
      !isFetchingMore &&
      data?.category?.contentNodes?.pageInfo?.hasNextPage
    ) {
      setIsFetchingMore(true)
      fetchMore({
        variables: {
          after: data?.category?.contentNodes?.pageInfo?.endCursor,
        },
        updateQuery,
      }).then(() => {
        setIsFetchingMore(false)
      })
    }
  }

  if (error) return <pre>{JSON.stringify(error)}</pre>

  // Ambil semua data
  const allPosts = data?.category?.contentNodes?.edges?.map((post) => post.node)

  // // Filter hanya tipe TravelGuide
  // const travelGuide = allPosts
  //   ?.filter((item) => item.__typename === 'TravelGuide')
  //   ?.slice(0, 2)
    // Ambil semua post dan filter hanya tipe TravelGuide, lalu mulai dari data ke-3
    const filteredPosts = data?.category?.contentNodes?.edges
    ?.map((post) => post.node)
    ?.filter((item) => item.__typename === 'TravelGuide')
    ?.slice(2) // Lewati 2 post pertama

  return (
    // <div className={cx('component')}>
    //   {travelGuide?.length > 0 &&
    //     travelGuide.map((item) => (
    //       <div key={item?.id} className={cx('post-wrapper')}>
    //         <GuideTwoStories
    //           title={item?.title}
    //           excerpt={item?.excerpt}
    //           content={item?.content}
    //           date={item?.date}
    //           author={item?.author?.node?.name}
    //           uri={item?.uri}
    //           parentCategory={
    //             item?.categories?.edges[0]?.node?.parent?.node?.name
    //           }
    //           category={item?.categories?.edges[0]?.node?.name}
    //           categoryUri={item?.categories?.edges[0]?.node?.uri}
    //           featuredImage={item?.featuredImage?.node}
    //         />
    //       </div>
    //     ))}
    // </div>
    <div className={cx('component')}>
      {filteredPosts?.length > 0 &&
        filteredPosts.map((item) => (
          <div key={item?.id} className={cx('post-wrapper')}>
            <GuideTwoStories
              title={item?.title}
              excerpt={item?.excerpt}
              content={item?.content}
              date={item?.date}
              author={item?.author?.node?.name}
              uri={item?.uri}
              parentCategory={
                item?.categories?.edges[0]?.node?.parent?.node?.name
              }
              category={item?.categories?.edges[0]?.node?.name}
              categoryUri={item?.categories?.edges[0]?.node?.uri}
              featuredImage={item?.featuredImage?.node}
            />
          </div>
        ))}
    </div>
    
  )
}


// import React, { useState } from 'react'
// import classNames from 'classnames/bind'
// import styles from './CategoryStoriesGuide.module.scss'
// import { useQuery } from '@apollo/client'
// import * as CONTENT_TYPES from '../../constants/contentTypes'
// import { GetCategoryStories } from '../../queries/GetCategoryStories'
// import dynamic from 'next/dynamic'

// const GuideTwoStories = dynamic(() =>
//   import('../../components/GuideTwoStories/GuideTwoStories')
// )
// const BannerFokusDA = dynamic(() =>
//   import('../../components/BannerFokusDA/BannerFokusDA')
// )

// const cx = classNames.bind(styles)

// // ✅ Fungsi manipulasi URI tampilan
// const manipulateUri = (uri, name, parentName) => {
//   const base = 'https://test.destinasian.co.id'
//   const nameLower = name?.toLowerCase()
//   const parentLower = parentName?.toLowerCase()

//   const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']

//   const activeRoot = travelGuideRoots.find((root) => {
//     return uri?.includes(`/category/${root}/`)
//   })

//   if (activeRoot) {
//     return uri?.replace(`${base}/category/${activeRoot}`, `${base}/travel-guide/${activeRoot}`)
//   }

//   return uri
// }

// export default function CategoryStoriesGuide(categoryUri, guideStories) {
//   const [isFetchingMore, setIsFetchingMore] = useState(false)
//   const postsPerPage = 4

//   const uri = categoryUri?.categoryUri
//   const name = categoryUri?.name
//   const children = categoryUri?.children
//   const parent = categoryUri?.parent

//   // Deteksi apakah termasuk travel guide kategori
//   const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
//   const activeCategoryName = name?.toLowerCase() || ''
//   const parentCategoryName = parent?.node?.name?.toLowerCase() || ''

//   let contentTypes = [CONTENT_TYPES.POST]
//   const isTravelGuideCategory =
//     travelGuideRoots.includes(activeCategoryName) ||
//     travelGuideRoots.includes(parentCategoryName)

//   if (isTravelGuideCategory) {
//     contentTypes = [CONTENT_TYPES.TRAVEL_GUIDES]
//   }

//   const storiesVariable = {
//     first: postsPerPage,
//     after: null,
//     id: uri,
//     contentTypes,
//   }

//   const { data, error, loading, fetchMore } = useQuery(GetCategoryStories, {
//     variables: storiesVariable,
//     fetchPolicy: 'network-only',
//     nextFetchPolicy: 'cache-and-network',
//   })

//   const updateQuery = (prev, { fetchMoreResult }) => {
//     if (!fetchMoreResult) return prev

//     const prevEdges = data?.category?.contentNodes?.edges || []
//     const newEdges = fetchMoreResult?.category?.contentNodes?.edges || []

//     return {
//       ...data,
//       category: {
//         ...data?.category,
//         contentNodes: {
//           ...data?.category?.contentNodes,
//           edges: [...prevEdges, ...newEdges],
//           pageInfo: fetchMoreResult?.category?.contentNodes?.pageInfo,
//         },
//       },
//     }
//   }

//   const fetchMorePosts = () => {
//     if (
//       !isFetchingMore &&
//       data?.category?.contentNodes?.pageInfo?.hasNextPage
//     ) {
//       setIsFetchingMore(true)
//       fetchMore({
//         variables: {
//           after: data?.category?.contentNodes?.pageInfo?.endCursor,
//         },
//         updateQuery,
//       }).then(() => {
//         setIsFetchingMore(false)
//       })
//     }
//   }

//   if (error) return <pre>{JSON.stringify(error)}</pre>

//   const allPosts = data?.category?.contentNodes?.edges?.map((post) => post.node)

//   // Filter TravelGuide saja
//   const travelGuide = allPosts
//     ?.filter((item) => item.__typename === 'TravelGuide')
//     ?.slice(0, 2)

//   return (
//     <div className={cx('component')}>
//       {travelGuide?.length > 0 &&
//         travelGuide.map((item) => {
//           const categoryNode = item?.categories?.edges[0]?.node
//           const manipulatedCategoryUri = manipulateUri(
//             categoryNode?.uri,
//             categoryNode?.name,
//             categoryNode?.parent?.node?.name
//           )

//           return (
//             <div key={item?.id} className={cx('post-wrapper')}>
//               <GuideTwoStories
//                 title={item?.title}
//                 excerpt={item?.excerpt}
//                 content={item?.content}
//                 date={item?.date}
//                 author={item?.author?.node?.name}
//                 uri={item?.uri}
//                 parentCategory={
//                   categoryNode?.parent?.node?.name
//                 }
//                 category={categoryNode?.name}
//                 categoryUri={manipulatedCategoryUri}
//                 featuredImage={item?.featuredImage?.node}
//               />
//             </div>
//           )
//         })}
//     </div>
//   )
// }
