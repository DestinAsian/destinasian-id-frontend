'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'

import { GetRelatedTravelGuides } from '../../queries/GetRelatedTravelGuides'
import styles from './RelatedTravelGuides.module.scss'
import HalfPageGuides2 from '../../components/AdUnit/HalfPage2/HalfPageGuides2'

const cx = classNames.bind(styles)

const cleanExcerpt = (excerpt = '') =>
  excerpt
    .replace(/\[\/?dropcap\]/gi, '')
    .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>.*?<\/span>/gi, '')
    .trim()

export default function RelatedTravelGuides({ tagIds, excludeIds }) {
  const { data, loading, error } = useQuery(GetRelatedTravelGuides, {
    variables: { tagIn: tagIds, notIn: excludeIds },
    skip: !tagIds?.length,
  })

  const guides = data?.travelGuides?.edges || []
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e) => setIsMobile(e.matches)
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (loading)
    return <p className={styles.statusText}>Loading related guides...</p>
  if (error) return <p className={styles.statusText}>Error: {error.message}</p>
  if (!guides.length)
    return <p className={styles.statusText}>No related guides found.</p>

  return (
    <div className={cx('layoutWrapper')}>
      <div className={cx('relatedPosts')}>
        {guides.map(({ node }) => {
          const categories = node.categories?.edges || []
          const primaryCategory = categories[0]?.node
          const secondaryCategory = categories[1]?.node

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
                    height={120} // rasio 3:2
                    className={styles.image}
                  />
                )}
              </div>

              <div className={styles.content}>
                {(primaryCategory || secondaryCategory) && (
                  <div className={styles.category}>
                    {primaryCategory && (
                      <Link
                        href={primaryCategory.uri}
                        className={styles.categoryLink}
                      >
                        {primaryCategory.name}
                      </Link>
                    )}

                    {primaryCategory && secondaryCategory && (
                      <span className={styles.divider}>|</span>
                    )}

                    {secondaryCategory && (
                      <Link
                        href={secondaryCategory.uri}
                        className={styles.categoryLink}
                      >
                        {secondaryCategory.name}
                      </Link>
                    )}
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
          )
        })}

        {/* Ads mobile hanya tampil kalau ada minimal 1 guide */}
        {guides.length > 0 && isMobile && (
          <div className={styles.adsMobile}>
            <HalfPageGuides2 />
          </div>
        )}
      </div>

      {/* Ads desktop hanya tampil kalau ada minimal 1 guide */}
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
