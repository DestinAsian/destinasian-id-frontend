import { useCallback } from 'react'
import className from 'classnames/bind'
import styles from './BackToTop.module.scss'

let cx = className.bind(styles)

export default function BackToTop({ onClickSection, onClickContent }) {
  // scroll to section button
  const scrollToSection1 = useCallback(() => {
    const section = document.querySelector('[data-id="section1"]')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className={cx('component')}>
      {scrollToSection1 && (
        <button
          onClick={scrollToSection1}
          aria-label="Scroll to the top"
        >
          <span className={cx('content')}>{'Back To Top'}</span>
        </button>
      )}
    </div>
  )
}
