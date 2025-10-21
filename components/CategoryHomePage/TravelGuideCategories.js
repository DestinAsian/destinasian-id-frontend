'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames/bind'

import styles from './TravelGuidesCategories.module.scss'
import logohilton from '../../assets/logo/logo_hilton.png'

const cx = classNames.bind(styles)
const ORDER = ['bali', 'jakarta', 'bandung', 'surabaya']

// Normalisasi nama kategori
const normalize = (str = '') => str.toLowerCase().trim()

const TravelGuideCategories = ({ data }) => {
  const categories = data?.category?.children?.edges?.map(({ node }) => node) || []
  if (!categories.length) return null

  // Buat map berdasarkan nama kategori untuk lookup cepat
  const byName = categories.reduce((acc, cat) => {
    acc[normalize(cat.name)] = cat
    return acc
  }, {})

  // Urutkan kategori sesuai daftar ORDER
  const orderedCategories = ORDER.map(key => byName[key]).filter(Boolean)

  return (
    <div className={cx('wrapper')}>
      {/* Header */}
      <div className={cx('titleWrapper')}>
        <h2 className={cx('title')}>Guides</h2>

        {/* Hilton logo */}
        <Image
          src={logohilton}
          alt="Hilton Logo"
          width={100}
          height={100}
          className={cx('logo')}
          priority
          draggable={false}
        />
      </div>

      {/* Grid kategori */}
      <div className={cx('grid')}>
        {orderedCategories.map(({ id, name, uri, categoryImages }) => {
          const imageUrl = categoryImages?.categorySlide1?.mediaItemUrl
          const isComingSoon = [''].includes(normalize(name)) // tidak aktif saat ini

          const CardContent = (
            <div
              className={cx('card', { comingSoon: isComingSoon })}
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
                  {isComingSoon && (
                    <p className={cx('comingsoon')}>(Coming Soon)</p>
                  )}
                </div>
              </div>
            </div>
          )

          return isComingSoon ? (
            <div key={id}>{CardContent}</div>
          ) : (
            <Link key={id} href={uri} draggable={false}>
              {CardContent}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TravelGuideCategories
