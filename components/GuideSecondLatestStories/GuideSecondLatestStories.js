'use client'

import React from 'react'
import classNames from 'classnames/bind'
import styles from './GuideSecondLatestStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

const getFirstImageFromContent = (content) => {
  if (!content || typeof content !== 'string') return ''

  const srcMatch =
    content.match(/<img[^>]+src=["']([^"']+)["']/i) ||
    content.match(/<img[^>]+data-src=["']([^"']+)["']/i)

  return srcMatch?.[1] || ''
}

export default function GuideSecondLatestStories({
  featuredImage,
  caption,
  uri,
  content,
  priority = false,
}) {
  const imageUrl =
    featuredImage?.sourceUrl ||
    featuredImage?.mediaItemUrl ||
    getFirstImageFromContent(content) ||
    ''
  if (!uri) return null

  return (
    <div className={cx('imageWrapper')}>
      <Link href={uri} aria-label={caption || 'Guide story'}>
        {imageUrl ? (
          <Image
            quality={100}
            src={imageUrl}
            alt={caption || 'Featured Image'}
            width={600} // Fixed dimensions to prevent layout shift
            height={400} // Keeping consistent 3:2 ratio
            priority={priority}
            className={cx('mainImage')}
          />
        ) : (
          <div className={cx('imagePlaceholder')} aria-hidden="true" />
        )}
      </Link>
      {caption && <div className={cx('caption')}>{caption}</div>}
    </div>
  )
}
