import React from 'react'
import styles from './BannerFokusDA.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const BannerFokusDA = ({ bannerDa }) => {
  if (!bannerDa) return null

  const { linkBannerFokusHubDa, bannerFokusHubDa } = bannerDa

  return (
    <div className={cx('bannerDaWrap')}>
      <div className={cx('contentGrid')}>
        {bannerFokusHubDa?.mediaItemUrl && linkBannerFokusHubDa && (
          <a
            href={linkBannerFokusHubDa}
            className={cx('rightBanner')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={bannerFokusHubDa.mediaItemUrl}
              alt="Banner Fokus"
              className={cx('bannerImage')}
            />
          </a>
        )}
      </div>
    </div>
  )
}

export default BannerFokusDA
