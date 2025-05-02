// // components/CategoryUpdates/index.js
// import React from 'react'
// import { useQuery } from '@apollo/client'
// import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
// import classNames from 'classnames/bind'
// import styles from './CategoryUpdates.module.scss'
// import Link from 'next/link'

// const cx = classNames.bind(styles)

// const CategoryUpdates = () => {
//   const { data, loading, error } = useQuery(GetCategoryUpdates, {
//     variables: { include: ['41'] }, // ganti jika butuh ID lain
//   })

//   if (loading) return <p>Loading...</p>
//   if (error) return <p>Error: {error.message}</p>

//   const children = data?.category?.children?.edges || []

//   return (
//     <div className={cx('categoryUpdatesWrapper')}>
//       {children.map(({ node: category }) => {
//         const posts = category?.contentNodes?.edges || []
//         return (
//           <div key={category.id} className={cx('childCategory')}>
//             <h2 className={cx('title')}>{category.name}</h2>
//             {category.description && (
//               <p className={cx('description')}>{category.description}</p>
//             )}
//             <p className={cx('articleCount')}>{posts.length} Artikel</p>

//             <div className={cx('postsWrapper')}>
//               {posts.map(({ node: post }, index) => (
//                 <Link
//                   key={post.id}
//                   href={`/${post.uri}`}
//                   className={cx('card', {
//                     sideBySide: index < 2,
//                     stacked: index >= 2,
//                   })}
//                 >
//                   <div className={cx('cardInner')}>
//                     <p className={cx('date')}>
//                       {new Date(post.date).toLocaleDateString('id-ID', {
//                         day: '2-digit',
//                         month: 'short',
//                         year: 'numeric',
//                       })}
//                     </p>
//                     <h4 className={cx('slug')}>
//                       {post.slug.replace(/-/g, ' ')}
//                     </h4>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// // export default CategoryUpdates
// import React, { useState } from 'react'
// import { useQuery } from '@apollo/client'
// import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
// import classNames from 'classnames/bind'
// import styles from './CategoryUpdates.module.scss'
// import Link from 'next/link'
// import Image from 'next/image' // 👉️ Added next/image for rendering images

// const cx = classNames.bind(styles)

// const CategoryUpdates = () => {
//   const { data, loading, error } = useQuery(GetCategoryUpdates, {
//     variables: { include: ['41'] }, // Change the ID if needed
//   })

//   if (loading) return <p>Loading...</p>
//   if (error) return <p>Error: {error.message}</p>

//   const children = data?.category?.children?.edges || []
// {children.map(({ node: category }) => {
//   const posts = category?.contentNodes?.edges || []

//   // 👉️ Local state to manage how many posts are shown
//   const [visibleCount, setVisibleCount] = useState(11)

//   const handleViewMore = () => {
//     setVisibleCount((prev) => prev + 10) // Load 10 more posts
//   }

//   const visiblePosts = posts.slice(0, visibleCount) // Slice posts to show

//   return (
//     <div className={cx('categoryUpdatesWrapper')}>
//       {children.map(({ node: category }) => {
//         const posts = category?.contentNodes?.edges || []
//         return (
//           <div key={category.id} className={cx('childCategory')}>
//             <h2 className={cx('title')}>{category.name}</h2>
//             {category.description && (
//               <p className={cx('description')}>{category.description}</p>
//             )}
//             <p className={cx('articleCount')}>{posts.length} Artikel</p>

//             <div className={cx('postsWrapper')}>
//               {posts.map(({ node: post }, index) => {
//                 const featuredImage = post.featuredImage?.node // 👉️ Get featured image data
//                 return (
//                   // <Link
//                   //   key={post.id}
//                   //   href={`/${post.uri}`}
//                   //   className={cx('card', {
//                   //     sideBySide: index < 2,
//                   //     stacked: index >= 2,
//                   //   })}
//                   // >

