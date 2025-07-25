import classNames from 'classnames/bind'
import styles from './HalfPageGuides1.module.scss'
import { Ad } from 'react-ad-manager'

let cx = classNames.bind(styles)

export default function HalfPageGuides1() {
  return (
    <div className={cx('halfpage-wrapper')}>
      <div className={cx('halfpage-banner')}>
        {/* HalfPage Banner */}
        <Ad
          adUnit="/6808792/PREVIEW_DAI_HALFPAGE_GUIDES_01"
          name="div-gpt-ad-1753253120639-0"
          size={[300, 600]}
        />
      </div>
    </div>
  )
}
