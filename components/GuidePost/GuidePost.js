import classNames from 'classnames/bind'
import FeaturedImage from '../../components/FeaturedImage/FeaturedImage'

import styles from './GuidePost.module.scss'
import Link from 'next/link'  
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { normalizeInternalHref } from '@/lib/normalizeInternalHref'

let cx = classNames.bind(styles)

const MAX_CONTENT_LENGTH = 150

export default function GuidePost({
  title,
  content,
  uri,
  featuredImage,
}) {
  let trimmedContent = content?.substring(0, MAX_CONTENT_LENGTH)
  const lastSpaceIndex = trimmedContent?.lastIndexOf(' ')

  if (lastSpaceIndex !== -1) {
    trimmedContent = trimmedContent?.substring(0, lastSpaceIndex) + '...'
  }

  return (
    <article className={cx('component')}>
      {featuredImage && (
        <div className={cx('content-wrapper-image')}>
          {uri && (
            <Link href={normalizeInternalHref(uri)}>
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
          <Link href={normalizeInternalHref(uri)}>
            <h5 className={cx('category')}>{'Partner Content'}</h5>
          </Link>
        )}
      </div>

      <div className={cx('content-wrapper')}>
        {uri && (
          <Link href={normalizeInternalHref(uri)}>
            <h2 className={cx('title')}>{title}</h2>
          </Link>
        )}
      </div>
      {content !== undefined && content !== null && (
        <div className={cx('content-wrapper')}>
          {uri && (
            <Link href={normalizeInternalHref(uri)}>
              <div
                className={cx('content')}
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(trimmedContent),
                }}
              />
            </Link>
          )}
        </div>
      )}
      <div className={cx('border-bottom')}></div>
    </article>
  )
}
