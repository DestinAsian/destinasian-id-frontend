import React from 'react'
import classNames from 'classnames/bind'
import styles from './Tagline.module.scss'

const cx = classNames.bind(styles)

const Tagline = ({ tagline }) => {
  // Return null if no tagline is provided
  if (!tagline?.tagline) return null

  return (
    <div className={cx('taglineWrap')}>
      <div
        className={cx('contentWrapper')}
        dangerouslySetInnerHTML={{ __html: tagline.tagline }} // render HTML content safely
      />
    </div>
  )
}

export default Tagline
