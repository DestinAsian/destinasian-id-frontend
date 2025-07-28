import classNames from 'classnames/bind'
import styles from './HalfPageHome1.module.scss'
import { Ad } from 'react-ad-manager'

let cx = classNames.bind(styles)

export default function HalfPageHome1() {
  return (
    <div className={cx('halfpage-wrapper')}>
      <div className={cx('halfpage-banner')}>
        {/* HalfPage Banner */}
        <Ad
          adUnit="/6808792/REVAMP_DAI_HALF_PAGE_1_HOME_PAGE"
          name="div-gpt-ad-1753692661686-0"
          size={[300, 600]}
        />
      </div>
    </div>
  )
}
