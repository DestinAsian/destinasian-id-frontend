import React from 'react'
import Link from 'next/link'
import classNames from 'classnames/bind'
import styles from './TravelGuidesCategories.module.scss'

const cx = classNames.bind(styles)

const TravelGuideCategories = ({ data }) => {
  const categories = data?.category?.children?.edges?.map(edge => edge.node) || []

  return (
    <div className={cx('categoryIndoWrapper')}>
      <h2 className={cx('title')}>Guide</h2>
      <div className={cx('grid')}>
        {categories.map((node) => {
          const { id, name, uri, categoryImages } = node ?? {}
          const firstImage = categoryImages?.categorySlide1?.mediaItemUrl || null

          return (
            <Link key={id} href={uri} passHref legacyBehavior>
              <a className={cx('card')}>
                <div className={cx('imageWrapper')}>
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt={name ?? 'Category Image'}
                      className={cx('image')}
                    />
                  )}
                  <h3 className={cx('nameOverlay')}>{name}</h3>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TravelGuideCategories
