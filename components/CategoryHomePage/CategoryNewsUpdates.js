'use client'

import React, { memo, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { getApolloClient } from '@faustwp/core'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import Link from 'next/link'
import Image from 'next/image'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import styles from './CategoryNewsUpdates.module.scss'

import 'swiper/css'
import 'swiper/css/navigation'

/* ============================
   GRAPHQL FETCHER
============================ */
const graphQLFetcher = async (query, variables) => {
  const client = getApolloClient()
  const { data } = await client.query({
    query,
    variables,
  })
  return data
}

const CategoryNewsUpdates = memo(() => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data, error } = useSWR(
    mounted ? ['GetCategoryUpdates', { include: ['41'] }] : null,
    ([, variables]) => graphQLFetcher(GetCategoryUpdates, variables),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  const children = useMemo(
    () => data?.category?.children?.edges || [],
    [data]
  )

  if (!mounted) return null
  if (error) return <p className={styles.error}>Error: {error.message}</p>
  if (!children.length) return null

  return (
    <div className={styles.categoryNewsUpdatesWrapper}>
      {children.map(({ node: category }) => {
        const posts = category?.contentNodes?.edges || []
        if (!posts.length) return null

        return (
          <section key={category.id} className={styles.childCategory}>
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
            >
              {posts.map(({ node: post }) => {
                const image = post.featuredImage?.node

                return (
                  <SwiperSlide key={post.id}>
                    <Link href={post.uri} className={styles.slideLink}>
                      <div className={styles.slideWrapper}>
                        {image?.mediaItemUrl && (
                          <div className={styles.imageWrapper}>
                            <Image
                              src={image.mediaItemUrl}
                              alt={image.title || post.title}
                              width={1022}
                              height={600}
                              loading="lazy"
                              draggable={false}
                              className={styles.thumbnail}
                              style={{ objectFit: 'cover' }}
                            />

                            <div className={styles.overlay}>
                              <h3 className={styles.postTitle}>
                                {post.title}
                              </h3>
                              <span className={styles.readMore}>
                                Read More →
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </section>
        )
      })}
    </div>
  )
})

export default CategoryNewsUpdates
