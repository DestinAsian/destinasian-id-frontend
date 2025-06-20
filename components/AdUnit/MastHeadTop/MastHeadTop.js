import { useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './MastHeadTop.module.scss'
import { Ad } from 'react-ad-manager'

let cx = classNames.bind(styles)

export default function MastHeadTop() {
  useEffect(() => {
    console.log('MastHeadTop dimount, mencoba memuat iklan...')
  }, [])
  return (
    <div className={cx('desktop-banner')}>
      {/* MastHead Top Desktop */}
      <div className={cx('masthead-banner')}>
        <p>test MastHeadTop 1</p>
        <Ad
          adUnit="/6808792/PREVIEW_DAI_MASTHEAD_TOP"
          name="div-gpt-ad-1750317865265-0"
          size={[970, 250]}
        />
      </div>
    </div>
  )
}
