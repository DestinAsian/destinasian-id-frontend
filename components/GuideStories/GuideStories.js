'use client'

import React from 'react'
import styles from './GuideStories.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const GuideStories = ({ guideStories }) => {
  if (!guideStories) return null

  const {
    titleGuideStories,
    contentGuideStories,
    bannerGuideStories,
    imageGuideStories,
    captionImagesGuideStories,
    linkBookHereGuideStories,
  } = guideStories

  return (
    <div className={cx('guideStoriesWrap')}>
      <div className={cx('contentGrid')}>
        {/* Left Section (main image + text) */}
        <div className={cx('leftContent')}>
          {imageGuideStories?.mediaItemUrl && (
            <div className={cx('imageWrapper')}>
              <a
                href={linkBookHereGuideStories || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={imageGuideStories.mediaItemUrl}
                  alt="Guide Main"
                  className={cx('mainImage')}
                  loading="lazy"
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
                  <a
                    href={linkBookHereGuideStories}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Here
                  </a>
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

        {/* Right Banner */}
        {bannerGuideStories?.mediaItemUrl && (
          <div className={cx('rightBanner')}>
            <img
              src={bannerGuideStories.mediaItemUrl}
              alt="Banner Guide"
              className={cx('bannerImage')}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideStories
