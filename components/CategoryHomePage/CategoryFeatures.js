'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import styles from './CategoryFeatures.module.scss'

const CategoryFeatures = ({ data }) => {
  if (!data) return null

  const { name, uri, categoryImages, posts } = data
  const postEdges = posts?.edges ?? []

  return (
    <section className={styles.CategoryFeaturesWrapper}>
      <header className={styles.childCategory}>
        <Link href={uri} className={styles.titleLink}>
          <h2 className={styles.title}>{name}</h2>
        </Link>

        {categoryImages?.categoryImagesCaption && (
          <p className={styles.description}>
            {categoryImages.categoryImagesCaption}
          </p>
        )}
      </header>

      <div className={styles.gridSection}>
        {postEdges.map(({ node: post }) => {
          if (!post) return null

          const image = post.featuredImage?.node?.mediaItemUrl
          const categories = post.categories?.edges?.map(e => e.node) ?? []

          const categoryWithParent = categories.find(cat => cat?.parent?.node)
          const category = categoryWithParent || categories[0]

          const parentCategory = category?.parent?.node?.name
          const subCategory = category?.name

          const safeDate = post.date
            ? format(new Date(post.date), 'dd MMMM yyyy')
            : null

          return (
            <article key={post.id} className={styles.card}>
              <Link href={post.uri} className={styles.cardLink}>
                {image && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={image}
                      alt={post.title || 'Article image'}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={styles.thumbnail}
                      priority={false}
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

                {post.excerpt && (
                  <div
                    className={styles.excerpt}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                )}

                <footer className={styles.footer}>
                  <span className={styles.readMore}>Read More →</span>
                </footer>

                {safeDate && (
                  <time className={styles.date} dateTime={post.date}>
                    {safeDate}
                  </time>
                )}
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryFeatures
