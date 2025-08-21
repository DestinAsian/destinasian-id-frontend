import React from 'react'
import styles from './Tagline.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const Tagline = ({ tagline }) => {
  // Exit early kalau tidak ada tagline
  if (!tagline || !tagline.tagline) {
    return null
  }

  return (
    <div className={styles.taglineWrap}>
      <div
        className={cx('contentWrapper')}
        dangerouslySetInnerHTML={{ __html: tagline.tagline }}
      />
    </div>
  )
}

export default Tagline
