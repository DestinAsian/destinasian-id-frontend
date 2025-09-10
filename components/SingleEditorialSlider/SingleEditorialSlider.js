import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper'
import Image from 'next/image'

export default function SingleEditorialSlider({ images }) {
  if (!images?.length) return null // don't render if no images

  return (
    <Swiper
      spaceBetween={30}
      effect="fade"
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: true,
      }}
      pagination={{ type: 'fraction' }}
      navigation={{
        prevEl: '.swiper-custom-button-prev',
        nextEl: '.swiper-custom-button-next',
      }}
      modules={[EffectFade, Autoplay, Pagination, Navigation]}
      className="post-editorial-swiper"
      style={{ display: 'block' }}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image
            src={image}
            alt={`Slider Image ${index + 1}`}
            fill
            sizes="100%"
            priority
          />
        </SwiperSlide>
      ))}

      {/* Custom Navigation Buttons */}
      <div className="swiper-custom-button-prev">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="32"
          height="32"
          fill="#FFFFFF"
        >
          <path d="M1387 5110 c-243 -62 -373 -329 -272 -560 ... (truncated)" />
        </svg>
      </div>
      <div className="swiper-custom-button-next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="32"
          height="32"
          fill="#FFFFFF"
        >
          <path d="M1387 5110 c-243 -62 -373 -329 -272 -560 ... (truncated)" />
        </svg>
      </div>
    </Swiper>
  )
}
