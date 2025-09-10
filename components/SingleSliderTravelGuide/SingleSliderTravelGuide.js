import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper'
import Image from 'next/image'

export default function SingleSliderTravelGuide({ images }) {
  if (!images?.length) return null // Exit early if no images

  return (
    <>
      <Swiper
        spaceBetween={30}
        effect="fade"
        loop
        autoplay={{
          delay: 25000,
          disableOnInteraction: true,
        }}
        pagination={{
          el: '.swiper-post-custom-pagination',
          clickable: true,
          renderBullet: (index, className) =>
            `<span key="${index}" class="${className}"></span>`,
        }}
        navigation={{
          prevEl: '.swiper-custom-button-prev',
          nextEl: '.swiper-custom-button-next',
        }}
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        className="post-swiper"
      >
        {images.map((image, index) =>
          image[0] ? (
            <SwiperSlide key={index} className="post-swiper-slide">
              <Image
                src={image[0]}
                alt={`Slider Image ${index + 1}`}
                fill
                sizes="100%"
                priority
              />
              {image[1] && (
                <figcaption className="slide-caption">{image[1]}</figcaption>
              )}
            </SwiperSlide>
          ) : null
        )}

        {/* Navigation buttons */}
        <div className="swiper-custom-button-prev">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
          >
            <g fill="#FFFFFF" stroke="none">
              <path d="M1387 5110 c-243 -62 -373 -329 -272 -560 27 -62 77 -114 989 -1027
                l961 -963 -961 -963 c-912 -913 -962 -965 -989 -1027 -40 -91 -46 -200 -15
                -289 39 -117 106 -191 220 -245 59 -28 74 -31 160 -30 74 0 108 5 155 23 58
                22 106 70 1198 1160 1304 1302 1202 1185 1202 1371 0 186 102 69 -1202 1371
                -1102 1101 -1140 1137 -1198 1159 -67 25 -189 34 -248 20z"/>
            </g>
          </svg>
        </div>

        <div className="swiper-custom-button-next">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
          >
            <g fill="#FFFFFF" stroke="none">
              <path d="M1387 5110 c-243 -62 -373 -329 -272 -560 27 -62 77 -114 989 -1027
                l961 -963 -961 -963 c-912 -913 -962 -965 -989 -1027 -40 -91 -46 -200 -15
                -289 39 -117 106 -191 220 -245 59 -28 74 -31 160 -30 74 0 108 5 155 23 58
                22 106 70 1198 1160 1304 1302 1202 1185 1202 1371 0 186 102 69 -1202 1371
                -1102 1101 -1140 1137 -1198 1159 -67 25 -189 34 -248 20z"/>
            </g>
          </svg>
        </div>
      </Swiper>

      <div className="swiper-post-custom-pagination"></div>
    </>
  )
}
