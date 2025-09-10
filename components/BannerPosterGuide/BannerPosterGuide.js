import React from 'react'
import classNames from 'classnames/bind'
import styles from './BannerPosterGuide.module.scss'

const cx = classNames.bind(styles)

const BannerPosterGuide = ({ guideStorie }) => {
  if (!guideStorie) return null

  const {
    bannerLandscape,
    linkBannerLandscape,
    bannerGuideStories,
    linkBannerGuideStories,
  } = guideStorie

  // Return null if all banners are missing
  const isAllEmpty =
    !bannerLandscape?.mediaItemUrl &&
    !bannerGuideStories?.mediaItemUrl

  if (isAllEmpty) return null

  return (
    <div className={cx('wrapper')}>
      <div className={cx('contentGrid')}>
        {/* Left Banner: Landscape */}
        {bannerLandscape?.mediaItemUrl && (
          <div className={cx('leftContent')}>
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

        {/* Right Banner: Guide Stories */}
        {bannerGuideStories?.mediaItemUrl && linkBannerGuideStories && (
          <div className={cx('rightBanner')}>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default BannerPosterGuide
