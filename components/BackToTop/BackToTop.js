import { useCallback } from 'react'
import classNames from 'classnames/bind'
import styles from './BackToTop.module.scss'

const cx = classNames.bind(styles)

export default function BackToTop() {
  // Scroll smoothly to the top section
  const scrollToSection1 = useCallback(() => {
    const section = document.querySelector('[data-id="section1"]')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className={cx('component')}>
      <button
        onClick={scrollToSection1}
        aria-label="Scroll to the top"
        type="button"
      >
        <span className={cx('content')}>Back To Top</span>
      </button>
    </div>
  )
}
