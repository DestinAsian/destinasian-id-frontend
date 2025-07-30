// components/PostTwoColumns/PostTwoColumns.js
import classNames from 'classnames/bind'
import styles from './PostTwoColumns.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

export default function PostTwoColumns({ title, uri, featuredImage }) {
  if (!featuredImage) return null

  return (
    <div className={cx('content-wrapper-image')}>
      {title && uri && (
        <Link href={uri}>
          <Image
            src={featuredImage.sourceUrl}
            alt={title + ' Featured Image'}
            fill
            sizes="100%"
            priority
          />
        </Link>
      )}
    </div>
  )
}