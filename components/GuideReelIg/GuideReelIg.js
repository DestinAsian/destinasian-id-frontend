import React from 'react'
import styles from './GuideReelIg.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)
const GuideReelIg = ({ guideReelIg }) => {
  if (!guideReelIg) return null

  const {
    titleReelIg,
    contentReelIg,
    videoReelIg1,
    imagesGuideReelIg1,
    linkUrlReelIg1,
    bannerReelIg2,
    linkUrlBannerReelIg2,
    imagesGuideReelIg2,
    linkUrlReelIg2,
  } = guideReelIg

  return (
    <div className={styles.guideReelIgWrap}>
      {titleReelIg && (
      <div
        className={cx('titleWrapper')}
        dangerouslySetInnerHTML={{ __html: titleReelIg }}
      />
    )}

    {contentReelIg && (
      <div
        className={cx('contentWrapper')}
        dangerouslySetInnerHTML={{ __html: contentReelIg }}
      />
    )}

      {/* Bagian Atas */}
      <div className={styles.topSection}>
        <div className={styles.leftImage}>
          {imagesGuideReelIg1?.mediaItemUrl && (
            <a href={linkUrlReelIg1}>
              <img
                src={imagesGuideReelIg1.mediaItemUrl}
                alt="Guide Reel Left"
              />
            </a>
          )}
        </div>
        <div className={styles.rightVideo}>
          {videoReelIg1 && (
            <div
              className={styles.videoContent}
              dangerouslySetInnerHTML={{ __html: videoReelIg1 }}
            />
          )}
        </div>
      </div>

      {/* Bagian Bawah */}
      <div className={styles.bottomSection}>
        <div className={styles.leftBanner}>
          {bannerReelIg2?.mediaItemUrl && (
            <a href={linkUrlBannerReelIg2}>
              <img src={bannerReelIg2.mediaItemUrl} alt="Banner Reel" />
            </a>
          )}
        </div>
        <div className={styles.rightImage}>
          {imagesGuideReelIg2?.mediaItemUrl && (
            <a href={linkUrlReelIg2}>
              <img src={imagesGuideReelIg2.mediaItemUrl} alt="Image Reel" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuideReelIg
