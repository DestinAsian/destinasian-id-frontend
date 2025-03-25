import className from 'classnames/bind'
import styles from './ContentWrapperLL.module.scss'
import {
  SingleLLSlider,
  SingleLLEntryHeader,
  FeaturedImage,
} from '../../components'
import { GetLuxeListPagination } from '../../queries/GetLuxeListPagination'
import { useQuery } from '@apollo/client'
import React, { useEffect, useState, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import Link from 'next/link'
import { BACKEND_URL } from '../../constants/backendUrl'

let cx = className.bind(styles)

export default function ContentWrapperLL({
  title,
  category,
  content,
  images,
  mainLogo,
  databaseId,
  isNavShown,
  isLLNavShown,
  setIsLLNavShown,
  router,
  isAutoplayRunning,
  setIsAutoplayRunning,
  sliderLL,
  toggleAutoplay,
}) {
  const batchSize = 30
  const [transformedContent, setTransformedContent] = useState('')
  const [isSliderMounted, setIsSliderMounted] = useState(false) // Track slider mount status

  const { data, loading, error } = useQuery(GetLuxeListPagination, {
    variables: { first: batchSize, after: null, id: databaseId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const parent = data?.luxeListBy?.parent

  const luxeListAll = parent
    ? [
        parent?.node,
        ...(data?.luxeListBy?.parent?.node?.children?.edges.map(
          (post) => post.node,
        ) || []),
      ]
    : [
        data?.luxeListBy,
        ...(data?.luxeListBy?.children?.edges.map((post) => post.node) || []),
      ]

  const indexOfLuxeList = data?.luxeListBy?.menuOrder ?? 0
  const numberOfLuxeLists = luxeListAll?.length
  const prevIndex = indexOfLuxeList - 1
  const nextIndex = indexOfLuxeList + 1

  // Loop nextUri to the first index when reaching the last index
  const prevUri = prevIndex >= 0 ? luxeListAll[prevIndex]?.uri : null
  const nextUri =
    nextIndex < numberOfLuxeLists
      ? luxeListAll[nextIndex]?.uri
      : luxeListAll[0]?.uri // Loop back to the first URI

  useEffect(() => {
    if (isAutoplayRunning && isSliderMounted && sliderLL.current) {
      const swiperInstance = sliderLL.current.swiper

      const handleSlideChange = () => {
        const isLastSlide =
          swiperInstance.realIndex === swiperInstance.slides.length - 1

        if (isLastSlide) {
          const timer = setTimeout(() => {
            if (nextUri) {
              router.replace(nextUri)
            }
          }, 3000)

          return () => clearTimeout(timer) // Clear the timeout on cleanup
        }
      }

      swiperInstance.on('slideChange', handleSlideChange)

      return () => {
        swiperInstance.off('slideChange', handleSlideChange)
      }
    }
  }, [sliderLL.current, isAutoplayRunning, nextUri, router, isSliderMounted])

  useEffect(() => {
    const extractImageData = () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)

      imageElements.forEach((img) => {
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        const width = img.getAttribute('width')
        const height = img.getAttribute('height')

        const imageComponent = (
          <Image
            src={src}
            alt={alt}
            width={width ? width : '500'}
            height={height ? height : '500'}
            style={{ objectFit: 'contain' }}
            priority
          />
        )

        const imageHtmlString = renderToStaticMarkup(imageComponent)
        img.outerHTML = imageHtmlString
      })

      setTransformedContent(doc.body.innerHTML)
    }

    extractImageData()
  }, [content, isSliderMounted])

  useEffect(() => {
    if (isSliderMounted) {
      const swiperInstance = sliderLL?.current?.swiper
      const initialAutoplayState = swiperInstance.autoplay?.running || false
      setIsAutoplayRunning(initialAutoplayState)

      swiperInstance.on('slideChange', () => {
        const currentAutoplayState = swiperInstance.autoplay?.running || false
        setIsAutoplayRunning(currentAutoplayState)
      })

      return () => {
        swiperInstance.off('slideChange')
      }
    }
  }, [isAutoplayRunning, isSliderMounted])

  useEffect(() => {
    if (isAutoplayRunning && isNavShown) {
      return toggleAutoplay() // Calls the toggleAutoplay function
    }
  })

  if (loading) {
    return null
  }

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  return (
    <article className={cx('component')}>
      <div className={cx('with-slider-wrapper')}>
        {images[0] != null && (
          <div className={cx('slider-wrapper')}>
            <SingleLLSlider
              images={images}
              nextUri={nextUri}
              sliderLL={sliderLL}
              isSliderMounted={isSliderMounted}
              setIsSliderMounted={setIsSliderMounted}
            />
          </div>
        )}
        {images[0] == null && <div className={cx('slider-wrapper')}></div>}
        <SingleLLEntryHeader
          title={title}
          category={category}
          responsive={'mobile'}
        />
        <div
          className={cx('content-wrapper')}
          dangerouslySetInnerHTML={{ __html: transformedContent ?? '' }}
        />
        <div className={cx('navigation-wrapper')}>
          <div className={cx('navigation-button')}>
            {prevUri && (
              <Link href={prevUri} className={cx('prev-button')}>
                <svg
                  width="60"
                  height="90"
                  viewBox="0 0 60 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M52 8L15 45L52 82" stroke="none" stroke-width="20" />
                </svg>
              </Link>
            )}
          </div>
          <div className={cx('autoplay-button-wrapper')}>
            <div className={cx('image-wrapper')}>
              <div className={cx('menu-button')}>
                <button
                  type="button"
                  className={cx('autoplay-icon')}
                  onClick={() => {
                    toggleAutoplay() // Calls the toggleAutoplay function
                    if (isLLNavShown) {
                      return setIsLLNavShown(!isLLNavShown) // Calls the toggleAutoplay function
                    }
                  }}
                  // aria-label="Toggle autoplay"
                  // // aria-controls={cx('full-menu-wrapper')}
                  // aria-expanded={toggleAutoplay}
                >
                  {isAutoplayRunning ? (
                    <svg
                      width="34"
                      height="44"
                      viewBox="0 0 34 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Pause Button */}
                      <path
                        d="M2.11088 0.486993H8.29661C8.61163 0.486993 8.88369 0.601543 9.11279 0.830643C9.34189 1.05974 9.45644 1.3318 9.45644 1.64682V42.2407C9.45644 42.5557 9.34189 42.8278 9.11279 43.0569C8.88369 43.286 8.61163 43.4005 8.29661 43.4005H2.11088C1.79587 43.4005 1.52381 43.286 1.29471 43.0569C1.06561 42.8278 0.951057 42.5557 0.951057 42.2407V1.64682C0.951057 1.3318 1.06561 1.05974 1.29471 0.830643C1.52381 0.601543 1.79587 0.486993 2.11088 0.486993ZM25.7202 0.486993H31.9059C32.2209 0.486993 32.493 0.601543 32.7221 0.830643C32.9512 1.05974 33.0657 1.3318 33.0657 1.64682V42.2407C33.0657 42.5557 32.9512 42.8278 32.7221 43.0569C32.493 43.286 32.2209 43.4005 31.9059 43.4005H25.7202C25.4051 43.4005 25.1331 43.286 24.904 43.0569C24.6749 42.8278 24.5603 42.5557 24.5603 42.2407V1.64682C24.5603 1.3318 24.6749 1.05974 24.904 0.830643C25.1331 0.601543 25.4051 0.486993 25.7202 0.486993Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="50"
                      height="69"
                      viewBox="0 0 50 69"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Play Button */}
                      <path
                        d="M50 34.5L0.499997 68.708L0.5 0.291994L50 34.5Z"
                        fill="#ffffff"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className={cx('menu-center-wrapper')}>
            {!isLLNavShown ? (
              <div className={cx('image-wrapper')}>
                {/* Menu Button */}
                {isLLNavShown == false ? (
                  <div className={cx('menu-button')}>
                    {/* menu button */}
                    <button
                      type="button"
                      className={cx('menu-icon')}
                      onClick={() => {
                        setIsLLNavShown(!isLLNavShown) // Toggles navigation visibility
                        if (isAutoplayRunning) {
                          return toggleAutoplay() // Calls the toggleAutoplay function
                        }
                      }}
                      aria-label="Toggle navigation"
                      aria-controls={cx('full-menu-wrapper')}
                      aria-expanded={!isLLNavShown}
                    >
                      {mainLogo && (
                        <FeaturedImage
                          image={mainLogo}
                          className={cx('image')}
                          priority
                        />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className={cx('menu-button')}>
                    {/* close button */}
                    <button
                      type="button"
                      className={cx('close-icon')}
                      onClick={() => {
                        setIsLLNavShown(!isLLNavShown)
                      }}
                      aria-label="Toggle navigation"
                      aria-controls={cx('full-menu-wrapper')}
                      aria-expanded={!isLLNavShown}
                    >
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
                          fill="#ffffff"
                          stroke="none"
                        >
                          <path
                            d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={cx('image-wrapper')}>
                <div className={cx('menu-button')}>
                  {/* close button */}
                  <button
                    type="button"
                    className={cx('close-icon')}
                    onClick={() => {
                      setIsLLNavShown(!isLLNavShown)
                    }}
                    aria-label="Toggle navigation"
                    aria-controls={cx('full-menu-wrapper')}
                    aria-expanded={!isLLNavShown}
                  >
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
                        fill="#ffffff"
                        stroke="none"
                      >
                        <path
                          d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={cx('navigation-button')}>
            {nextUri && (
              <Link href={nextUri} className={cx('next-button')}>
                <svg
                  width="60"
                  height="90"
                  viewBox="0 0 60 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 82L45 45L8.00001 8"
                    stroke="none"
                    stroke-width="20"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
