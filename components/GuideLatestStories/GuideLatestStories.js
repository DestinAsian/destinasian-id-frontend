import classNames from 'classnames/bind'
import dynamic from 'next/dynamic'
import styles from './GuideLatestStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const Container = dynamic(() => import('../../components/Container/Container'))

const cx = classNames.bind(styles)

// Fungsi untuk hapus tag dropcap
function stripDropcapTags(content) {
  if (!content) return ''
  let cleaned = content.replace(/\[\/?dropcap\]/gi, '')
  cleaned = cleaned.replace(/<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi, '$1')
  return cleaned
}

const MAX_EXCERPT_LENGTH = 150

export default function GuideLatestStories({
  title,
  excerpt,
  parentCategory,
  category,
  categoryUri,
  uri,
  featuredImage,
  caption,
}) {
  const cleanedExcerpt = stripDropcapTags(excerpt)
  let trimmedExcerpt = cleanedExcerpt?.substring(0, MAX_EXCERPT_LENGTH)
  const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')
  if (lastSpaceIndex !== -1) {
    trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
  }

  return (
    <article className={cx('component')}>
      <div className={cx('twoColumnLayout')}>
        {/* Konten kiri */}
        <div className={cx('textColumn')}>
          {uri && (
            <Link href={uri}>
              <h2 className={cx('title')}>{title}</h2>
            </Link>
          )}
          <div className={cx('excerpt')} dangerouslySetInnerHTML={{ __html: trimmedExcerpt }} />
          <div className={cx('buttonWrapper')}>
            <Link href={uri}>
              <button className={cx('readMoreButton')}>Baca Selanjutnya</button>
            </Link>
          </div>
        </div>

        {/* Gambar kanan */}
        <div className={cx('imageColumn')}>
          {featuredImage && (
            <Link href={uri}>
              <Image
                src={featuredImage?.sourceUrl}
                alt={title + ' Featured Image'}
                width={600}
                height={400}
                className={cx('mainImage')}
              />
            </Link>
          )}
          {caption && <div className={cx('caption')}>{caption}</div>}
        </div>
      </div>
    </article>
  )
}
