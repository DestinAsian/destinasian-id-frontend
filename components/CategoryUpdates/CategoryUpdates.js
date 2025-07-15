// components/CategoryUpdates/CategoryUpdates.js
'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'
import styles from './CategoryUpdates.module.scss'

const cx = classNames.bind(styles)

const CategoryUpdates = React.memo(({ data = [] }) => {
  if (!data.length) return null

  return (
    <div className={cx('categoryUpdatesWrapper')}>
      {data.map(({ node: category }) => {
        const allPosts = category?.contentNodes?.edges || []
        const posts = allPosts.slice(0, 8)

        return (
          <div key={category.id} className={cx('childCategory')}>
            {/* Judul kategori dengan link */}
            <Link href={category.uri}>
              <h2 className={cx('title')}>{category.name}</h2>
            </Link>

            {/* Deskripsi (jika ada) */}
            {category.description && (
              <p className={cx('description')}>{category.description}</p>
            )}

            {/* List post */}
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
                        <p className={cx('uri')}>{post.title}</p>
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
