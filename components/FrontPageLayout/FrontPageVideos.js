'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageVideos.module.scss'
import dynamic from 'next/dynamic'
import { GetVideos } from '../../queries/GetVideos'

// Import dinamis (lazy-load) untuk komponen berat
const ContentWrapperVideo = dynamic(() => import('../ContentWrapperVideo/ContentWrapperVideo'), { ssr: false })
const HalfPageHome2= dynamic(() => import('../../components/AdUnit/HalfPage2/HalfPageHome2'), { ssr: false })

const cx = classNames.bind(styles)

export default function FrontPageVideos() {
  const { data, loading, error } = useQuery(GetVideos, {
    variables: { first: 1 },
    fetchPolicy: 'cache-first',
  })

  const videos = data?.videos?.edges || []

  if (loading || error || videos.length === 0) return null

  return (
    <section className={cx('componentVideos')}>
      <h2 className={cx('titleVideos')}>Videos</h2>

      <div className={cx('newsUpdates')}>
        <div className={cx('twoColumns')}>
          <div className={cx('leftColumn')}>
            <div className={cx('videoWrapper')}>
              <ContentWrapperVideo data={videos} />
            </div>
          </div>
          
          <div className={cx('rightColumn')}>
            <HalfPageHome2 />
          </div>
        </div>
      </div>
    </section>
  )
}
