'use client'
import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import Link from 'next/link'
import Image from 'next/image'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import styles from './CategoryNewsUpdates.module.scss'
import 'swiper/css'
import 'swiper/css/navigation'

const CategoryNewsUpdates = React.memo(() => {
  const { data, loading, error } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
    fetchPolicy: 'cache-first', // ⏱️ cepatkan query
  })

  const children = useMemo(
    () => data?.category?.children?.edges || [],
    [data]
  )

  if (loading || !data) return null
  if (error) return <p className={styles.error}>Error: {error.message}</p>

  return (
    <div className={styles.categoryNewsUpdatesWrapper}>
      {children.map(({ node: category }) => {
        const posts = category?.contentNodes?.edges?.slice(0, 20) || []

        return (
          <div key={category.id} className={styles.childCategory}>
            {category.description && (
              <p className={styles.description}>{category.description}</p>
            )}

            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              className={styles.swiperContainer}
              preloadImages={false}
              lazy="true"
            >
              {posts.map(({ node: post }) => {
                const featuredImage = post.featuredImage?.node
                const postUrl = post.uri || `/${post.slug}`

                return (
                  <SwiperSlide key={post.id}>
                    <div className={styles.slideWrapper}>
                      {featuredImage?.mediaItemUrl && (
                        <div className={styles.imageWrapper}>
                          <Image
                            src={featuredImage.mediaItemUrl}
                            alt={post.title}
                            width={800}
                            height={600}
                            className={styles.thumbnail}
                            loading="lazy"
                            placeholder="empty"
                          />

                          <div className={styles.overlay}>
                            <h3 className={styles.postTitle}>{post.title}</h3>
                            <Link href={postUrl} className={styles.readMore}>
                              Read More →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )
      })}
    </div>
  )
})

export default CategoryNewsUpdates
