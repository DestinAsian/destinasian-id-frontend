// components/PostTwoColumns/TextTwoColumns.js
import classNames from 'classnames/bind'
import styles from './PostTwoColumns.module.scss'
import Link from 'next/link'

const cx = classNames.bind(styles)

function stripDropcapTags(content) {
  if (!content) return ''
  let cleaned = content.replace(/\[\/?dropcap\]/gi, '')
  cleaned = cleaned.replace(
    /<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi,
    '$1',
  )
  return cleaned
}

const MAX_EXCERPT_LENGTH = 150

export default function TextTwoColumns({
  title,
  excerpt,
  parentCategory,
  category,
  categoryUri,
  uri,
}) {
  let cleanedExcerpt = stripDropcapTags(excerpt)
  let trimmedExcerpt = cleanedExcerpt?.substring(0, MAX_EXCERPT_LENGTH)
  const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')
  if (lastSpaceIndex !== -1) {
    trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
  }

  return (
    <div className={cx('content-wrapper')}>
      {parentCategory !== 'Rest of World' && category !== 'Rest of World' && categoryUri && (
        <Link href={categoryUri}>
          <h5 className={cx('category')}>{parentCategory} {category}</h5>
        </Link>
      )}
      {uri && (
        <Link href={uri}>
          <h2 className={cx('title')}>{title}</h2>
        </Link>
      )}
      {trimmedExcerpt && uri && (
        <Link href={uri}>
          <div
            className={cx('excerpt')}
            dangerouslySetInnerHTML={{ __html: trimmedExcerpt }}
          />
        </Link>
      )}
    </div>
  )
}