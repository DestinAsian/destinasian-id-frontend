import React from 'react'
import styles from './GuideReelIg.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const GuideReelIg = ({ guideReelIg }) => {
  // Exit early if no data to prevent unnecessary render
  if (!guideReelIg) return null

  const {
    titleReelIg,
    contentReelIg,
    videoReelIg1,
    reelGuideIg1,
    bannerReelIg2,
    linkUrlBannerReelIg2,
    reelGuideIg2,
  } = guideReelIg

  return (
    <div className={styles.guideReelIgWrap}>
      {/* Render title if exists */}
      {titleReelIg && (
        <div
          className={cx('titleWrapper')}
          dangerouslySetInnerHTML={{ __html: titleReelIg }}
        />
      )}

      {/* Render content if exists */}
      {contentReelIg && (
        <div
          className={cx('contentWrapper')}
          dangerouslySetInnerHTML={{ __html: contentReelIg }}
        />
      )}

      {/* TOP SECTION: Left Reel + Right Video */}
      <div className={styles.topSection}>
        {reelGuideIg1 && (
          <div
            className={cx('leftReel', 'reelContent')}
            dangerouslySetInnerHTML={{ __html: reelGuideIg1 }}
          />
        )}
        {videoReelIg1 && (
          <div
            className={cx('rightVideo', 'videoContent')}
            dangerouslySetInnerHTML={{ __html: videoReelIg1 }}
          />
        )}
      </div>

      {/* BOTTOM SECTION: Left Banner + Right Reel */}
      <div className={styles.bottomSection}>
        {bannerReelIg2?.mediaItemUrl && (
          <div className={styles.leftBanner}>
            <a href={linkUrlBannerReelIg2} target="_blank" rel="noopener noreferrer">
              <img src={bannerReelIg2.mediaItemUrl} alt="Banner Reel" loading="lazy" />
              {/* Note: Added `loading="lazy"` for image performance */}
            </a>
          </div>
        )}
        {reelGuideIg2 && (
          <div
            className={cx('rightReel', 'reelContent')}
            dangerouslySetInnerHTML={{ __html: reelGuideIg2 }}
          />
        )}
      </div>
    </div>
  )
}

export default GuideReelIg
