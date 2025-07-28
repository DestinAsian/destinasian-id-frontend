import { useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './MastHeadTopGuides.module.scss'
import { Ad } from 'react-ad-manager'

let cx = classNames.bind(styles)

export default function MastHeadTopGuides() {
  useEffect(() => {
  }, [])
  return (
    <div className={cx('desktop-banner')}>
      {/* MastHead Top Desktop */}
      <div className={cx('masthead-banner')}>
        <Ad
          adUnit="/6808792/REVAMP_DAI_MASTHEAD_TOP_GUIDE"
          name="iv-gpt-ad-1753693289886-0"
          size={[970, 250]}
        />
      </div>
    </div>
  )
}
