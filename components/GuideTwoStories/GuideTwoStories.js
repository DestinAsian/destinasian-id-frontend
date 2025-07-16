import classNames from 'classnames/bind'
import dynamic from 'next/dynamic'
import styles from './GuideTwoStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

// NOTE: Removed unused dynamic imports (FeaturedImage, Container) for performance

// Clean up dropcap tags
const stripDropcapTags = (content) =>
  content
    ? content
        .replace(/\[\/?dropcap\]/gi, '')
        .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi, '$1')
    : ''

const MAX_EXCERPT_LENGTH = 150

export default function GuideTwoStories({
  title,
  excerpt,
  parentCategory,
  category,
  categoryUri,
  uri,
  featuredImage,
}) {
  // Clean and trim excerpt
  const rawExcerpt = stripDropcapTags(excerpt)
  const trimmedExcerpt =
    rawExcerpt?.substring(0, rawExcerpt.lastIndexOf(' ', MAX_EXCERPT_LENGTH)) +
    '...'

  return (
    <article className={cx('component')}>
      <div className={cx('container-wrapper')}>
        {/* Featured Image */}
        {featuredImage && uri && (
          <div className={cx('content-wrapper-image')}>
            <Link href={uri}>
              <Image
                src={featuredImage?.sourceUrl}
                alt={`${title} Featured Image`}
                fill
                sizes="100%"
                priority
              />
            </Link>
          </div>
        )}

        {/* Category label */}
        {parentCategory !== 'Rest of World' &&
          category !== 'Rest of World' &&
          categoryUri && (
            <div className={cx('content-wrapper')}>
              <Link href={categoryUri}>
                <h5 className={cx('category')}>
                  {parentCategory} {category}
                </h5>
              </Link>
            </div>
          )}

        {/* Title */}
        {uri && title && (
          <div className={cx('content-wrapper')}>
            <Link href={uri}>
              <h2 className={cx('title')}>{title}</h2>
            </Link>
          </div>
        )}

        {/* Excerpt */}
        {trimmedExcerpt && uri && (
          <div className={cx('content-wrapper')}>
            <Link href={uri}>
              <div
                className={cx('excerpt')}
                dangerouslySetInnerHTML={{ __html: trimmedExcerpt }}
              />
            </Link>
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className={cx('border-bottom')} />
    </article>
  )
}
