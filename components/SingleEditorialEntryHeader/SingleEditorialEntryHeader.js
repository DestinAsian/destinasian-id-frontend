import className from 'classnames/bind'
import { Heading, FormatDate } from '../../components'
import styles from './SingleEditorialEntryHeader.module.scss'
import { useState, useEffect } from 'react'
import Link from 'next/link'

let cx = className.bind(styles)

export default function SingleEditorialEntryHeader({
  parent,
  title,
  parentCategory,
  categoryUri,
  categoryName,
  author,
  date,
}) {
  const [isMaximized, setIsMaximized] = useState(false)

  // Maximized EntryHeader when page load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMaximized(true)
    }, 2000) // Change the timeframe (in milliseconds) as per your requirement

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={cx('component', { maximized: isMaximized })}>
      <div className={cx('header-wrapper')}>
        {parentCategory !== 'Rest of World' &&
          categoryName !== 'Rest of World' && 
          categoryUri && (
            <Link href={categoryUri}>
              <div className={cx('category-name')}>
                {parentCategory} {categoryName}
              </div>
            </Link>
          )}
        <Heading className={cx('title')}>
          {parent || null} {title}
        </Heading>
        <time className={cx('meta-wrapper')} dateTime={date}>
          {'By '} {author} {'-'} <FormatDate date={date} />
        </time>
      </div>
    </div>
  )
}
