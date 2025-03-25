import classNames from 'classnames/bind'
import { FeaturedImage } from '../../components'
import styles from './LLPost.module.scss'
import Link from 'next/link'

let cx = classNames.bind(styles)

export default function LLPost({
  title,
  category,
  uri,
  featuredImage,
  parentTitle,
}) {
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
      {category && (
        <div className={cx('category-wrapper')}>
          <h5 className={cx('category')}>
            {/* {parentTitle} {' / '}  */}
            {category}
          </h5>
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
