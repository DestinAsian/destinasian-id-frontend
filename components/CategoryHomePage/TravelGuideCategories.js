'use client'

import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'

import styles from './TravelGuidesCategories.module.scss'
import logohilton from '../../assets/logo/logo_hilton.png'

const cx = classNames.bind(styles)

const ORDER = ['bali', 'jakarta', 'bandung', 'surabaya']
const normalize = (str = '') => str.toLowerCase().trim()

// Tambahkan slug kategori yang Coming Soon di sini
const COMING_SOON = new Set([])

export default function TravelGuideCategories({ data }) {
  const { data: swrData } = useSWR(
    'travel-guides-categories',
    null,
    {
      fallbackData: data,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const categories =
    swrData?.category?.children?.edges?.map((e) => e.node) ?? []

  if (!categories.length) return null

  // Convert menjadi map sekali saja → lebih efisien
  const mapByName = Object.fromEntries(
    categories.map((c) => [normalize(c.name), c])
  )

  // Urutkan kategori sesuai ORDER
  const ordered = ORDER.map((key) => mapByName[key]).filter(Boolean)

  return (
    <div className={cx('wrapper')}>
      {/* HEADER */}
      <div className={cx('titleWrapper')}>
        <h2 className={cx('title')}>Guides</h2>

        <Image
          src={logohilton}
          alt="Hilton Logo"
          width={120}
          height={120}
          className={cx('logo')}
          priority
          draggable={false}
        />
      </div>

      {/* GRID */}
      <div className={cx('grid')}>
        {ordered.map((cat) => {
          const { id, name, uri, categoryImages } = cat
          const imageUrl = categoryImages?.categorySlide1?.mediaItemUrl
          const slug = normalize(name)
          const comingSoon = COMING_SOON.has(slug)

          const content = (
            <div
              className={cx('card', { comingSoon })}
              draggable={false}
            >
              <div className={cx('imageWrapper')}>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={800}
                    height={600}
                    className={cx('image')}
                    loading="lazy"
                    draggable={false}
                  />
                )}

                <div className={cx('textWrapper')}>
                  <h3 className={cx('nameOverlay')}>{name}</h3>
                  {comingSoon && (
                    <p className={cx('comingsoon')}>(Coming Soon)</p>
                  )}
                </div>
              </div>
            </div>
          )

          return comingSoon ? (
            <div key={id}>{content}</div>
          ) : (
            <Link key={id} href={uri} draggable={false}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
