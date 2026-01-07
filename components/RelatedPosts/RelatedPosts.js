'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { GetRelatedPosts } from '../../queries/GetRelatedPosts'
import { useSWRGraphQL } from '../../lib/useSWRGraphQL'
import styles from './RelatedPosts.module.scss'

/* ===============================
   HELPERS
=============================== */
const cleanExcerpt = (excerpt = '') =>
  excerpt
    .replace(/\[\/?dropcap\]/gi, '')
    .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>.*?<\/span>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim()

export default function RelatedPosts({
  tagIds = [],
  excludeIds = [],
}) {
  const shouldFetch = tagIds.length > 0

  const { data, error } = useSWRGraphQL(
    shouldFetch ? 'related-posts' : null,
    GetRelatedPosts,
    {
      tagIn: tagIds,
      notIn: excludeIds,
    }
  )

  const posts = data?.posts?.edges || []

  /* ===============================
     STATES (samakan dengan Apollo)
  =============================== */
  if (!shouldFetch) return null

  if (!data && !error) {
    return (
      <p className={styles.statusText}>
        Loading related posts...
      </p>
    )
  }

  if (error) {
    return (
      <p className={styles.statusText}>
        Error loading related posts.
      </p>
    )
  }

  if (!posts.length) {
    return (
      <p className={styles.statusText}>
        No related posts found.
      </p>
    )
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className={styles.relatedPosts}>
      {posts.map(({ node }) => {
        const category =
          node.categories?.edges?.[0]?.node

        return (
          <Link
            href={node.uri}
            key={node.databaseId}
            className={styles.relatedItem}
          >
            <div className={styles.imageWrapper}>
              {node.featuredImage?.node?.sourceUrl && (
                <Image
                  src={node.featuredImage.node.sourceUrl}
                  alt={
                    node.featuredImage.node.altText ||
                    node.title
                  }
                  width={180}
                  height={120}
                  className={styles.image}
                />
              )}
            </div>

            <div className={styles.content}>
              {category && (
                <div className={styles.category}>
                  <span>{category.name}</span>
                </div>
              )}

              <h3 className={styles.title}>
                {node.title}
              </h3>

              <p className={styles.excerpt}>
                {cleanExcerpt(node.excerpt)}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
