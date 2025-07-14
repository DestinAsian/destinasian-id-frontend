// 'use client'
// import React from 'react'
// import { useQuery } from '@apollo/client'
// import Link from 'next/link'
// import Image from 'next/image'
// import classNames from 'classnames/bind'

// import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
// import styles from './CategoryUpdates.module.scss'

// const cx = classNames.bind(styles)

// const CategoryUpdates = React.memo(() => {
//   const { data, loading, error } = useQuery(GetCategoryUpdates, {
//     variables: { include: ['41'] },
//     fetchPolicy: 'cache-first',
//   })

//   if (loading) return null
//   if (error) return <p className={cx('error')}>Error: {error.message}</p>

//   const children = data?.category?.children?.edges || []

//   return (
//     <div className={cx('categoryUpdatesWrapper')}>
//       {children.map(({ node: category }) => {
//         const posts = category?.contentNodes?.edges?.slice(0, 8) || []

//         return (
//           <div key={category.id} className={cx('childCategory')}>
//             <h2 className={cx('title')}>{category.name}</h2>
//             {category.description && (
//               <p className={cx('description')}>{category.description}</p>
//             )}

//             <div className={cx('postsWrapper')}>
//               {posts.map(({ node: post }) => {
//                 const featuredImage = post.featuredImage?.node
//                 const postUrl = post.uri || `/${post.slug}`

//                 return (
//                   <div key={post.id} className={cx('card')}>
//                     <Link href={postUrl} className={cx('cardInner')}>
//                       <div>
//                         {featuredImage?.mediaItemUrl && (
//                           <div className={cx('imageWrapper')}>
//                             <Image
//                               src={featuredImage.mediaItemUrl}
//                               alt={featuredImage.title || post.title}
//                               fill
//                               loading="lazy"
//                               className={cx('thumbnail')}
//                             />
//                           </div>
//                         )}
//                         <h4 className={cx('uri')}>
//                           {post.title}
//                         </h4>
//                       </div>
//                     </Link>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// })

// export default CategoryUpdates


'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import styles from './CategoryUpdates.module.scss'

const cx = classNames.bind(styles)

const CategoryUpdates = React.memo(() => {
  const { data, loading, error } = useQuery(GetCategoryUpdates, {
    fetchPolicy: 'cache-first',
  })

  if (loading) return null
  if (error) return <p className={cx('error')}>Error: {error.message}</p>

  const children = data?.category?.children?.edges || []

  return (
    <div className={cx('categoryUpdatesWrapper')}>
      {children.map(({ node: category }) => {
        const posts = category?.contentNodes?.edges?.slice(0, 8) || []

        return (
          <div key={category.id} className={cx('childCategory')}>
            <h2 className={cx('title')}>{category.name}</h2>

            {category.description && (
              <p className={cx('description')}>{category.description}</p>
            )}

            <div className={cx('postsWrapper')}>
              {posts.map(({ node: post }) => {
                const featuredImage = post.featuredImage?.node
                const postUrl = post.uri || `/${post.slug}`

                return (
                  <div key={post.id} className={cx('card')}>
                    <Link href={postUrl} className={cx('cardInner')}>
                      <div>
                        {featuredImage?.mediaItemUrl && (
                          <div className={cx('imageWrapper')}>
                            <Image
                              src={featuredImage.mediaItemUrl}
                              alt={featuredImage.title || post.title}
                              fill
                              loading="lazy"
                              className={cx('thumbnail')}
                            />
                          </div>
                        )}
                        <h4 className={cx('uri')}>{post.title}</h4>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default CategoryUpdates
