import className from 'classnames/bind'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './SingleEntryHeader.module.scss'
import Heading from '../../components/Heading/Heading'
import FormatDate from '../../components/FormatDate/FormatDate'
const MastHeadTop = dynamic(
  () => import('../../components/AdUnit/MastHeadTop/MastHeadTop'),
  { ssr: false }
)
const MastHeadTopMobile = dynamic(
  () => import('../../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'),
  { ssr: false }
)

let cx = className.bind(styles)

export default function SingleEntryHeader({
  parent,
  title,
  parentCategory,
  categoryUri,
  categoryName,
  author,
  date,
}) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Maximized EntryHeader when page load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMaximized(true)
    }, 2000) // Change the timeframe (in milliseconds) as per your requirement

    return () => clearTimeout(timeout)
  }, [])

    // Detect mobile or desktop on resize
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768)
      }
  
      checkMobile() // initial check
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

  return (
    <div className={cx('component', { maximized: isMaximized })}>
       {isMobile ? <MastHeadTopMobile /> : <MastHeadTop />}
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
            {'By '}
            {author}{' '}
          </span>{' '}
          &nbsp; | &nbsp;
          <FormatDate date={date} />
        </time>
      </div>
    </div>
  )
}
