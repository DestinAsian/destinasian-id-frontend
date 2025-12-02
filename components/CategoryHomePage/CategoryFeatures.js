'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import styles from './CategoryFeatures.module.scss'

const CategoryFeatures = ({ data }) => {
  if (!data) return null

  const { name, uri, categoryImages, posts } = data

  const postEdges = useMemo(() => posts?.edges || [], [posts])

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
        {postEdges.map(({ node: post }) => {
          const image = post.featuredImage?.node?.mediaItemUrl

          const categoryList = post.categories?.edges?.map((e) => e.node) || []
          const categoryWithParent = categoryList.find(cat => cat.parent?.node)
          const category = categoryWithParent || categoryList[0]

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
                      height={600}
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
