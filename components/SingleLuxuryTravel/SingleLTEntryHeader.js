import classNames from 'classnames/bind'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import Heading from '../../components/Heading/Heading'
import Container from '../../components/Container/Container'
import FormatDate from '../../components/FormatDate/FormatDate'

import styles from './SingleLTEntryHeader.module.scss'

const cx = classNames.bind(styles)

export default function SingleLTEntryHeader({
  title,
  className,
  date,
  author,
  parent,
  parentCategory,
  categoryUri,
  categoryName,
}) {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMaximized(true), 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={cx('component', className, { maximized: isMaximized })}>
      <Container>
        <div className={cx('header-wrapper')}>

          {/* === CATEGORY / BREADCRUMB LIKE TRAVEL GUIDE === */}
          {categoryUri &&
            parentCategory !== 'Rest of World' &&
            categoryName !== 'Rest of World' && (
              <Link href={categoryUri}>
                <div className={cx('category-name')}>
                  {parentCategory} {categoryName}
                </div>
              </Link>
            )}

          {/* === TITLE === */}
          <Heading className={cx('title')}>
            {parent ? `${parent} ` : ''}
            {title}
          </Heading>

          {/* === META: AUTHOR + DATE === */}
          <time className={cx('meta-wrapper')} dateTime={date}>
            <span className={cx('meta-author')}>
              By {author}
            </span>
            &nbsp; | &nbsp;
            <FormatDate date={date} />
          </time>
        </div>
      </Container>
    </div>
  )
}
