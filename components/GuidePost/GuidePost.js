import classNames from 'classnames/bind'
import dynamic from 'next/dynamic'

const FeaturedImage = dynamic(() => import('../../components/FeaturedImage/FeaturedImage'))
const CategoryIcon = dynamic(() => import('../../components/CategoryIcon/CategoryIcon'))
const LocationIcon = dynamic(() => import('../../components/LocationIcon/LocationIcon'))
const Container = dynamic(() => import('../../components/Container/Container'))

import styles from './GuidePost.module.scss'
import Link from 'next/link'  

let cx = classNames.bind(styles)

const MAX_CONTENT_LENGTH = 150 // Adjust the maximum length as needed

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
            <h5 className={cx('category')}>{'Partner Content'}</h5>
          </Link>
        )}
      </div>

      <div className={cx('content-wrapper')}>
        {uri && (
          <Link href={uri}>
            <h2 className={cx('title')}>{title}</h2>
          </Link>
        )}
      </div>
      {content !== undefined && content !== null && (
        <div className={cx('content-wrapper')}>
          {uri && (
            <Link href={uri}>
              <div
                className={cx('content')}
                dangerouslySetInnerHTML={{ __html: trimmedContent }}
              />
            </Link>
          )}
        </div>
      )}
      <div className={cx('border-bottom')}></div>
    </article>
  )
}
