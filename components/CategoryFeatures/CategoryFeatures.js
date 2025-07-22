'use client'

import React, { useEffect, useState, useMemo } from 'react'
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
    nextFetchPolicy: 'cache-and-network',
  })

  const [visibleCount, setVisibleCount] = useState(3)

  // Ubah jumlah visibleCount berdasarkan lebar layar
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      setVisibleCount(isMobile ? 2 : 3)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loading) return null
  if (error) return <p className={cx('error')}>Error: {error.message}</p>

  const category = data?.category
  if (!category) return null

  const posts = category.posts?.edges || []

  // Memoisasi post yang ditampilkan untuk efisiensi
  // const visiblePosts = useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount])
  const visiblePosts = posts

  return (
    <div className={cx('CategoryFeaturesWrapper')}>
      <div className={cx('childCategory')}>
        <Link href={category.uri}>
          <h2 className={cx('title')}>{category.name}</h2>
        </Link>

        {category.categoryImages?.categoryImagesCaption && (
          <p className={cx('description')}>
            {category.categoryImages.categoryImagesCaption}
          </p>
        )}

        <div className={cx('gridSection')}>
          {visiblePosts.map(({ node: post }) => {
            const image = post.featuredImage?.node
            const firstCategory = post.categories?.edges?.[0]?.node
            const parentCategory = firstCategory?.parent?.node?.name || ''
            const subCategory = firstCategory?.name || ''

            return (
              <Link key={post.id} href={post.uri || `/${post.slug}`}>
                <div className={cx('card')}>
                  <div className={cx('cardInner')}>
                    {image?.mediaItemUrl && (
                      <div className={cx('imageWrapper')}>
                        <Image
                          src={image.mediaItemUrl}
                          alt={post.slug}
                          width={600}
                          height={400}
                          className={cx('thumbnail')}
                          loading="lazy"
                        />
                      </div>
                    )}

                    {parentCategory && (
                      <p className={cx('parentCategory')}>{parentCategory}</p>
                    )}

                    {subCategory && (
                      <p className={cx('postCategory')}>{subCategory}</p>
                    )}

                    <p
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
