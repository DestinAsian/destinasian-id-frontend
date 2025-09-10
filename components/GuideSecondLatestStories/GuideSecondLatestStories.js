'use client'

import React from 'react'
import classNames from 'classnames/bind'
import styles from './GuideSecondLatestStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

export default function GuideSecondLatestStories({ featuredImage, caption, uri }) {
  // Prevent rendering if data is missing
  if (!featuredImage?.sourceUrl || !uri) return null

  return (
    <div className={cx('imageWrapper')}>
      <Link href={uri} aria-label={caption || 'Guide story'}>
        <Image
          src={featuredImage.sourceUrl}
          alt={caption || 'Featured Image'}
          width={600}       // Fixed dimensions to prevent layout shift
          height={400}      // Keeping consistent 3:2 ratio
          priority={false}  // Lazy load by default
          className={cx('mainImage')}
        />
      </Link>
      {caption && <div className={cx('caption')}>{caption}</div>}
    </div>
  )
}
