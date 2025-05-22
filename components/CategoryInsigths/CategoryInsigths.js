// export default CategoryInsigths

import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetCategoryInsights } from '../../queries/GetCategoryInsights'
import classNames from 'classnames/bind'
import styles from './CategoryInsigths.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import buttonStyles from '../button/button.module.scss'


const cx = classNames.bind(styles)

const CategoryInsigths = () => {
  const { data, loading, error } = useQuery(GetCategoryInsights, {
    variables: { id: '29' },
  })

  const [visibleCount, setVisibleCount] = useState(6)

  const router = useRouter()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const category = data?.category
  const posts = Array.isArray(category?.posts?.edges)
    ? category.posts.edges
    : []

  if (!category || posts.length === 0) {
    return <p>Category data or articles not found.</p>
  }

  const visiblePosts = posts.slice(0, 5)
  const extraPosts = posts.slice(visibleCount)

  const [clickCount, setClickCount] = useState(0)

  const handleViewMore = () => {
    const newClickCount = clickCount + 1
    setClickCount(newClickCount)

    if (newClickCount >= 3) {
      router.push(category?.uri || '/')
    } else {
      setVisibleCount((prev) => Math.min(prev + 4, posts.length))
    }
  }

  return (
    <div className={cx('CategoryInsigthsWrapper')}>
      <div className={cx('childCategory')}>
        <h2 className={cx('title')}>{category?.name}</h2>

        {category?.categoryImages?.categoryImagesCaption && (
          <p className={cx('description')}>
            {category.categoryImages.categoryImagesCaption}
          </p>
        )}

        <p className={cx('articleCount')}>{posts.length} Articles</p>

        <div className={cx('postsWrapper')}>
          <div className={cx('leftColumn')}>
            {visiblePosts[0] && (
              <Link
                href={
                  visiblePosts[0]?.node.uri || `/${visiblePosts[0]?.node.slug}`
                }
                key={visiblePosts[0]?.node.id}
              >
                <div className={cx('card', 'fullWidth')}>
                  <div className={cx('cardInner')}>
                    {visiblePosts[0]?.node.featuredImage?.node
                      ?.mediaItemUrl && (
                      <div className={cx('imageWrapper', 'imageFirst')}>
                        <Image
                          src={
                            visiblePosts[0]?.node.featuredImage?.node
                              .mediaItemUrl
                          }
                          alt={
                            visiblePosts[0]?.node.featuredImage?.node
                              ?.description || visiblePosts[0]?.node.slug
                          }
                          width={800}
                          height={800}
                          className={cx('thumbnail')}
                        />
                      </div>
                    )}
                    <h4 className={cx('slug')}>
                      {visiblePosts[0]?.node.slug.replace(/-/g, ' ')}
                    </h4>
                    <div
                      className={cx('excerpt')}
                      dangerouslySetInnerHTML={{
                        __html: visiblePosts[0]?.node.excerpt,
                      }}
                    ></div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className={cx('rightColumn')}>
            {visiblePosts.slice(1).map(({ node: post }, index) => {
              const featuredImage = post.featuredImage?.node
              return (
                <div className={cx('cardWrapper')} key={post.id}>
                  <Link href={post.uri || `/${post.uri}`}>
                    <div className={cx('card', 'sideBySide')}>
                      <div className={cx('cardInners')}>
                        {featuredImage?.mediaItemUrl && (
                          <div className={cx('imageWrapper', 'imageOthers')}>
                            <Image
                              src={featuredImage.mediaItemUrl}
                              alt={featuredImage.description || post.slug}
                              width={600}
                              height={400}
                              className={cx('thumbnail')}
                            />
                          </div>
                        )}
                        <h4 className={cx('slug')}>
                          {post.slug.replace(/-/g, ' ')}
                        </h4>
                        <div
                          className={cx('excerpt')}
                          dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        ></div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          <div className={cx('gridSection')}>
            {posts.slice(6, visibleCount).map(({ node: post }) => (
              <Link key={post.id} href={post.uri || `/${post.uri}`}>
                <div className={cx('card')}>
                  <div className={cx('cardInner')}>
                    <div className={cx('imageWrapper', 'imageOthers')}>
                      <Image
                        src={post.featuredImage?.node?.mediaItemUrl}
                        alt={post.slug}
                        width={600}
                        height={400}
                        className={cx('thumbnail')}
                      />
                    </div>
                    <h4 className={cx('slug')}>
                      {post.slug.replace(/-/g, ' ')}
                    </h4>
                    <div
                      className={cx('excerpt')}
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {visibleCount < posts.length && (
          <div className={cx('viewMoreWrapper')}>
            <button
              onClick={handleViewMore}
              className={classNames(
                buttonStyles.button,
                buttonStyles['button-primary'],
                styles.viewMoreButton,
              )}
            >
              View More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryInsigths
