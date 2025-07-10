// components/GuideSecondLatestStories/GuideTextBlock.js

import React from 'react'
import classNames from 'classnames/bind'
import styles from './GuideSecondLatestStories.module.scss'
import Link from 'next/link'

const cx = classNames.bind(styles)

function stripDropcapTags(content) {
  if (!content) return ''
  let cleaned = content.replace(/\[\/?dropcap\]/gi, '')
  cleaned = cleaned.replace(
    /<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi,
    '$1'
  )
  return cleaned
}

const MAX_EXCERPT_LENGTH = 150

export default function GuideTextBlock({ title, excerpt, uri }) {
  const cleanedExcerpt = stripDropcapTags(excerpt)
  let trimmedExcerpt = cleanedExcerpt?.substring(0, MAX_EXCERPT_LENGTH)
  const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')
  if (lastSpaceIndex !== -1) {
    trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
  }

  return (
    <div className={cx('textWrapper')}>
      {uri && (
        <Link href={uri}>
          <h2 className={cx('title')}>{title}</h2>
        </Link>
      )}
      <div
        className={cx('excerpt')}
        dangerouslySetInnerHTML={{ __html: trimmedExcerpt }}
      />
    </div>
  )
}
