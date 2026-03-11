import classNames from 'classnames/bind'
import styles from './GuideLatestStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

const cx = classNames.bind(styles)

const MAX_EXCERPT_LENGTH = 150

const stripDropcapTags = (content = '') =>
  content
    .replace(/\[\/?dropcap\]/gi, '')
    .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi, '$1')

const getFirstImageFromContent = (content) => {
  if (!content || typeof content !== 'string') return ''

  const srcMatch =
    content.match(/<img[^>]+src=["']([^"']+)["']/i) ||
    content.match(/<img[^>]+data-src=["']([^"']+)["']/i)

  return srcMatch?.[1] || ''
}

export default function GuideLatestStories({
  title,
  excerpt,
  content,
  uri,
  featuredImage,
  caption,
  priority = false,
}) {
  const imageUrl =
    featuredImage?.sourceUrl ||
    featuredImage?.mediaItemUrl ||
    getFirstImageFromContent(content) ||
    ''
  const text = stripDropcapTags(excerpt)
  const trimmed = text.slice(0, MAX_EXCERPT_LENGTH)
  const lastSpace = trimmed.lastIndexOf(' ')
  const finalExcerpt =
    lastSpace !== -1 ? trimmed.slice(0, lastSpace) + '...' : trimmed

  return (
    <article className={cx('component')}>
      <div className={cx('twoColumnLayout')}>
        {/* Kolom teks */}
        <div className={cx('textColumn')}>
          <Link href={uri} passHref>
            <h2 className={cx('title')}>{title}</h2>
          </Link>
          <div
            className={cx('excerpt')}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(finalExcerpt) }}
          />
          <div className={cx('buttonWrapper')}>
            <Link href={uri} passHref>
              <button className={cx('readMoreButton')}>Read More →</button>
            </Link>
          </div>
        </div>

        {/* Kolom gambar */}
        <div className={cx('imageColumn')}>
          <Link href={uri} passHref>
            <div className={cx('imageWrapper')}>
              {imageUrl ? (
                <Image
                  quality={100}
                  src={imageUrl}
                  alt={`${title} Featured Image`}
                  fill
                  className={cx('mainImage')}
                  priority={priority}
                />
              ) : (
                <div className={cx('imagePlaceholder')} aria-hidden="true" />
              )}
            </div>
          </Link>
          {caption && <div className={cx('caption')}>{caption}</div>}
        </div>
      </div>
    </article>
  )
}
