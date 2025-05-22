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
    return visibleCounts[categoryId]?.visible || 11
  }

  const handleViewMore = (categoryId, totalPosts, uri) => {
    setVisibleCounts((prev) => {
      const prevData = prev[categoryId] || { count: 0, visible: 11 }

      // Arahkan ke URI jika tombol diklik 3 kali
      if (prevData.count >= 2) {
        router.push(uri)
        return prev
      }

      return {
        ...prev,
        [categoryId]: {
          count: prevData.count + 1,
          visible: Math.min(prevData.visible + 10, totalPosts),
        },
      }
    })
  }

  const isAllFinished = children.every(({ node: category }) => {
    const posts = category?.contentNodes?.edges || []
    const visibleCount = getVisibleCount(category.id)
    return visibleCount >= posts.length
  })

  return (
    <div
      className={cx('categoryUpdatesWrapper')}
      data-updates-finished={isAllFinished ? 'true' : 'false'}
    >
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
              {visiblePosts.map(({ node: post }, index) => {
                const featuredImage = post.featuredImage?.node
                const isFirst = index === 0
                const postUrl = post.uri || `/${post.slug}`

                return (
                  <div
                    key={post.id}
                    className={cx('card', {
                      fullWidth: isFirst,
                      sideBySide: !isFirst,
                    })}
                  >
                    <Link href={postUrl} className={cx('cardInner')}>
                      <div>
                        {featuredImage?.mediaItemUrl && (
                          <div
                            className={cx('imageWrapper', {
                              largeImage: isFirst,
                              squareImage: !isFirst,
                            })}
                          >
                            <Image
                              src={featuredImage.mediaItemUrl}
                              alt={featuredImage.title || post.title}
                              fill
                              className={cx('thumbnail')}
                            />
                          </div>
                        )}

                        {post.categories?.nodes?.length > 0 && (
                          <div className={cx('categoryList')}>
                            {post.categories.nodes
                              .slice(-2)
                              .map((cat) => cat.name)
                              .join(' | ')}
                          </div>
                        )}

                        <h4 className={cx('slug')}>
                          {post.slug.replace(/-/g, ' ')}
                        </h4>

                        {post.excerpt && (
                          <div
                            className={cx('excerpt')}
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                          />
                        )}
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            {visibleCount < posts.length && (
              <div className={cx('viewMoreWrapper')}>
                <button
                  onClick={() =>
                    handleViewMore(category.id, posts.length, category.uri)
                  }
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
