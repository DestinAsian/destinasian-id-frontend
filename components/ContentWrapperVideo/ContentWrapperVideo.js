'use client'

import React from 'react'
import classNames from 'classnames/bind'
import styles from './ContentWrapperVideo.module.scss'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import Link from 'next/link'

const cx = classNames.bind(styles)

const ContentWrapperVideo = React.memo(({ video }) => {
  if (!video) return null

  // Detect YouTube video
  const isYouTube = video.content.includes('youtube')
  const youtubeId = video.content.match(/\/embed\/([^?"]+)/)?.[1] || ''
  const localVideoSrc = video.content.match(/<source[^>]*src="([^"]+)"/)?.[1] || ''

  const { videoLink, customText, customLink } = video.videosAcf || {}
  const featuredImg = video.featuredImage?.node?.sourceUrl || ''

  return (
    <div className={cx('component')}>
      <div className={cx('first-video-wrapper')}>
        <div className={cx('first-iframe-wrapper')}>
          {isYouTube && youtubeId ? (
            <LiteYouTubeEmbed
              id={youtubeId}
              title={video.title}
              poster="maxresdefault"
              webp
            />
          ) : (
            <video
              src={localVideoSrc}
              className={cx('video-content')}
              loop
              autoPlay
              muted
              poster={featuredImg}
              playsInline
            />
          )}
        </div>

        <div className={cx('first-video-text-wrapper')}>
          <div className={cx('first-title-wrapper')}>
            {videoLink ? (
              <Link href={videoLink} className={cx('title')}>
                {video.title}
              </Link>
            ) : (
              <h2 className={cx('title')}>{video.title}</h2>
            )}
          </div>

          {customText && (
            <div className={cx('first-custom-text-wrapper')}>
              {customLink ? (
                <Link href={customLink} className={cx('first-custom-text')}>
                  {customText}
                </Link>
              ) : (
                <p className={cx('first-custom-text')}>{customText}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default ContentWrapperVideo
