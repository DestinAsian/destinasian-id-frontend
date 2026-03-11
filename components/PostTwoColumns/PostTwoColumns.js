// components/PostTwoColumns/PostTwoColumns.js
import classNames from 'classnames/bind'
import styles from './PostTwoColumns.module.scss'
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

export default function PostTwoColumns({ title, uri, featuredImage, content }) {
  const imageUrl =
    featuredImage?.sourceUrl ||
    featuredImage?.mediaItemUrl ||
    getFirstImageFromContent(content) ||
    ''
  if (!uri) return null

  return (
    <div className={cx('content-wrapper-image')}>
      {title && (
        <Link href={uri} className={cx('imageLink')}>
          <div className={cx('imageInner')}>
            {imageUrl ? (
              <Image
                quality={100}
                src={imageUrl}
                alt={title + ' Featured Image'}
                fill
                sizes="100%"
                priority
              />
            ) : (
              <div className={cx('imagePlaceholder')} aria-hidden="true" />
            )}
          </div>
        </Link>
      )}
    </div>
  )
}
