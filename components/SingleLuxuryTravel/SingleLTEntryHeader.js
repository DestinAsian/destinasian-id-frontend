import className from 'classnames/bind'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Heading = dynamic(() => import('../../components/Heading/Heading'))
const Container = dynamic(() => import('../../components/Container/Container'))
import FormatDate from '../../components/FormatDate/FormatDate'
import styles from './SingleLTEntryHeader.module.scss'

let cx = className.bind(styles)

export default function SingleLTEntryHeader({ title, className, date,   author, }) {
  const [isMaximized, setIsMaximized] = useState(false)

  // Maximized EntryHeader when page load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMaximized(true)
    }, 2000) // Change the timeframe (in milliseconds) as per your requirement

    return () => clearTimeout(timeout)
  }, [])
  return (
    <div className={cx(['component', className])}>
      <Container>
        <div className={cx('header-wrapper')}>
          <Heading className={cx('title')}>
            {title}
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
