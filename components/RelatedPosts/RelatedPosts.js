'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'

import { GetRelatedPosts } from '../../queries/GetRelatedPosts'
import styles from './RelatedPosts.module.scss'

const cleanExcerpt = (excerpt = '') =>
  excerpt
    .replace(/\[\/?dropcap\]/gi, '')
    .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>.*?<\/span>/gi, '')
    .trim()

export default function RelatedPosts({ tagIds, excludeIds }) {
  const { data, loading, error } = useQuery(GetRelatedPosts, {
    variables: { tagIn: tagIds, notIn: excludeIds },
    skip: !tagIds?.length,
  })

  const posts = data?.posts?.edges || []

  if (loading) return <p className={styles.statusText}>Loading related posts...</p>
  if (error) return <p className={styles.statusText}>Error: {error.message}</p>
  if (!posts.length) return <p className={styles.statusText}>No related posts found.</p>

  return (
    <div className={styles.relatedPosts}>
      {posts.map(({ node }) => (
        <Link href={node.uri} key={node.databaseId} className={styles.relatedItem}>
          <div className={styles.imageWrapper}>
            {node.featuredImage?.node?.sourceUrl && (
              <Image
                src={node.featuredImage.node.sourceUrl}
                alt={node.featuredImage.node.altText || node.title}
                width={180}
                height={120} // rasio 3:2
                className={styles.image}
              />
            )}
          </div>

          <div className={styles.content}>
            {node.categories?.edges?.length > 0 && (
              <div className={styles.category}>
                <span>{node.categories.edges[0].node.name}</span>
              </div>
            )}

            <h3 className={styles.title}>{node.title}</h3>
            <div
              className={styles.excerpt}
              dangerouslySetInnerHTML={{
                __html: cleanExcerpt(node.excerpt),
              }}
            />
          </div>
        </Link>
      ))}
    </div>
  )
}
