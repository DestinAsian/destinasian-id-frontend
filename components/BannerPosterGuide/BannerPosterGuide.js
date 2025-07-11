import React from 'react'
import styles from './BannerPosterGuide.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const BannerPosterGuide = ({ guideStorie }) => {
  if (!guideStorie) return null

  const {
    bannerLandscape,
    linkBannerLandscape,
    bannerGuideStories,
    linkBannerGuideStories,
  } = guideStorie

  return (
    <div className={cx('wrapper')}>
      <div className={cx('contentGrid')}>
        {/* Konten kiri: Banner Landscape */}
        <div className={cx('leftContent')}>
          {bannerLandscape?.mediaItemUrl && (
            <div className={cx('leftBanner')}>
              <a
                href={linkBannerLandscape}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={bannerLandscape.mediaItemUrl}
                  alt="Banner Landscape"
                />
              </a>
            </div>
          )}
        </div>

        {/* Konten kanan: Banner Guide Stories */}
        <div className={cx('rightBanner')}>
          {bannerGuideStories?.mediaItemUrl && linkBannerGuideStories && (
            <a
              href={linkBannerGuideStories}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={bannerGuideStories.mediaItemUrl}
                alt="Banner Guide Stories"
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
