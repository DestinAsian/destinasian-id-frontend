'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import Image from 'next/image'
import className from 'classnames/bind'
import useSWR from 'swr'

import styles from './GallerySliderSingle.module.scss'

import 'swiper/css'
import 'swiper/css/navigation'

let cx = className.bind(styles)

/* ================================
   FETCHER: LOGIKA ASLI (UTUH)
================================ */
const galleryFetcher = (gallerySlider) => {
  if (!gallerySlider) return []

  const images = []

  const extractImagesRecursively = (node) => {
    if (node.nodeType === 1 && node.tagName === 'IMG') {
      const figureParent = node.closest('figure.gallery-item')
      let caption = ''

      if (figureParent) {
        const figcaption = figureParent.querySelector('figcaption')
        caption = figcaption ? figcaption.innerHTML.trim() : ''
      } else {
        const galleryCaption = node
          .closest('.gallery-item')
          ?.querySelector('.gallery-caption')
        if (galleryCaption) caption = galleryCaption.innerHTML.trim()
      }

      images.push({
        src: node.getAttribute('src') || '',
        alt: node.getAttribute('alt') || 'Image',
        width: parseInt(node.getAttribute('width')) || 600,
        height: parseInt(node.getAttribute('height')) || 800,
        caption,
      })
    } else {
      Array.from(node.childNodes).forEach(extractImagesRecursively)
    }
  }

  extractImagesRecursively(gallerySlider)
  return images
}

export default function GallerySliderSingle({ gallerySlider }) {
  if (!gallerySlider) return null

  /* ================================
     SWR menggantikan proses render-sync
  ================================= */
  const { data: images = [] } = useSWR(
    gallerySlider ? ['gallery-slider-single', gallerySlider] : null,
    () => galleryFetcher(gallerySlider),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  )

  if (!images.length) return null

  return (
    <div className={styles.gallerySliderWrapper}>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        slidesPerView={1}
        className={styles.swiperContainer}
        preloadImages={false}
        lazy="true"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className={cx('slide-wrapper')}>
              <div className={cx('image-wrapper')}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className={cx('thumbnail')}
                  loading="lazy"
                />
              </div>

              {img.caption && (
                <div className={cx('caption-wrapper')}>
                  <div
                    className={cx('caption')}
                    dangerouslySetInnerHTML={{ __html: img.caption }}
                  />
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

