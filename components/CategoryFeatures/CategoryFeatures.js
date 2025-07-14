'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import classNames from 'classnames/bind'
import styles from './CategoryFeatures.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

const cx = classNames.bind(styles)

const CategoryFeatures = () => {
  const { data, loading, error } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
    fetchPolicy: 'cache-first',
  })

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    // Optional: bisa ubah jumlah default berdasarkan screen size
    const checkWidth = () => {
      setVisibleCount(window.innerWidth < 768 ? 2 : 3)
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  if (loading) return null
  if (error) return <p className={cx('error')}>Error: {error.message}</p>

  const category = data?.category
  const posts = category?.posts?.edges || []

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
            const featuredImage = post.featuredImage?.node
            const firstCategory = post.categories?.edges?.[0]?.node
            const parentCategoryName = firstCategory?.parent?.node?.name || ''
            const categoryName = firstCategory?.name || ''

            return (
              <Link key={post.id} href={post.uri || `/${post.slug}`}>
                <div className={cx('card')}>
                  <div className={cx('cardInner')}>
                    {featuredImage?.mediaItemUrl && (
                      <div className={cx('imageWrapper')}>
                        <Image
                          src={featuredImage.mediaItemUrl}
                          alt={post.slug}
                          width={600}
                          height={400}
                          className={cx('thumbnail')}
                          loading="lazy"
                        />
                      </div>
                    )}

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
                    />

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
      </div>
    </div>
  )
}

export default CategoryFeatures
