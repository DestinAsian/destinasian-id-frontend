'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './CategoryUpdates.module.scss'

const CategoryUpdates = React.memo(({ data = [] }) => {
  if (!data?.length) return null

  return (
    <div className={styles.categoryUpdatesWrapper}>
      {data.map(({ node: category }) => {
        const posts = category?.contentNodes?.edges?.slice(0, 8) || []
        if (!posts.length) return null

        return (
          <section key={category.id} className={styles.childCategory}>
            <Link href={category.uri} className={styles.titleLink}>
              <h2 className={styles.title}>{category.name}</h2>
            </Link>

            {category.description && (
              <p className={styles.description}>{category.description}</p>
            )}

            <div className={styles.postsWrapper}>
              {posts.map(({ node: post }) => {
                const image = post.featuredImage?.node
                return (
                  <article key={post.id} className={styles.card}>
                    <Link href={post.uri} className={styles.cardInner}>
                      {image?.mediaItemUrl && (
                        <figure className={styles.imageWrapper}>
                          <Image
                            src={image.mediaItemUrl}
                            alt={image.title || post.title}
                            width={400}
                            height={300}
                            loading="lazy"
                            draggable={false}
                            className={styles.thumbnail}
                          />
                        </figure>
                      )}
                      <p className={styles.uri}>{post.title}</p>
                    </Link>
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
})

export default CategoryUpdates
