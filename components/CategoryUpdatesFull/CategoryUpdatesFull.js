import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import classNames from 'classnames/bind'
import styles from './CategoryUpdatesFull.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

const CategoryUpdatesFull = () => {
  const { data, loading, error } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  const [visibleCounts, setVisibleCounts] = useState({})

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const children = data?.category?.children?.edges || []

  const getVisibleCount = (categoryId) => visibleCounts[categoryId] || 11

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
    <div className={cx('categoryUpdatesFullWrapper')}>
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
              {visiblePosts.map(({ node: post }) => {
                const featuredImage = post.featuredImage?.node
                const postUrl = `/news/updates/${post.slug}`

                return (
                  <div key={post.id} className={cx('card')}>
                    <Link href={postUrl} className={cx('cardInner')}>
                      <div>
                        {featuredImage?.mediaItemUrl && (
                          <div className={cx('imageWrapper')}>
                            <Image
                              src={featuredImage.mediaItemUrl}
                              alt={featuredImage.title || post.title}
                              width={400}
                              height={300}
                              className={cx('thumbnail')}
                            />
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
                  </div>
                )
              })}
            </div>

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

export default CategoryUpdatesFull
