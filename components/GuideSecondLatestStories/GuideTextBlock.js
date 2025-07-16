import React from 'react'
import classNames from 'classnames/bind'
import styles from './GuideSecondLatestStories.module.scss'
import Link from 'next/link'

const cx = classNames.bind(styles)
const MAX_LENGTH = 150

const stripDropcapTags = (text) =>
  text
    ?.replace(/\[\/?dropcap\]/gi, '')
    .replace(/<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi, '$1') || ''

const trimExcerpt = (text, maxLength) => {
  const trimmed = text.slice(0, maxLength)
  const lastSpace = trimmed.lastIndexOf(' ')
  return lastSpace !== -1 ? trimmed.slice(0, lastSpace) + '...' : trimmed
}

export default function GuideTextBlock({ title, excerpt, uri }) {
  const cleanedExcerpt = trimExcerpt(stripDropcapTags(excerpt), MAX_LENGTH)

  return (
    <div className={cx('textWrapper')}>
      {uri && (
        <Link href={uri}>
          <h2 className={cx('title')}>{title}</h2>
        </Link>
      )}
      <div
        className={cx('excerpt')}
        dangerouslySetInnerHTML={{ __html: cleanedExcerpt }}
      />
    </div>
  )
}
