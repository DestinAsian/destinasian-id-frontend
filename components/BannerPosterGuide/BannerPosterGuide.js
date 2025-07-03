import React from 'react'
import styles from './BannerPosterGuide.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const BannerPosterGuide = ({ guideReelIg, bannerDa }) => {
  if (!guideReelIg && !bannerDa) return null

  const {
    titleReelIg,
    contentReelIg,
    bannerReelIg2,
    linkUrlBannerReelIg2,
  } = guideReelIg || {}

  const { linkBannerFokusHubDa, bannerFokusHubDa } = bannerDa || {}

  return (
    <div className={cx('wrapper')}>
      <div className={cx('contentGrid')}>
        {/* Konten kiri: Reel IG */}
        <div className={cx('leftContent')}>
          {bannerReelIg2?.mediaItemUrl && (
            <div className={cx('leftBanner')}>
              <a
                href={linkUrlBannerReelIg2}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={bannerReelIg2.mediaItemUrl} alt="Banner Reel" />
              </a>
            </div>
          )}
        </div>

        {/* Konten kanan: Banner DA */}
        <div className={cx('rightBanner')}>
          {bannerFokusHubDa?.mediaItemUrl && linkBannerFokusHubDa && (
            <a
              href={linkBannerFokusHubDa}
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
    </div>
  )
}

export default BannerPosterGuide
