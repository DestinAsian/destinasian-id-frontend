import className from 'classnames/bind'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

import Heading from '../../components/Heading/Heading'
import Container from '../../components/Container/Container'
import FormatDate from '../../components/FormatDate/FormatDate'
import styles from './SingleContestEntryHeader.module.scss'

let cx = className.bind(styles)

export default function SingleContestEntryHeader({
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
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={cx('component', { maximized: isMaximized })}>
      <Container>
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
            <span className={cx('meta-author')}>
              {author ? `By ${author}` : 'By Destinasian Indonesia'}
            </span>
            &nbsp; | &nbsp;
            <FormatDate date={date} />
          </time>
        </div>
      </Container>
    </div>
  )
}
