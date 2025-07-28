'use client'

import { useQuery } from '@apollo/client'
import React, { useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './ContentWrapperVideo.module.scss'
import { GetVideos } from '../../queries/GetVideos'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import Link from 'next/link'

const cx = classNames.bind(styles)

export default function ContentWrapperVideo() {
  const { data, loading, error } = useQuery(GetVideos, {
    variables: { first: 1 },
    fetchPolicy: 'network-only',
  })

  const videoNode = useMemo(() => data?.videos?.edges?.[0]?.node, [data])

  if (loading) return <p className={cx('loadingMessage')}>Loading video...</p>
  if (error) return <p>Error loading video: {error.message}</p>
  if (!videoNode) return null

  const isYouTube = videoNode.content.includes('youtube')
  const youtubeId = videoNode.content.match(/\/embed\/([^?"]+)/)?.[1] || ''
  const localVideoSrc =
    videoNode.content.match(/<source[^>]*src="([^"]+)"/)?.[1] || ''

  const { videoLink, customText, customLink } = videoNode.videosAcf || {}
  const featuredImg = videoNode.featuredImage?.node?.sourceUrl || ''

  return (
    <div className={cx('component')}>
      <div className={cx('first-video-wrapper')}>
        <div className={cx('first-iframe-wrapper')}>
          {isYouTube ? (
            <LiteYouTubeEmbed
              id={youtubeId}
              title={videoNode.title}
              muted
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
            />
          )}
        </div>

        <div className={cx('first-video-text-wrapper')}>
          <div className={cx('first-title-wrapper')}>
            {videoLink ? (
              <Link href={videoLink} className={cx('title')}>
                {videoNode.title}
              </Link>
            ) : (
              <h2 className={cx('title')}>{videoNode.title}</h2>
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
}
