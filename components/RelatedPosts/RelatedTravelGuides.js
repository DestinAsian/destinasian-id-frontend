'use client'

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import classNames from 'classnames/bind'

import { GetRelatedTravelGuides } from '../../queries/GetRelatedTravelGuides'
import { graphQLFetcher } from '../../lib/graphqlFetcher'

import styles from './RelatedTravelGuides.module.scss'

const HalfPageGuides2 = dynamic(
  () => import('../../components/AdUnit/HalfPage2/HalfPageGuides2'),
  { ssr: false },
)

const cx = classNames.bind(styles)

const decodeHtml = (value = '') => {
  if (!value) return ''
  if (typeof window === 'undefined') return value

  const textarea = document.createElement('textarea')
  textarea.innerHTML = value
  return textarea.value
}

const cleanExcerpt = (excerpt = '') => {
  const cleaned = excerpt
    .replace(/\[\/?dropcap\]/gi, '')
    .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>.*?<\/span>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim()

  return decodeHtml(cleaned)
}

export default function RelatedTravelGuides({ tagIds = [], excludeIds = [] }) {
  const shouldFetch = tagIds.length > 0

  const { data, error } = useSWR(
    shouldFetch ? ['related-travel-guides', tagIds, excludeIds] : null,
    () =>
      graphQLFetcher(GetRelatedTravelGuides, {
        tagIn: tagIds,
        notIn: excludeIds,
      }),
  )

  const guides = data?.travelGuides?.edges || []

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e) => setIsMobile(e.matches)
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (!shouldFetch) return null
  if (!data && !error)
    return <p className={styles.statusText}>Loading related guides...</p>
  if (error)
    return <p className={styles.statusText}>Error loading related guides.</p>
  if (!guides.length)
    return <p className={styles.statusText}>No related guides found.</p>

  return (
    <div className={cx('layoutWrapper')}>
      <div className={cx('relatedPosts')}>
        {guides.map(({ node }) => {
          const categories = node.categories?.edges || []
          const primaryCategory = categories[0]?.node
          const secondaryCategory = categories[1]?.node
          const excerptText = cleanExcerpt(node.excerpt)

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
                    alt={node.featuredImage.node.altText || node.title}
                    width={180}
                    height={120}
                    className={styles.image}
                  />
                )}
              </div>

              <div className={styles.content}>
                {(primaryCategory || secondaryCategory) && (
                  <div className={styles.category}>
                    {primaryCategory && (
                      <span className={styles.categoryLink}>
                        {primaryCategory.name}
                      </span>
                    )}

                    {primaryCategory && secondaryCategory && (
                      <span className={styles.divider}>|</span>
                    )}

                    {secondaryCategory && (
                      <span className={styles.categoryLink}>
                        {secondaryCategory.name}
                      </span>
                    )}
                  </div>
                )}

                <h3 className={styles.title}>{node.title}</h3>

                {excerptText && <p className={styles.excerpt}>{excerptText}</p>}
              </div>
            </Link>
          )
        })}

        {guides.length > 0 && isMobile && (
          <div className={styles.adsMobile}>
            <HalfPageGuides2 />
          </div>
        )}
      </div>

      {guides.length > 0 && !isMobile && (
        <aside className={styles.adsWrapper}>
          <div className={styles.stickyAds}>
            <HalfPageGuides2 />
          </div>
        </aside>
      )}
    </div>
  )
}