//                   <Link
//                     key={post.id}
//                     href={`/${post.uri}`}
//                     className={cx('card', {
//                       fullWidth: index === 0,
//                       sideBySide: index > 0,
//                     })}
//                   >
//                     <div className={cx('cardInner')}>
//                       {/* 👉️ Display the featured image if available */}
//                       {featuredImage?.mediaItemUrl && (
//                         <div className={cx('imageWrapper')}>
//                           <Image
//                             src={featuredImage.mediaItemUrl}
//                             alt={featuredImage.title || post.title}
//                             width={400}
//                             height={250}
//                             className={cx('thumbnail')}
//                           />
//                           {/* 👉️ Optional caption */}
//                           {featuredImage.caption && (
//                             <p className={cx('caption')}>
//                               {featuredImage.caption}
//                             </p>
//                           )}
//                         </div>
//                       )}

//                       <p className={cx('date')}>
//                         {new Date(post.date).toLocaleDateString('id-ID', {
//                           day: '2-digit',
//                           month: 'short',
//                           year: 'numeric',
//                         })}
//                       </p>
//                       <h4 className={cx('slug')}>
//                         {post.slug.replace(/-/g, ' ')}
//                       </h4>
//                     </div>
//                   </Link>
//                 )
//               })}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default CategoryUpdates



import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import classNames from 'classnames/bind'
import styles from './CategoryUpdates.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

const CategoryUpdates = () => {
  const { data, loading, error } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  const [visibleCounts, setVisibleCounts] = useState({}) // Simpan jumlah visible per kategori

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const children = data?.category?.children?.edges || []

  // Fungsi untuk mendapatkan jumlah tampilan per kategori
  const getVisibleCount = (categoryId) => visibleCounts[categoryId] || 11

  // Fungsi untuk menangani tombol View More
  const handleViewMore = (categoryId, totalPosts) => {
    setVisibleCounts((prev) => {
      const current = prev[categoryId] || 11
      return {
        ...prev,
        [categoryId]: Math.min(current + 10, totalPosts),
      }
    })
  }

  return (
    <div className={cx('categoryUpdatesWrapper')}>
      {children.map(({ node: category }) => {
        const posts = category?.contentNodes?.edges || []
        const visibleCount = getVisibleCount(category.id)
        const visiblePosts = posts.slice(0, visibleCount)

        return (
          <div key={category.id} className={cx('childCategory')}>
            <h2 className={cx('title')}>{category.name}</h2>
            {category.description && (
              <p className={cx('description')}>{category.description}</p>
            )}
            <p className={cx('articleCount')}>{posts.length} Artikel</p>

            <div className={cx('postsWrapper')}>
              {visiblePosts.map(({ node: post }, index) => {
                const featuredImage = post.featuredImage?.node

                return (
                  <Link
                    key={post.id}
                    href={`/${post.uri}`}
                    className={cx('card', {
                      fullWidth: index === 0,
                      sideBySide: index > 0,
                    })}
                  >
                    <div className={cx('cardInner')}>
                      {featuredImage?.mediaItemUrl && (
                        <div className={cx('imageWrapper')}>
                          <Image
                            src={featuredImage.mediaItemUrl}
                            alt={featuredImage.title || post.title}
                            width={400}
                            height={250}
                            className={cx('thumbnail')}
                          />
                          {featuredImage.caption && (
                            <p className={cx('caption')}>
                              {featuredImage.caption}
                            </p>
                          )}
                        </div>
                      )}

                      <p className={cx('date')}>
                        {new Date(post.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <h4 className={cx('slug')}>
                        {post.slug.replace(/-/g, ' ')}
                      </h4>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Tombol View More jika masih ada post */}
            {visibleCount < posts.length && (
              <div className={cx('viewMoreWrapper')}>
                <button
                  onClick={() => handleViewMore(category.id, posts.length)}
                  className={cx('viewMoreButton')}
                >
                  View More
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CategoryUpdates

