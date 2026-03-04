import className from 'classnames/bind'
import Heading from '../../components/Heading/Heading'
import Container from '../../components/Container/Container'
import styles from './CategoryEntryHeader.module.scss'
import { useMemo } from 'react'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// import required modules
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper'

let cx = className.bind(styles)

export default function CategoryEntryHeader({
  parent,
  children,
  title,
  destinationGuides,
  changeToSlider,
  guidesTitle,
  categorySlider,
  image,
  imageCaption,
  description,
  className,
}) {
  // Validator for Normal Category or Guides
  const isNormalCategory = destinationGuides == null
  const isGuide = destinationGuides == 'yes'

  // Validator for Slider or Image
  const normalizedChangeToSlider =
    typeof changeToSlider === "string"
      ? changeToSlider.trim().toLowerCase()
      : ""

  const isSlider = normalizedChangeToSlider === "yes"
  const isImage = !isSlider



  const transformedDescription = useMemo(
    () => sanitizeHtml(description || ''),
    [description],
  )

  const sliderData = Array.isArray(categorySlider)
    ? categorySlider.filter((slide) => slide?.[0])
    : []

  const menuIndex = sliderData.map((_, index) => index)

  const hasValidSlider = sliderData.length > 0

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
          el: '.swiper-post-custom-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            return `<span key="${menuIndex[index]}" class="${className}"></span>`
          },
        }}
        navigation={{
          prevEl: '.swiper-custom-button-prev',
          nextEl: '.swiper-custom-button-next',
        }}
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        className="post-category-swiper"
      >
        {sliderData.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image[0]}
              alt={'Slider Image' + index}
              fill
              sizes="100%"
              priority={index === 0}
            />
            {image[1] && (
              <figcaption className={'slide-caption'}>
                <span className={'caption'}>{image[1]}</span>
              </figcaption>
            )}
          </SwiperSlide>
        ))}
        <div className="swiper-custom-button-prev">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="512.000000pt"
            height="512.000000pt"
            viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
              fill="#FFFFFF"
              stroke="none"
            >
              <path
                d="M1387 5110 c-243 -62 -373 -329 -272 -560 27 -62 77 -114 989 -1027
l961 -963 -961 -963 c-912 -913 -962 -965 -989 -1027 -40 -91 -46 -200 -15
-289 39 -117 106 -191 220 -245 59 -28 74 -31 160 -30 74 0 108 5 155 23 58
22 106 70 1198 1160 1304 1302 1202 1185 1202 1371 0 186 102 69 -1202 1371
-1102 1101 -1140 1137 -1198 1159 -67 25 -189 34 -248 20z"
              />
            </g>
          </svg>
        </div>
        <div className="swiper-custom-button-next">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="512.000000pt"
            height="512.000000pt"
            viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
              fill="#FFFFFF"
              stroke="none"
            >
              <path
                d="M1387 5110 c-243 -62 -373 -329 -272 -560 27 -62 77 -114 989 -1027
