'use client'

import React from 'react'
import Link from 'next/link'
import styles from './TravelGuidesCategories.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const TravelGuideCategories = ({ data }) => {
  const categories = data?.category?.children?.edges?.map(({ node }) => node) || []

  if (!categories.length) return null

  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('title')}>Guides</h2>
      <div className={cx('grid')}>
        {categories.map(({ id, name, uri, categoryImages }) => {
          const imageUrl = categoryImages?.categorySlide1?.mediaItemUrl

          return (
            <Link key={id} href={uri} className={cx('card')}>
              <div className={cx('imageWrapper')}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={name}
                    className={cx('image')}
                    loading="lazy"
                  />
                )}
                <h3 className={cx('nameOverlay')}>{name}</h3>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TravelGuideCategories
