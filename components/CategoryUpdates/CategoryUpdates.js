
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import styles from './CategoryUpdates.module.scss'

const cx = classNames.bind(styles)

const CategoryUpdates = () => {
  const { data, loading, error } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  const [visibleCounts, setVisibleCounts] = useState({})
  const router = useRouter()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const children = data?.category?.children?.edges || []

  const getVisibleCount = (categoryId) => {
    return visibleCounts[categoryId]?.visible || 8
  }

  const handleViewMore = (categoryId, totalPosts) => {
    setVisibleCounts((prev) => {
      const prevData = prev[categoryId] || { visible: 8 }

      return {
        ...prev,
        [categoryId]: {
          visible: Math.min(prevData.visible + 4, totalPosts),
        },
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

            <div className={cx('postsWrapper')}>
              {visiblePosts.map(({ node: post }) => {
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
                              className={cx('thumbnail')}
                            />
                          </div>
                        )}
                        <h4 className={cx('slug')}>
                          {post.slug.replace(/-/g, ' ')}
                        </h4>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* {visibleCount < posts.length && (
              <div className={cx('viewMoreWrapper')}>
                <button
                  onClick={() =>
                    handleViewMore(category.id, posts.length)
                  }
                  className={cx('viewMoreButton')}
                >
                  View More
                </button>
              </div>
            )} */}
          </div>
        )
      })}
    </div>
  )
}

export default CategoryUpdates