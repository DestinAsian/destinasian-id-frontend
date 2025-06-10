import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './VideoFrontPage.module.scss'

import dynamic from 'next/dynamic'
const ContentWrapperVideo = dynamic(() =>
  import('../../components/ContentWrapperVideo/ContentWrapperVideo'),
)
const Outnow = dynamic(() => import('../../components/Outnow/Outnow'))

import { GetVideos } from '../../queries/GetVideos'

export default function VideoFrontPage() {
  const cx = classNames.bind(styles)
  const {
    data: videosData,
    loading: videosLoading,
    error: videosError,
  } = useQuery(GetVideos, {
    variables: { first: 10 },
  })
  const videos = videosData?.videos?.edges || []

  return (
    <>
      <h2 className={cx('title-videos')}>Videos</h2>
      <div className={cx('wrapper-videos')}></div>
      <div className={cx('component-videos')}>
        <div className={cx('two-columns')}>
          <div className={cx('left-column')}>
            {!videosLoading && !videosError && videos.length > 0 && (
              <div className={cx('category-updates-component')}>
                <ContentWrapperVideo data={videos} />
              </div>
            )}
          </div>
          <div className={cx('right-column')}>
            <aside className={cx('outnow-wrapper')}>
              <div className={cx('outnow-videos')}>
                <Outnow />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
