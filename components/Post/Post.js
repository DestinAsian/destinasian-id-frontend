import classNames from 'classnames/bind'
import { FeaturedImage, CategoryIcon, LocationIcon, Container } from '../../components'
import styles from './Post.module.scss'
import Link from 'next/link'

let cx = classNames.bind(styles)

const MAX_EXCERPT_LENGTH = 150 // Adjust the maximum length as needed

export default function Post({
  title,
  excerpt,
  parentCategory,
  category,
  categoryUri,
  uri,
  featuredImage,
  categoryLabel,
  chooseYourCategory,
  chooseIcon,
  locationLabel,
  locationUrl,
  locationValidation,
}) {
  let trimmedExcerpt = excerpt?.substring(0, MAX_EXCERPT_LENGTH)
  const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')

  if (lastSpaceIndex !== -1) {
    trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
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

      {parentCategory !== 'Rest of World' && category !== 'Rest of World' && (
        <div className={cx('content-wrapper')}>
          {categoryUri && (
            <Link href={categoryUri}>
              <h5 className={cx('category')}>
                {parentCategory} {category}
              </h5>
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
      {excerpt !== undefined && excerpt !== null && (
        <div className={cx('content-wrapper')}>
          {uri && (
            <Link href={uri}>
              <div
                className={cx('excerpt')}
                dangerouslySetInnerHTML={{ __html: trimmedExcerpt }}
              />
            </Link>
          )}
        </div>
      )}
      <div className={cx('content-wrapper')}>
        {(chooseYourCategory || locationValidation) && (
          <div className={cx('icon-wrapper')}>
            {chooseYourCategory && (
              <CategoryIcon
                chooseYourCategory={chooseYourCategory}
                chooseIcon={chooseIcon}
                categoryLabel={categoryLabel}
              />
            )}
            {locationValidation && (
              <LocationIcon
                locationValidation={locationValidation}
                locationLabel={locationLabel}
                locationUrl={locationUrl}
              />
            )}
          </div>
        )}
      </div>
      <div className={cx('border-bottom')}></div>
    </article>
  )
}
