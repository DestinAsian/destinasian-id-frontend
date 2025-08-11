import React, { useState, useEffect } from 'react'
import className from 'classnames/bind'
import styles from './GallerySliderSingle.module.scss'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// import required modules
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper'

let cx = className.bind(styles)

export default function GallerySliderSingle({ gallerySlider }) {
  const [images, setImages] = useState([])

  useEffect(() => {
    if (!gallerySlider) return

    const processGalleryImages = (galleryNode) => {
      let imagesArray = []

      // Recursively extract all images and their captions
      const extractImagesRecursively = (node) => {
        if (node.nodeType === 1 && node.tagName === 'IMG') {
          // Find the closest figure.gallery-item parent
          const figureParent = node.closest('figure.gallery-item')
          let caption = ''

          if (figureParent) {
            const figcaption = figureParent.querySelector('figcaption')
            caption = figcaption ? figcaption.innerText.trim() : ''
          }

          imagesArray.push({
            src: node.getAttribute('src'),
            alt: node.getAttribute('alt') || 'Image',
            width: node.getAttribute('width') || 800,
            height: node.getAttribute('height') || 600,
            caption, // Store the figcaption text
          })
        } else {
          // Traverse child nodes
          Array.from(node.childNodes).forEach(extractImagesRecursively)
        }
      }

      extractImagesRecursively(galleryNode)
      return imagesArray
    }

    setImages(processGalleryImages(gallerySlider))
  }, [gallerySlider])

  return (
    // <div className={cx('component')}>
    <div className={cx('component', 'gallery-slider-wrapper')}>
      <div className={cx('swiper-slider', 'swiper-wrapper')}>
        <Swiper
          effect={'fade'}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          // autoplay={'false'}
          loop={true}
          // autoHeight={true}
          pagination={{
            el: '.swiper-custom-pagination',
            clickable: true,
            type: 'bullets',
          }}
          navigation={{
            prevEl: '.swiper-custom-button-prev',
            nextEl: '.swiper-custom-button-next',
          }}
          modules={[EffectFade, Autoplay, Pagination, Navigation]}
          className="gallery-swiper-wrapper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className={cx('slide-wrapper')}>
                <div className={cx('image-wrapper')}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    // sizes="100%"
                    priority
                  />
                </div>

                <div className={cx('caption-wrapper')}>
                  {image?.caption && (
                    <div className={cx('caption')}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: image.caption,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-custom-pagination"></div>
          <div className="swiper-custom-button-prev">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              height="65"
              viewBox="0 0 65 65"
              fill="none"
            >
              <rect width="65" height="65" fill="black" />
              <path d="M45 12L21 31L45 49" stroke="white" strokeWidth="3" />
            </svg>
          </div>
          <div className="swiper-custom-button-next">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              height="65"
              viewBox="0 0 65 65"
              fill="none"
            >
              <rect
                x="65"
                y="65"
                width="65"
                height="65"
                transform="rotate(-180 65 65)"
                fill="black"
              />
              <path d="M20 53L44 34L20 16" stroke="white" strokeWidth="3" />
            </svg>
          </div>
        </Swiper>
      </div>
    </div>
  )
}
