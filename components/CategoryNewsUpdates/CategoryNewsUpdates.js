import React from 'react'
import { useQuery } from '@apollo/client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import Link from 'next/link'
import Image from 'next/image'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import styles from './CategoryNewsUpdates.module.scss'
import 'swiper/css'
import 'swiper/css/navigation'


const CategoryNewsUpdates = () => {
  const { data, loading, error } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const children = data?.category?.children?.edges || []

  return (
    <div className={styles.categoryNewsUpdatesWrapper}>
      {children.map(({ node: category }) => {
        const posts = category?.contentNodes?.edges || []

        return (
          <div key={category.id} className={styles.childCategory}>
            {/* <h2 className={styles.title}>{category.name}</h2> */}
            {category.description && (
              <p className={styles.description}>{category.description}</p>
            )}

            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              className={styles.swiperContainer}
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
                            fill
                            className={styles.thumbnail}
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
}

export default CategoryNewsUpdates
