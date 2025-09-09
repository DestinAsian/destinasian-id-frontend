import classNames from 'classnames/bind'
import styles from './GuideLatestStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

const MAX_EXCERPT_LENGTH = 150

const stripDropcapTags = (content = '') =>
  content
    .replace(/\[\/?dropcap\]/gi, '')
    .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi, '$1')

export default function GuideLatestStories({
  title,
  excerpt,
  uri,
  featuredImage,
  caption,
}) {
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
            dangerouslySetInnerHTML={{ __html: finalExcerpt }}
          />
          <div className={cx('buttonWrapper')}>
            <Link href={uri} passHref>
              <button className={cx('readMoreButton')}>Read More →</button>
            </Link>
          </div>
        </div>

        {/* Kolom gambar */}
        {featuredImage && (
          <div className={cx('imageColumn')}>
            <Link href={uri} passHref>
              <div className={cx('imageWrapper')}>
                <Image
                  src={featuredImage.sourceUrl}
                  alt={`${title} Featured Image`}
                  fill
                  className={cx('mainImage')}
                  loading="lazy"
                />
              </div>
            </Link>
            {caption && <div className={cx('caption')}>{caption}</div>}
          </div>
        )}
      </div>
    </article>
  )
}
