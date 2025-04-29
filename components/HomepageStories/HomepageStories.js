import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './HomepageStories.module.scss'
import { useQuery } from '@apollo/client'
import { GetHomepageStories } from '../../queries/GetHomepageStories'
import {
  Button,
  PostTwoColumns,
} from '../../components'

let cx = classNames.bind(styles)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function HomepageStories(pinPosts) {
  // Fetching Posts
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  // Declare state for banner ads
  // const [bannerAdsArray, setBannerAdsArray] = useState([])

  // Post per fetching
  const postsPerPage = 4
  // const bannerPerPage = 20

  

  // Get Stories / Posts
  const { data, error, loading, fetchMore } = useQuery(GetHomepageStories, {
    variables: {
      first: postsPerPage,
      after: null,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // // Get Banner
  // const { data: bannerData, error: bannerError } = useQuery(
  //   GetHomepageBannerAds,
  //   {
  //     variables: {
  //       first: bannerPerPage,
  //     },
  //     fetchPolicy: 'network-only',
  //     nextFetchPolicy: 'cache-and-network',
  //   },
  // )


 
  
  // if (error || bannerError || advertorialsError) {
  //   console.log("Error in fetching data:", error || bannerError || advertorialsError);
  //   return <pre>{JSON.stringify(error || bannerError || advertorialsError)}</pre>;
  // }
  
  // const updateQuery = (prev, { fetchMoreResult }) => {
  //   if (!fetchMoreResult) return prev

  //   const prevEdges = data?.contentNodes?.edges || []
  //   const newEdges = fetchMoreResult?.contentNodes?.edges || []

  //   return {
  //     ...data,
  //     contentNodes: {
  //       ...data?.contentNodes,
  //       edges: [...prevEdges, ...newEdges],
  //       pageInfo: fetchMoreResult?.contentNodes?.pageInfo,
  //     },
  //   }
  // }

  // // Function to shuffle the banner ads and store them in state
  // useEffect(() => {
  //   const shuffleBannerAds = () => {
  //     const bannerAdsArrayObj = Object.values(
  //       bannerData?.bannerAds?.edges || [],
  //     )

  //     // Separate shuffled banner ads with <img> tags from those without
  //     const bannerAdsWithImg = bannerAdsArrayObj.filter(
  //       (bannerAd) => !bannerAd?.node?.content.includes('<!--'),
  //     )

  //     // Shuffle only the otherBannerAds array
  //     const shuffledBannerAds = shuffleArray(bannerAdsWithImg)

  //     // Concatenate the arrays with pinned ads first and shuffled other banner ads
  //     const shuffledBannerAdsArray = [...shuffledBannerAds]

  //     setBannerAdsArray(shuffledBannerAdsArray)
  //   }

  //   // Shuffle the banner ads when the component mounts
  //   shuffleBannerAds()

  //   // Shuffle the banner ads every 10 seconds
  //   const shuffleInterval = setInterval(() => {
  //     shuffleBannerAds()
  //   }, 60000) // 10000 milliseconds = 10 seconds

  //   // Cleanup the interval when the component unmounts
  //   return () => {
  //     clearInterval(shuffleInterval)
  //   }
  // }, [bannerData]) // Use bannerData as a dependency to trigger shuffling when new data arrives


  // // Concatenate the arrays to place ads with <img> tags first
  // const sortedBannerAdsArray = [...bannerAdsArray].reduce((uniqueAds, ad) => {
  //   if (!uniqueAds.some((uniqueAd) => uniqueAd?.node?.id === ad?.node?.id)) {
  //     uniqueAds.push(ad)
  //   }
  //   return uniqueAds
  // }, [])

  // Function to fetch more posts
  const fetchMorePosts = () => {
    if (!isFetchingMore && data?.contentNodes?.pageInfo?.hasNextPage) {
      setIsFetchingMore(true)
      fetchMore({
        variables: {
          after: data?.contentNodes?.pageInfo?.endCursor,
        },
        updateQuery,
      }).then(() => {
        setIsFetchingMore(false) // Reset the flag after fetch is done
      })
    }
  }

  // Scroll event listener to detect when user scrolls to the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight

      if (scrolledToBottom) {
        // Call the function to fetch more when scrolled to the bottom
        fetchMorePosts()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fetchMorePosts])

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  // if (bannerError) {
  //   return <pre>{JSON.stringify(error)}</pre>
  // }

  if (loading) {
    return (
      <>
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
          <Button className="gap-x-4	">{'Loading...'}</Button>
        </div>
      </>
    )
  }

  // Declare all posts
  const allPosts = (data?.contentNodes?.edges || []).map((post) => post.node)

  // Declare all pin posts
  const allPinPosts = [
    pinPosts?.pinPosts?.pinPost1 ? pinPosts?.pinPosts?.pinPost1 : null,
    pinPosts?.pinPosts?.pinPost2 ? pinPosts?.pinPosts?.pinPost2 : null,
    pinPosts?.pinPosts?.pinPost3 ? pinPosts?.pinPosts?.pinPost3 : null,
    pinPosts?.pinPosts?.pinPost4 ? pinPosts?.pinPosts?.pinPost4 : null,
    pinPosts?.pinPosts?.pinPost5 ? pinPosts?.pinPosts?.pinPost5 : null,
  ].filter((pinPost) => pinPost !== null)

  // Merge All posts and Pin posts
  const mergedPosts = [...allPinPosts, ...allPosts].reduce(
    (uniquePosts, post) => {
      if (!uniquePosts.some((uniquePost) => uniquePost?.id === post?.id)) {
        uniquePosts.push(post)
      }
      return uniquePosts
    },
    [],
  )


  // const numberOfBannerAds = sortedBannerAdsArray.length

  return (
    <div className={cx('component')}>
      {mergedPosts.length !== 0 &&
        mergedPosts.map((post, index) => (
          <React.Fragment key={post?.id}>
            {/* Post / Guides Stories */}
            {post?.contentTypeName === 'post' && (
              <div className={cx('post-wrapper')}>
                <PostTwoColumns
                  title={post?.title}
                  excerpt={post?.excerpt}
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
            )}

            {/* Editorials Stories */}
            {/* {post?.contentTypeName === 'editorial' && (
              <div className={cx('post-wrapper')}>
                <PostTwoColumns
                  title={post?.title}
                  excerpt={post?.excerpt}
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
            )} */}

            {/* Updates Stories */}
            {/* {post?.contentTypeName === 'update' && (
              <div className={cx('post-wrapper')}>
                <PostTwoColumns
                  title={post?.title}
                  excerpt={post?.excerpt}
                  uri={post?.uri}
                  parentCategory={
                    post?.categories?.edges[0]?.node?.parent?.node?.name
                  }
                  category={post?.categories?.edges[0]?.node?.name}
                  categoryUri={post?.categories?.edges[0]?.node?.uri}
                  featuredImage={post?.featuredImage?.node}
                />
              </div>
            )} */}
                {/* Honors Circle Stories */}
            {/* {post?.contentTypeName === 'honors-circle' && (
              <div className={cx('hc-wrapper')}>
                <PostTwoColumns
                  title={post?.title}
                  excerpt={post?.excerpt}
                  uri={post?.uri}
                  category={post?.contentType?.node?.label.slice(0, -1)}
                  categoryUri={post?.uri}
                  featuredImage={post?.featuredImage?.node}
                />
              </div>
            )} */}
                {/* Luxury Travel Stories */}
            {post?.contentTypeName === 'luxury-travel' && (
              <div className={cx('post-wrapper')}>
                <PostTwoColumns
                  title={post?.title}
                  excerpt={post?.excerpt}
                  uri={post?.uri}
                  category={post?.contentType?.node?.label.slice(0, -1)}
                  categoryUri={post?.uri}
                  featuredImage={post?.featuredImage?.node}
                />
              </div>
            )}
            {/* Show 1st banner after 2 posts and then every 4 posts */}
            {/* {(index - 1) % 4 === 0 && (
              <div className={cx('banner-ad-wrapper')}>
                <ModuleAd
                  bannerAd={
                    sortedBannerAdsArray[((index - 1) / 4) % numberOfBannerAds]
                      ?.node?.content
                  }
                />
              </div>
            )} */}
           
          </React.Fragment>
        ))}
      {mergedPosts.length && (
        <div className="mx-auto my-0 flex w-[100vw] justify-center ">
          {data?.contentNodes?.pageInfo?.hasNextPage &&
            data?.contentNodes?.pageInfo?.endCursor && (
              <Button
                onClick={() => {
                  if (
                    !isFetchingMore &&
                    data?.contentNodes?.pageInfo?.hasNextPage
                  ) {
                    fetchMorePosts()
                  }
                }}
                className="gap-x-4	"
              >
                {isFetchingMore ? (
                  'Loading...' // Display loading text when fetching
                ) : (
                  <>
                    Load More{' '}
                    <svg
                      className="h-auto w-8 origin-center rotate-90"
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="512.000000pt"
                      height="512.000000pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path
                          d="M1387 5110 c-243 -62 -373 -329 -272 -560 27 -62 77 -114 989 -1027
l961 -963 -961 -963 c-912 -913 -962 -965 -989 -1027 -40 -91 -46 -200 -15
-289 39 -117 106 -191 220 -245 59 -28 74 -31 160 -30 74 0 108 5 155 23 58
22 106 70 1198 1160 1304 1302 1202 1185 1202 1371 0 186 102 69 -1202 1371
-1102 1101 -1140 1137 -1198 1159 -67 25 -189 34 -248 20z"
                        />
                      </g>
                    </svg>
                  </>
                )}
              </Button>
            )}
        </div>
      )}
    </div>
  )
}
