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
        const posts = category?.contentNodes?.edges?.slice(0, 8) || []

        return (
          <div key={category.id} className={cx('childCategory')}>
            <Link href={category.uri}>
              <h2 className={cx('title')}>{category.name}</h2>
            </Link>

            {category.description && (
              <p className={cx('description')}>{category.description}</p>
            )}

            <div className={cx('postsWrapper')}>
              {posts.map(({ node: post }) => {
                const image = post.featuredImage?.node
                return (
                  <div key={post.id} className={cx('card')}>
                    <Link href={post.uri} className={cx('cardInner')}>
                      {image?.mediaItemUrl && (
                        <div className={cx('imageWrapper')}>
                          <Image
                            src={image.mediaItemUrl}
                            alt={image.title || post.title}
                            fill
                            loading="lazy"
                            className={cx('thumbnail')}
                          />
                        </div>
                      )}
                      <p className={cx('uri')}>{post.title}</p>
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
