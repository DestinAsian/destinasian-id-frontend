'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageVideos.module.scss'
import { GetVideoHomepage } from '../../queries/GetVideoHomepage'

import ContentWrapperVideo from '../ContentWrapperVideo/ContentWrapperVideo'
import HalfPageHome2 from '../../components/AdUnit/HalfPage2/HalfPageHome2'

const cx = classNames.bind(styles)

export default function FrontPageVideos() {
  const { data, loading, error } = useQuery(GetVideoHomepage, {
    fetchPolicy: 'cache-first',
  })

  const video = data?.videos?.edges?.[0]?.node

  if (loading || error || !video) return null

  return (
    <section className={cx('componentVideos')}>
      <h2 className={cx('titleVideos')}>Videos</h2>

      <div className={cx('newsUpdates')}>
        <div className={cx('twoColumns')}>
          <div className={cx('leftColumn')}>
            <div className={cx('videoWrapper')}>
              <ContentWrapperVideo video={video} />
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
