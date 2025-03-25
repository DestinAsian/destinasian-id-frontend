import React, { useEffect, useState } from 'react'
import className from 'classnames/bind'
import styles from './SingleLuxuryTravelSlider.module.scss'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// import required modules
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper'

let cx = className.bind(styles)

export default function SingleLuxuryTravelSlider({ images, parent }) {
  const [isMounted, setIsMounted] = useState(false) // To ensure client-side rendering

  // Media queries
  const isDesktop = useMediaQuery({ minWidth: 640 })
  const isMobile = useMediaQuery({ maxWidth: 639 })

  if (!images || !parent) {
    return null
  }

  // Ensures client-side rendering before using client-specific logic
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const mobileHeight = isMobile && 'auto'
  const desktopHeight = isDesktop && '93vh'

  const menuIndex = images?.map((image, index) => index)

  const swiperComponent = (
    <>
      <Swiper
        spaceBetween={30}
        effect={'fade'}
        loop={true}
        autoplay={{
          delay: 25000,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-lt-custom-pagination',
          renderBullet: function (index, className) {
            return `<span key="${menuIndex[index]}" class="${className}"></span>`
          },
        }}
        navigation={{
          prevEl: '.swiper-custom-button-prev',
          nextEl: '.swiper-custom-button-next',
        }}
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        className="post-luxury-travel-swiper"
        style={{ display: images[0] ? 'block' : 'none' }}
      >
        {images?.map((image, index) => (
          <>
            {image[0] && (
              <SwiperSlide key={index}>
                <div className={cx('swiper-wrapper')}>
                  <div className={cx('image-wrapper')}>
                    <Image
                      src={image[0]}
                      alt={'Slider Image ' + index}
                      fill
                      sizes="100%"
                      priority
                    />
                  </div>
                  {/* {image[1] && (
                    <div className={cx('caption-wrapper')}>
                      <figcaption className={'slide-caption'}>
                        <span className={'caption'}>{image[1]}</span>
                      </figcaption>
                    </div>
                  )} */}
                </div>
              </SwiperSlide>
            )}
          </>
        ))}
        <div className="swiper-custom-button-prev">
          {/* SVG code for previous button */}
        </div>
        <div className="swiper-custom-button-next">
          {/* SVG code for next button */}
        </div>
      </Swiper>
    </>
  )

  // Ensure component only renders when mounted on the client
  if (!isMounted) {
    return null
  }

  return (
    <>
      {isMobile && (
        <>
          <div style={{ height: mobileHeight }}>{swiperComponent}</div>
          <div className="swiper-lt-custom-pagination"></div>
        </>
      )}
      {isDesktop && (
        <>
          <div style={{ height: desktopHeight }}>{swiperComponent}</div>
          <div className="swiper-lt-custom-pagination"></div>
        </>
      )}
    </>
  )
}
