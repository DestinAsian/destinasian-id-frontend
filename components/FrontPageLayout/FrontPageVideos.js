'use client'
import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageVideos.module.scss'
import dynamic from 'next/dynamic'
import { GetVideos } from '../../queries/GetVideos'
import Outnow from '../Outnow/Outnow'

const ContentWrapperVideo = dynamic(
  () => import('../ContentWrapperVideo/ContentWrapperVideo'),
  { ssr: false },
)
const HalfPage2 = dynamic(() =>
  import('../../components/AdUnit/HalfPage2/HalfPage2'),
)

const cx = classNames.bind(styles)

export default function FrontPageVideos() {
  const { data, loading, error } = useQuery(GetVideos, {
    variables: { first: 2 },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
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
            <HalfPage2 />

            {/* <aside className={cx('outnowWrapper')}>
              <div className={cx('outnowVideos')}>
                <Outnow />
                <HalfPage2 />
              </div>
            </aside> */}
          </div>
        </div>
      </div>
    </section>
  )
}
