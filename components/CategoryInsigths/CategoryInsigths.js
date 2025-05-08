// import React, { useState } from 'react'
// import { useQuery } from '@apollo/client'
// import { GetCategoryInsights } from '../../queries/GetCategoryInsights'
// import classNames from 'classnames/bind'
// import styles from './CategoryInsigths.module.scss'
// import Link from 'next/link'
// import Image from 'next/image'

// const cx = classNames.bind(styles)

// const CategoryInsigths = () => {
//   // Query to fetch category data based on ID '29'
//   const { data, loading, error } = useQuery(GetCategoryInsights, {
//     variables: { id: '29' }, // The category ID used here
//   })

//   const [visibleCount, setVisibleCount] = useState(11)

//   // Handle loading and error states
//   if (loading) return <p>Loading...</p>
//   if (error) return <p>Error: {error.message}</p>

//   // Ensure that data is valid and that posts are in an array format
//   const category = data?.category
//   const posts = Array.isArray(category?.posts?.edges)
//     ? category.posts.edges
//     : []
//   const visiblePosts = posts.slice(0, visibleCount)

//   // Handle case when category or posts are not found
//   if (!category || !Array.isArray(posts) || posts.length === 0) {
//     return <p>Category data or articles not found.</p>
//   }

//   // Function to handle the "View More" button and load additional posts
//   const handleViewMore = () => {
//     setVisibleCount((prev) => Math.min(prev + 10, posts.length))
//   }

//   return (
//     <div className={cx('CategoryInsigthsWrapper')}>
//       <div className={cx('childCategory')}>
//         <h2 className={cx('title')}>{category?.name}</h2>

//         {/* Display category description if available */}
//         {category?.categoryImages?.categoryImagesCaption && (
//           <p className={cx('description')}>
//             {category.categoryImages.categoryImagesCaption}
//           </p>
//         )}

//         <p className={cx('articleCount')}>{posts.length} Articles</p>

//         <div className={cx('postsWrapper')}>
//           {/* Map through the visible posts and display each post */}
//           {visiblePosts.map(({ node: post }, index) => {
//             const featuredImage = post.featuredImage?.node
//             const isFirst = index === 0
//             const postUrl = `/${post.slug}`

//             return (
//               <Link href={postUrl} key={post.id} className={cx('cardLink')}>
//                 <div
//                   className={cx('card', {
//                     fullWidth: isFirst,
//                     sideBySide: !isFirst,
//                   })}
//                 >
//                   <div className={cx('cardInner')}>
//                     {featuredImage?.mediaItemUrl && (
//                       <div
//                         className={cx('imageWrapper', {
//                           largeImage: isFirst,
//                           squareImage: !isFirst,
//                         })}
//                       >
//                         <Image
//                           src={featuredImage.mediaItemUrl}
//                           alt={featuredImage.description || post.slug}
//                           width={isFirst ? 800 : 400}
//                           height={isFirst ? 500 : 400}
//                           className={cx('thumbnail')}
//                         />
//                       </div>
//                     )}
//                     <h4 className={cx('slug')}>
//                       {post.slug.replace(/-/g, ' ')}
//                     </h4>
//                   </div>
//                 </div>
//               </Link>
//             )
//           })}
//         </div>

//         {/* Display "View More" button if there are more posts to show */}
//         {visibleCount < posts.length && (
//           <div className={cx('viewMoreWrapper')}>
//             <button onClick={handleViewMore} className={cx('viewMoreButton')}>
//               View More
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CategoryInsigths
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetCategoryInsights } from '../../queries/GetCategoryInsights'
import classNames from 'classnames/bind'
import styles from './CategoryInsigths.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

const CategoryInsigths = () => {
  // Query to fetch category data based on ID '29'
  const { data, loading, error } = useQuery(GetCategoryInsights, {
    variables: { id: '29' }, // The category ID used here
  })

  const [visibleCount, setVisibleCount] = useState(5)

  // Handle loading and error states
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  // Ensure that data is valid and that posts are in an array format
  const category = data?.category
  const posts = Array.isArray(category?.posts?.edges)
    ? category.posts.edges
    : []
  const visiblePosts = posts.slice(0, visibleCount)

  // Handle case when category or posts are not found
  if (!category || !Array.isArray(posts) || posts.length === 0) {
    return <p>Category data or articles not found.</p>
  }

  // Function to handle the "View More" button and load additional posts
  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, posts.length))
  }

  return (
    <div className={cx('CategoryInsigthsWrapper')}>
      <div className={cx('childCategory')}>
        <h2 className={cx('title')}>{category?.name}</h2>

        {/* Display category description if available */}
        {category?.categoryImages?.categoryImagesCaption && (
          <p className={cx('description')}>
            {category.categoryImages.categoryImagesCaption}
          </p>
        )}

        <p className={cx('articleCount')}>{posts.length} Articles</p>

        <div className={cx('postsWrapper')}>
          <div className={cx('leftColumn')}>
            {/* Display the first post with full width */}
            {visiblePosts[0] && (
              <Link href={`/${visiblePosts[0]?.node.slug}`} key={visiblePosts[0]?.node.id}>
                <div className={cx('card', 'fullWidth')}>
                  <div className={cx('cardInner')}>
                    {visiblePosts[0]?.node.featuredImage?.node?.mediaItemUrl && (
                      <div className={cx('imageWrapper', 'imageFirst')}>
                        <Image
                          src={visiblePosts[0]?.node.featuredImage?.node.mediaItemUrl}
                          alt={visiblePosts[0]?.node.featuredImage?.node?.description || visiblePosts[0]?.node.slug}
                          width={800}
                          height={800}
                          className={cx('thumbnail')}
                        />
                      </div>
                    )}
                    <h4 className={cx('slug')}>
                      {visiblePosts[0]?.node.slug.replace(/-/g, ' ')}
                    </h4>
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className={cx('rightColumn')}>
            {/* Display the remaining posts in two columns */}
            {visiblePosts.slice(1).map(({ node: post }, index) => {
              const featuredImage = post.featuredImage?.node
              return (
                <div
                  className={cx('cardWrapper')}
                  key={post.id}
                  style={{
                    gridTemplateColumns: index % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                  }}
                >
                  <Link href={`/${post.slug}`}>
                    <div className={cx('card', 'sideBySide')}>
                      <div className={cx('cardInner')}>
                        {featuredImage?.mediaItemUrl && (
                          <div className={cx('imageWrapper', 'imageOthers')}>
                            <Image
                              src={featuredImage.mediaItemUrl}
                              alt={featuredImage.description || post.slug}
                              width={600}
                              height={400}
                              className={cx('thumbnail')}
                            />
                          </div>
                        )}
                        <h4 className={cx('slug')}>
                          {post.slug.replace(/-/g, ' ')}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Display "View More" button if there are more posts to show */}
        {visibleCount < posts.length && (
          <div className={cx('viewMoreWrapper')}>
            <button onClick={handleViewMore} className={cx('viewMoreButton')}>
              View More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryInsigths
