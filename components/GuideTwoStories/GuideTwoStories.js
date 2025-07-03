import classNames from 'classnames/bind'
import dynamic from 'next/dynamic'

const FeaturedImage = dynamic(() =>
  import('../../components/FeaturedImage/FeaturedImage'),
)
const Container = dynamic(() => import('../../components/Container/Container'))
import styles from './GuideTwoStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

let cx = classNames.bind(styles)

// Fungsi untuk bersihkan tag dropcap
function stripDropcapTags(content) {
  if (!content) return ''
  let cleaned = content.replace(/\[\/?dropcap\]/gi, '')
  cleaned = cleaned.replace(
    /<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi,
    '$1',
  )
  return cleaned
}

const MAX_EXCERPT_LENGTH = 150 // Adjust the maximum length as needed

export default function GuideTwoStories({
  title,
  excerpt,
  parentCategory,
  category,
  categoryUri,
  uri,
  featuredImage,
}) {
  // let trimmedExcerpt = excerpt?.substring(0, MAX_EXCERPT_LENGTH)
  let cleanedExcerpt = stripDropcapTags(excerpt)
  let trimmedExcerpt = cleanedExcerpt?.substring(0, MAX_EXCERPT_LENGTH)

  const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')

  if (lastSpaceIndex !== -1) {
    trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
  }

  return (
    <article className={cx('component')}>
      <div className={cx('container-wrapper')}>
        {featuredImage && (
          <div className={cx('content-wrapper-image')}>
            {title && uri && (
              <Link href={uri}>
                <Image
                  src={featuredImage?.sourceUrl}
                  alt={title + ' Featured Image'}
                  fill
                  sizes="100%"
                  priority
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
      </div>
      <div className={cx('border-bottom')}></div>
    </article>
  )
}
