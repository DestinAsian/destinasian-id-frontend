'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import Link from 'next/link'
import Image from 'next/image'
import styles from './CategoryFeatures.module.scss'
import { format } from 'date-fns'

const CategoryFeatures = () => {
  const { data, loading, error } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
    fetchPolicy: 'cache-first',
  })

  const posts = useMemo(() => data?.category?.posts?.edges || [], [data])

  if (loading || !data?.category) return null
  if (error) return <p className={styles.error}>Error: {error.message}</p>

  const { name, uri, categoryImages } = data.category

  return (
    <section className={styles.CategoryFeaturesWrapper}>
      <header className={styles.childCategory}>
        <Link href={uri}>
          <h2 className={styles.title}>{name}</h2>
        </Link>

        {categoryImages?.categoryImagesCaption && (
          <p className={styles.description}>
            {categoryImages.categoryImagesCaption}
          </p>
        )}
      </header>

      <div className={styles.gridSection}>
        {posts.map(({ node: post }) => {
          const image = post.featuredImage?.node?.mediaItemUrl
          const category = post.categories?.edges?.[0]?.node
          const parentCategory = category?.parent?.node?.name || ''
          const subCategory = category?.name || ''

          return (
            <Link key={post.id} href={post.uri}>
              <article className={styles.card}>
                {image && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={image}
                      alt={post.title}
                      width={800}
                      height={600} // 4:3 ratio → konsisten, no wobble
                      className={styles.thumbnail}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                )}

                {parentCategory && (
                  <p className={styles.parentCategory}>{parentCategory}</p>
                )}

                {subCategory && (
                  <p className={styles.postCategory}>{subCategory}</p>
                )}

                <div
                  className={styles.excerpt}
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />

                <footer className={styles.footer}>
                  <span className={styles.readMore}>Read More →</span>
                </footer>

                <time className={styles.date}>
                  {format(new Date(post.date), 'dd MMMM yyyy')}
                </time>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryFeatures
