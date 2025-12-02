'use client'

import classNames from 'classnames/bind'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from './ErrorPage.module.scss'

const FeaturedImage = dynamic(() =>
  import('../../components/FeaturedImage/FeaturedImage')
)
const Button = dynamic(() => import('../../components/Button/Button'))

const cx = classNames.bind(styles)

export default function ErrorPage({ image, title, content }) {
  return (
    <div className={cx('component')}>
      {/* BAGIAN GAMBAR */}
      <div className={cx('image-wrapper')}>
        {image && (
          <FeaturedImage
            image={image}
            className={cx('image')}
            priority
          />
        )}
      </div>

      {/* BAGIAN TITLE + CONTENT */}
      <div className={cx('upper-wrapper')}>
        <div className={cx('content-wrapper')}>
          {title && <h2>{title}</h2>}
          {content && (
            <div
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className={cx('footer-wrapper')}>
        {'Go to '}
        <Link href="/">{'DestinAsian.com'}</Link>
      </div>
    </div>
  )
}
