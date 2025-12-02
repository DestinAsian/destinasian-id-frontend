'use client'

import React, { memo, Suspense } from 'react'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import classNames from 'classnames/bind'
import styles from './FrontPageVideos.module.scss'
import { GetVideoHomepage } from '../../queries/GetVideoHomepage'

const cx = classNames.bind(styles)

// Skeleton fallback
const Skeleton400 = () => <div style={{ minHeight: '400px' }} />
const Skeleton600 = () => <div style={{ minHeight: '600px' }} />

// Dynamic imports
const ContentWrapperVideo = dynamic(
  () => import('../ContentWrapperVideo/ContentWrapperVideo'),
  { ssr: false, loading: Skeleton400 }
)

const HalfPageHome2 = dynamic(
  () => import('../../components/AdUnit/HalfPage2/HalfPageHome2'),
  { ssr: false, loading: Skeleton600 }
)

function FrontPageVideos() {
  const { data, loading, error } = useQuery(GetVideoHomepage, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
    ssr: false,
  })

  // Ambil langsung tanpa useMemo → lebih ringan
  const video = data?.videos?.edges?.[0]?.node

  // Saat loading → jaga struktur layout
  if (loading) {
    return (
      <section className={cx('componentVideos')}>
        <h2 className={cx('titleVideos')}>Videos</h2>
        <div className={cx('newsUpdates')}>
          <div className={cx('twoColumns')}>
            <div className={cx('leftColumn')}>
              <Skeleton400 />
            </div>
            <aside className={cx('rightColumn')}>
              <Skeleton600 />
            </aside>
          </div>
        </div>
      </section>
    )
  }

  if (error || !video) return null

  return (
    <section className={cx('componentVideos')}>
      <h2 className={cx('titleVideos')}>Videos</h2>

      <div className={cx('newsUpdates')}>
        <div className={cx('twoColumns')}>

          {/* LEFT - VIDEO */}
          <div className={cx('leftColumn')}>
            <Suspense fallback={<Skeleton400 />}>
              <ContentWrapperVideo video={video} />
            </Suspense>
          </div>

          {/* RIGHT - AD */}
          <aside className={cx('rightColumn')}>
            <Suspense fallback={<Skeleton600 />}>
              <HalfPageHome2 />
            </Suspense>
          </aside>

        </div>
      </div>
    </section>
  )
}

export default memo(FrontPageVideos)
