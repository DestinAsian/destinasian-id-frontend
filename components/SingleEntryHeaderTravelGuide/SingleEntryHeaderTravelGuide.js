import className from 'classnames/bind'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import Heading from '../../components/Heading/Heading'
import FormatDate from '../../components/FormatDate/FormatDate'
import Container from '../../components/Container/Container'
import styles from './SingleEntryHeaderTravelGuide.module.scss'

let cx = className.bind(styles)

export default function SingleEntryHeaderTravelGuide({
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
            {/* {title} */}
          </Heading>
          <time className={cx('meta-wrapper')} dateTime={date}>
            <span className={cx('meta-author')}>
              {'By '}
              {author}{' '}
            </span>{' '}
            &nbsp; | &nbsp;
            <FormatDate date={date} />
          </time>
        </div>
      </Container>
    </div>
  )
}
