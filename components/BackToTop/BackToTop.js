'use client'

import { useCallback } from 'react'
import classNames from 'classnames/bind'
import styles from './BackToTop.module.scss'

const cx = classNames.bind(styles)

export default function BackToTop() {
  const scrollToTop = useCallback(() => {
    const section = document.querySelector('[data-id="section1"]')

    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    } else {
      // fallback: scroll ke paling atas halaman
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <div className={cx('component')}>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <span className={cx('content')}>Back To Top</span>
      </button>
    </div>
  )
}
