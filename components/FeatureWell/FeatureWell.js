import React, { useRef, useEffect, useState } from 'react'
import className from 'classnames/bind'
import styles from './FeatureWell.module.scss'
import { useMediaQuery } from 'react-responsive'
import { Swiper, SwiperSlide } from 'swiper/react'
import Div100vh from 'react-div-100vh'
import { useRouter } from 'next/navigation'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

import { EffectFade, Autoplay, Pagination } from 'swiper'
import Image from 'next/image'
import Link from 'next/link'

let cx = className.bind(styles)

export default function FeatureWell({ featureWells }) {
  const router = useRouter()

  const isDesktop = useMediaQuery({ minWidth: 640 })
  const isMobile = useMediaQuery({ maxWidth: 639 })

  const captionRefs = useRef([])
  const [captionWidths, setCaptionWidths] = useState([])

  const updateCaptionWidths = () => {
    const widths = captionRefs.current.map((ref) => ref?.offsetWidth || 0)
    setCaptionWidths(widths)
    captionRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.setProperty('--caption-width', `${widths[index]}px`)
      }
    })
  }

  useEffect(() => {
    updateCaptionWidths()
    window.addEventListener('resize', updateCaptionWidths)
    return () => window.removeEventListener('resize', updateCaptionWidths)
  }, [])

  return (
    <Div100vh>
      <Swiper
        onSlideChange={(swiper) => {
          const currentSlideIndex = swiper.activeIndex
          const currentSlide = featureWells[currentSlideIndex]

          if (currentSlide.type === 'video') {
            const videoElement = document.getElementById(
              `video-${currentSlideIndex}`,
            )
            if (videoElement) {
              videoElement.currentTime = 0
              videoElement.play()
            }
          }
        }}
        effect={'fade'}
        autoplay={{
          delay: 15000,
          disableOnInteraction: false,
        }}
        pagination={{
          el: '.swiper-custom-pagination',
          clickable: true,
          type: 'bullets',
          renderBullet: (i, className) => `
            <button class="${className}">
              <svg class="progress">
                <circle class="circle-origin" cx="16" cy="16" r="10.5"></circle>
              </svg>
              <span></span>
            </button>
          `,
        }}
        modules={[EffectFade, Autoplay, Pagination]}
        className="fw-swiper-wrapper"
      >
        {featureWells?.map((featureWell, index) => (
          <SwiperSlide key={index}>
            {featureWell.type === 'image' && featureWell.url && (
              <Link href={featureWell.url}>
                <div className={cx('image-wrapper')}>
                  <Image
                    src={
                      isDesktop ? featureWell.desktopSrc : featureWell.mobileSrc
                    }
                    alt="Feature Well Image"
                    fill
                    sizes="100vw"
                    priority
                  />
                  <div className={cx('caption-wrapper')}>
                    {/* {featureWell.category && featureWell.categoryLink && (
                      <div className={cx('category-wrapper')}>
                        <Link href={featureWell.categoryLink}>
                          <h1 className={cx('category')}>
                            {featureWell.category}
                          </h1>
                        </Link>
                      </div>
                    )} */}
                    {featureWell.category && featureWell.categoryLink && (
                      <div className={cx('category-wrapper')}>
                        <h1
                          className={cx('category')}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            router.push(featureWell.categoryLink)
                          }}
                        >
                          {featureWell.category}
                        </h1>
                      </div>
                    )}

                    {featureWell.caption && (
                      <h1
                        ref={(el) => (captionRefs.current[index] = el)}
                        className={cx('caption')}
                      >
                        {featureWell.caption}
                      </h1>
                    )}
                    {featureWell.standFirst && (
                      <div className={cx('stand-first-wrapper')}>
                        <h2 className={cx('stand-first')}>
                          {featureWell.standFirst}
                        </h2>
                      </div>
                    )}
                  </div>
                  <div className={cx('bottom-gradient')}></div>
                </div>
              </Link>
            )}

            {featureWell.type === 'video' && featureWell.url && (
              <Link href={featureWell.url}>
                <div className={cx('video-wrapper')}>
                  <video
                    id={`video-${index}`}
                    src={featureWell.videoSrc}
                    className="video-content"
                    loop
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className={cx('caption-wrapper')}>
                    {/* {featureWell.category && featureWell.categoryLink && (
                      <div className={cx('category-wrapper')}>
                        <Link href={featureWell.categoryLink}>
                          <h1 className={cx('category')}>
                            {featureWell.category}
                          </h1>
                        </Link>
                      </div>
                    )} */}
                    {featureWell.category && featureWell.categoryLink && (
                      <div className={cx('category-wrapper')}>
                        <h1
                          className={cx('category')}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            router.push(featureWell.categoryLink)
                          }}
                        >
                          {featureWell.category}
                        </h1>
                      </div>
                    )}

                    {featureWell.caption && (
                      <h1
                        ref={(el) => (captionRefs.current[index] = el)}
                        className={cx('caption')}
                      >
                        {featureWell.caption}
                      </h1>
                    )}
                    {featureWell.standFirst && (
                      <div className={cx('stand-first-wrapper')}>
                        <h2 className={cx('stand-first')}>
                          {featureWell.standFirst}
                        </h2>
                      </div>
                    )}
                  </div>
                  <div className={cx('bottom-gradient')}></div>
                </div>
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-custom-pagination"></div>
    </Div100vh>
  )
}
