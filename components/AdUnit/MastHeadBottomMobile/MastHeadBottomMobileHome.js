import classNames from 'classnames/bind'
import styles from './MastHeadBottomMobileHome.module.scss'
import { Ad } from 'react-ad-manager'

let cx = classNames.bind(styles)

export default function MastHeadBottomMobileHome() {
  return (
    <div className={cx('mobile-banner')}>
      {/* Masthead Top Mobile */}
      <div className={cx('masthead-banner')}>
        <Ad
          adUnit="/6808792/REVAMP_DAI_MASTHEAD_BOTTOM_MOBILE_HOME_PAGE"
          name="div-gpt-ad-1753693137549-0"
          size={[
            [320, 330],
            [300, 250],
          ]}
        />
      </div>
    </div>
  )
}
