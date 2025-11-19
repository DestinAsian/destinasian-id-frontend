'use client'

import React, { memo, Suspense } from 'react'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import classNames from 'classnames/bind'
import styles from './FrontPageVideos.module.scss'
import { GetVideoHomepage } from '../../queries/GetVideoHomepage'

// ✅ Lazy-load komponen berat (iklan & video wrapper)
const ContentWrapperVideo = dynamic(
  () => import('../ContentWrapperVideo/ContentWrapperVideo'),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: '400px' }} />,
  },
)
const HalfPageHome2 = dynamic(
  () => import('../../components/AdUnit/HalfPage2/HalfPageHome2'),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: '600px' }} />,
  },
)

const cx = classNames.bind(styles)

function FrontPageVideos() {
  const { data, loading, error } = useQuery(GetVideoHomepage, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  if (loading || error) return null

  const video = data?.videos?.edges?.[0]?.node
  if (!video) return null

  return (
    <section className={cx('componentVideos')}>
      <h2 className={cx('titleVideos')}>Videos</h2>

      <div className={cx('newsUpdates')}>
        <div className={cx('twoColumns')}>
          {/* === VIDEO LEFT === */}
          <div className={cx('leftColumn')}>
            <div className={cx('videoWrapper')}>
              <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
                <ContentWrapperVideo video={video} />
              </Suspense>
            </div>
          </div>

          {/* === AD RIGHT === */}
          <aside className={cx('rightColumn')}>
            <div className={cx('outnowWrapper')}>
              <Suspense fallback={<div style={{ minHeight: '600px' }} />}>
                <HalfPageHome2 />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default memo(FrontPageVideos)
