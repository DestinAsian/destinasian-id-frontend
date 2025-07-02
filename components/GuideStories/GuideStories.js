import React from 'react'
import styles from './GuideStories.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const GuideStories = ({ guideStories }) => {
  console.log('GuideStories data:', guideStories)
  if (!guideStories) return null

  const {
    titleGuideStories,
    contentGuideStories,
    bannerGuideStories,
    imageGuideStories,
    iconGuideStories,
    captionImagesGuideStories,
    linkBookHereGuideStories,
  } = guideStories

  return (
    <div className={cx('guideStoriesWrap')}>
      <div className={cx('contentGrid')}>
        {/* Left Column (70%) */}
        <div className={cx('leftContent')}>
          {imageGuideStories?.mediaItemUrl && (
            <div className={cx('imageWrapper')}>
              <a href={linkBookHereGuideStories || '#'}>
                <img
                  src={imageGuideStories.mediaItemUrl}
                  alt="Guide Main"
                  className={cx('mainImage')}
                />
              </a>
            </div>
          )}

          <div className={cx('textWrapper')}>
            <div className={cx('captionRow')}>
              {captionImagesGuideStories && (
                <div className={cx('captionText')}>
                  {captionImagesGuideStories}
                </div>
              )}
              {captionImagesGuideStories && linkBookHereGuideStories && (
                <span className={cx('separator')}>|</span>
              )}
              {linkBookHereGuideStories && (
                <span className={cx('bookHere')}>
                  <a href={linkBookHereGuideStories}>Book Here</a>
                </span>
              )}
            </div>

            {titleGuideStories && (
              <div
                className={cx('titleWrapper')}
                dangerouslySetInnerHTML={{ __html: titleGuideStories }}
              />
            )}

            {contentGuideStories && (
              <div
                className={cx('contentWrapper')}
                dangerouslySetInnerHTML={{ __html: contentGuideStories }}
              />
            )}
          </div>
        </div>

        {/* Right Banner (30%) */}
        {bannerGuideStories?.mediaItemUrl && (
          <div className={cx('rightBanner')}>
            <img
              src={bannerGuideStories.mediaItemUrl}
              alt="Banner Guide"
              className={cx('bannerImage')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideStories
