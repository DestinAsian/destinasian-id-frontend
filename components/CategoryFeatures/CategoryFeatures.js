// import React, { useState, useEffect } from 'react'
// import { useQuery } from '@apollo/client'
// import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
// import classNames from 'classnames/bind'
// import styles from './CategoryFeatures.module.scss'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/router'

// const cx = classNames.bind(styles)

// const CategoryFeatures = () => {
//   const { data, loading, error } = useQuery(GetCategoryFeatures, {
//     variables: { id: '20' },
//   })

//   const [clickCount, setClickCount] = useState(0)
//   const [visibleCount, setVisibleCount] = useState(0)
//   const [isMobile, setIsMobile] = useState(false)

//   const router = useRouter()

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   useEffect(() => {
//     setVisibleCount(isMobile ? 2 : 3) // tampil awal
//   }, [isMobile])

//   if (loading) return <p>Loading...</p>
//   if (error) return <p>Error: {error.message}</p>

//   const category = data?.category
//   const posts = Array.isArray(category?.posts?.edges)
//     ? category.posts.edges
//     : []

//   const handleViewMore = () => {
//     const newClickCount = clickCount + 1
//     setClickCount(newClickCount)

//     if (newClickCount >= 3) {
//       router.push(category?.uri || '/')
//     } else {
//       setVisibleCount((prev) =>
//         Math.min(prev + (isMobile ? 2 : 3), posts.length),
//       )
//     }
//   }

//   return (
//     <div className={cx('CategoryFeaturesWrapper')}>
//       <div className={cx('childCategory')}>
//         <h2 className={cx('title')}>{category?.name}</h2>

//         {category?.categoryImages?.categoryImagesCaption && (
//           <p className={cx('description')}>
//             {category.categoryImages.categoryImagesCaption}
//           </p>
//         )}

//         <p className={cx('articleCount')}>{posts.length} Articles</p>

//         <div className={cx('gridSection')}>

//           {posts.slice(0, visibleCount).map(({ node: post }) => (
//             <Link key={post.id} href={post.uri || `/${post.slug}`}>
//               <div className={cx('card')}>
//                 <div className={cx('cardInner')}>
//                   {post.featuredImage?.node?.mediaItemUrl && (
//                     <div className={cx('imageWrapper')}>
//                       <Image
//                         src={post.featuredImage.node.mediaItemUrl}
//                         alt={post.slug}
//                         width={600}
//                         height={400}
//                         className={cx('thumbnail')}
//                       />
//                     </div>
//                   )}
//                   {firstCategoryName && (
//                     <p className={cx('categoryName')}>{firstCategoryName}</p>
//                   )}
//                   <h4 className={cx('slug')}>{post.slug.replace(/-/g, ' ')}</h4>
//                   <div
//                     className={cx('excerpt')}
//                     dangerouslySetInnerHTML={{ __html: post.excerpt }}
//                   ></div>
//                   <div className={cx('readMore')}>
//                     <span>Read More →</span>
//                   </div>

//                   {formattedDate && (
//                     <p className={cx('date')}>{formattedDate}</p>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

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

// export default CategoryFeatures
import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import classNames from 'classnames/bind'
import styles from './CategoryFeatures.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { format } from 'date-fns' // untuk format tanggal

const cx = classNames.bind(styles)

const CategoryFeatures = () => {
  const { data, loading, error } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
  })

  const [clickCount, setClickCount] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setVisibleCount(isMobile ? 2 : 3)
  }, [isMobile])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const category = data?.category
  const posts = Array.isArray(category?.posts?.edges)
    ? category.posts.edges
    : []

  const handleViewMore = () => {
    const newClickCount = clickCount + 1
    setClickCount(newClickCount)

    if (newClickCount >= 3) {
      router.push(category?.uri || '/')
    } else {
      setVisibleCount((prev) =>
        Math.min(prev + (isMobile ? 2 : 3), posts.length),
      )
    }
  }

  return (
    <div className={cx('CategoryFeaturesWrapper')}>
      <div className={cx('childCategory')}>
        <h2 className={cx('title')}>{category?.name}</h2>

        {category?.categoryImages?.categoryImagesCaption && (
          <p className={cx('description')}>
            {category.categoryImages.categoryImagesCaption}
          </p>
        )}

        <div className={cx('gridSection')}>
          {posts.slice(0, visibleCount).map(({ node: post }) => {
            const firstCategory = post.categories?.edges?.[0]?.node
            const categoryName = firstCategory?.name || ''
            const parentCategoryName = firstCategory?.parent?.node?.name || ''

            return (
              <Link key={post.id} href={post.uri || `/${post.slug}`}>
                <div className={cx('card')}>
                  <div className={cx('cardInner')}>
                    {/* Gambar */}
                    {post.featuredImage?.node?.mediaItemUrl && (
                      <div className={cx('imageWrapper')}>
                        <Image
                          src={post.featuredImage.node.mediaItemUrl}
                          alt={post.slug}
                          width={600}
                          height={400}
                          className={cx('thumbnail')}
                        />
                      </div>
                    )}

                    {/* Parent category (per post) */}
                    {parentCategoryName && (
                      <p className={cx('parentCategory')}>
                        {parentCategoryName}
                      </p>
                    )}

                    {categoryName && (
                      <p className={cx('postCategory')}>{categoryName}</p>
                    )}

                    <h4 className={cx('slug')}>
                      {post.slug.replace(/-/g, ' ')}
                    </h4>

                    <div
                      className={cx('excerpt')}
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    ></div>

                    <div className={cx('readMore')}>
                      <span>Read More →</span>
                    </div>

                    <p className={cx('date')}>
                      {format(new Date(post.date), 'dd MMMM yyyy')}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

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

export default CategoryFeatures
