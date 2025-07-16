import React from 'react'
import classNames from 'classnames/bind'
import styles from './GuideSecondLatestStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

export default function GuideSecondLatestStories({ featuredImage, caption, uri }) {
  if (!featuredImage?.sourceUrl || !uri) return null

  return (
    <div className={cx('imageWrapper')}>
      <Link href={uri}>
        <Image
          src={featuredImage.sourceUrl}
          alt={caption || 'Featured Image'}
          width={600}
          height={400}
          className={cx('mainImage')}
        />
      </Link>
      {caption && <div className={cx('caption')}>{caption}</div>}
    </div>
  )
}
