import classNames from 'classnames/bind'
import { FeaturedImage } from '../../components'
import styles from './ContestPost.module.scss'
import Link from 'next/link'

let cx = classNames.bind(styles)

export default function ContestPost({ title, uri, featuredImage }) {
  return (
    <article className={cx('component')}>
      {featuredImage && (
        <div className={cx('content-wrapper-image')}>
          {uri && (
            <Link href={uri}>
              <FeaturedImage
                image={featuredImage}
                className={styles.featuredImage}
              />
            </Link>
          )}
        </div>
      )}
      <div className={cx('content-wrapper')}>
        {uri && (
          <Link href={uri}>
            <h2 className={cx('title')}>{title}</h2>
          </Link>
        )}
      </div>
      <div className={cx('content-wrapper-image')}>
        <div className={cx('border-bottom')}></div>
      </div>
    </article>
  )
}