l961 -963 -961 -963 c-912 -913 -962 -965 -989 -1027 -40 -91 -46 -200 -15
-289 39 -117 106 -191 220 -245 59 -28 74 -31 160 -30 74 0 108 5 155 23 58
22 106 70 1198 1160 1304 1302 1202 1185 1202 1371 0 186 102 69 -1202 1371
-1102 1101 -1140 1137 -1198 1159 -67 25 -189 34 -248 20z"
              />
            </g>
          </svg>
        </div>
      </Swiper>
    </>
  )

  return (
       <div
    className={cx([
      'component',
      className,
      {
        'normal-category': isNormalCategory,
        'guides-category': isGuide,
      },
    ])}>
      {isNormalCategory && (
        <Container>
          {/* Normal Category with Slider */}
          {isSlider && (
            <div className={cx('container-wrapper')}>
              <div className={cx('text', { 'has-image': image })}>
                <Container>
                  {hasValidSlider ? (
                    <figure className={cx('image-slider')}>
                      <div>{swiperComponent}</div>
                      <div className="swiper-post-custom-pagination"></div>
                    </figure>
                  ) : (
                    <figure className={cx('image')}>
                      {image && (
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="100%"
                          priority
                        />
                      )}
                      {imageCaption && (
                        <figcaption className={cx('image-caption')}>
                          <span className={cx('caption')}>{imageCaption}</span>
                        </figcaption>
                      )}
                    </figure>
                  )}
                  {title && (
                    <Heading className={cx('title')}>
                      {children?.length !== 0 &&
                        (guidesTitle ? guidesTitle : title)}
                      {children?.length === 0 &&
                        (guidesTitle
                          ? guidesTitle
                          : (parent ? parent : '') + ' ' + title)}
                    </Heading>
                  )}
                  {description && (
                    <p
                      className={cx('description')}
                      dangerouslySetInnerHTML={{
                        __html: transformedDescription ?? '',
                      }}
                    />
                  )}
                </Container>
              </div>
            </div>
          )}
          {/* Normal Category with Image */}
          {isImage && (
            <div className={cx('container-wrapper')}>
              <div className={cx('text', { 'has-image': image })}>
                <Container>
                  {image && (
                    <figure className={cx('image')}>
                      <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="100%"
                        priority
                      />
                      {imageCaption && (
                        <div className={cx('image-caption')}>
                          <div className={cx('caption-wrapper')}>
                            <span className={cx('caption')}>
                              {imageCaption}
                            </span>
                          </div>
                        </div>
                      )}
                    </figure>
                  )}
                  {title && (
                    <Heading className={cx('title')}>
                      {children?.length !== 0 &&
                        children?.length !== undefined &&
                        (guidesTitle ? guidesTitle : title)}
                      {(children?.length === 0 ||
                        children?.length === undefined) &&
                        (guidesTitle
                          ? guidesTitle
                          : (parent ? parent : '') + ' ' + title)}
                    </Heading>
                  )}
                  {description && (
                    <p
                      className={cx('description')}
                      dangerouslySetInnerHTML={{
                        __html: transformedDescription ?? '',
                      }}
                    />
                  )}
                </Container>
              </div>
            </div>
          )}
        </Container>
      )}
      {isGuide && (
        <Container>
          {/* Guides with Slider */}
          {isSlider && (
            <div className={cx('container-wrapper')}>
              <div className={cx('text', { 'has-image': image })}>
                <Container>
                  {hasValidSlider ? (
                    <figure className={cx('image-slider')}>
                      <div>{swiperComponent}</div>
                      <div className="swiper-post-custom-pagination"></div>
                    </figure>
                  ) : (
                    <figure className={cx('image')}>
                      {image && (
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="100%"
                          priority
                        />
                      )}
                      {imageCaption && (
                        <div className={cx('image-caption')}>
                          <div className={cx('caption-wrapper')}>
                            <span className={cx('caption')}>
                              {imageCaption}
                            </span>
                          </div>
                        </div>
                      )}
                    </figure>
                  )}
                  {title && (
                    <Heading className={cx('title')}>
                      {children?.length !== 0 &&
                        (guidesTitle
                          ? guidesTitle
                          : 'DestinAsian Indonesia Travel Guide - ' + title)}
                      {children?.length === 0 &&
                        (guidesTitle
                          ? guidesTitle
                          : 'DestinAsian Indonesia Travel Guide - ' + title)}
                    </Heading>
                  )}
                  {description && (
                    <p
                      className={cx('description')}
                      dangerouslySetInnerHTML={{
                        __html: transformedDescription ?? '',
                      }}
                    />
                  )}
                </Container>
              </div>
            </div>
          )}
          {/* Guides with Image */}
          {isImage && (
            <div className={cx('container-wrapper')}>
              <div className={cx('text', { 'has-image': image })}>
                <Container>
                  {image && (
                    <figure className={cx('image')}>
                      <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="100%"
                        priority
                      />
                      {imageCaption && (
                        <div className={cx('image-caption')}>
                          <div className={cx('caption-wrapper')}>
                            <span className={cx('caption')}>
                              {imageCaption}
                            </span>
                          </div>
                        </div>
                      )}
                    </figure>
                  )}
                  {title && (
                    <Heading className={cx('title')}>
                      {children?.length !== 0 &&
                        (guidesTitle
                          ? guidesTitle
                          : 'DestinAsian Indonesia Travel Guide - ' + title)}
                      {children?.length === 0 &&
                        (guidesTitle
                          ? guidesTitle
                          : ' DestinAsian Indonesia Travel Guide - ' + title)}
                          {/* : (parent ? parent : '') + ' DestinAsian Indonesia Travel Guide - ' + title)} */}
                    </Heading>
                  )}

                  {description && (
                    <p
                      className={cx('description')}
                      dangerouslySetInnerHTML={{
                        __html: transformedDescription ?? '',
                      }}
                    />
                  )}
                </Container>
              </div>
            </div>
          )}
        </Container>
      )}
    </div>
  )
}
