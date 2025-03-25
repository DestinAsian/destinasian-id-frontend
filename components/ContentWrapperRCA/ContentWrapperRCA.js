import className from 'classnames/bind'
import styles from './ContentWrapperRCA.module.scss'
import {
  RCAFullMenu,
  SingleRCAEntryHeader,
  SingleRCASlider,
} from '../../components'
import React, { useEffect, useState, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import Link from 'next/link'
import { BACKEND_URL } from '../../constants/backendUrl'
import { useQuery } from '@apollo/client'
import { GetRCAPagination } from '../../queries/GetRCAPagination'

let cx = className.bind(styles)

export default function ContentWrapperRCA({
  router,
  title,
  parentTitle,
  images,
  content,
  databaseId,
  rcaDatabaseId,
  uri,
  rcaIndexData,
  sliderLoading,
  isNavShown,
  setIsNavShown,
  isAutoplayRunning,
  setIsAutoplayRunning,
  sliderRCA,
  toggleAutoplay,
  activeIndex,
  setActiveIndex,
}) {
  const batchSize = 100
  const [transformedContent, setTransformedContent] = useState('')
  const [isSliderMounted, setIsSliderMounted] = useState(false) // Track slider mount status
  // const [activeIndex, setActiveIndex] = useState(0)
  const [hash, setHash] = useState('')

  useEffect(() => {
    // Update activeIndex based on the hash in the URL
    const hashFromURL = window.location.hash.substring(1)
    setHash(hashFromURL)

    if (hashFromURL) {
      const index = rcaIndexData.findIndex(
        (rcaIndex) =>
          rcaIndex.name.toLowerCase().replace(/\s+/g, '-') === hashFromURL,
      )
      setActiveIndex(index)
    }
  }, [rcaIndexData])

  useEffect(() => {
    // Scroll to the element with the matching ID when hash changes
    const element = document.getElementById(hash)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [hash])

  const slideTo = (index) => {
    if (sliderRCA?.current?.swiper) {
      sliderRCA.current.swiper.slideTo(index)
    }
    setActiveIndex(index)
  }

  const handleSlideChange = (index) => {
    setActiveIndex(index)
  }

  const { data, loading, error } = useQuery(GetRCAPagination, {
    variables: { first: batchSize, after: null, id: databaseId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const ancestors = data?.readersChoiceAwardBy?.ancestors

  // Declare Children Posts including nested child
  const extractPosts = (nodes) => {
    if (!nodes) return []
    return nodes.flatMap((post) => [
      post?.node,
      ...extractPosts(post?.node?.children?.edges || []),
    ])
  }

  const rcaAll = ancestors
    ? [
        ancestors?.edges[0]?.node,
        ...extractPosts(
          data?.readersChoiceAwardBy?.ancestors?.edges[0]?.node?.children?.edges.map(
            (post) => post,
          ) || [],
        ),
      ]
    : [
        data?.readersChoiceAwardBy,
        ...extractPosts(
          data?.readersChoiceAwardBy?.children?.edges.map((post) => post) || [],
        ),
      ]

  const indexOfRCA = data?.readersChoiceAwardBy?.menuOrder ?? 0
  const numberOfRCA = rcaAll?.length
  const prevIndex = indexOfRCA - 1
  const nextIndex = indexOfRCA + 1

  // Loop nextUri to the first index when reaching the last index
  const prevUri = prevIndex >= 0 ? rcaAll[prevIndex]?.uri : null
  const nextUri =
    nextIndex < numberOfRCA ? rcaAll[nextIndex]?.uri : rcaAll[0]?.uri // Loop back to the first URI

  useEffect(() => {
    if (isAutoplayRunning && isSliderMounted && sliderRCA?.current) {
      const swiperInstance = sliderRCA?.current.swiper

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
  }, [sliderRCA?.current, isAutoplayRunning, nextUri, router, isSliderMounted])

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
      const swiperInstance = sliderRCA?.current?.swiper

      const updateIndex = () => {
        setActiveIndex(swiperInstance.realIndex)
      }

      const initialAutoplayState = swiperInstance.autoplay?.running || false
      setIsAutoplayRunning(initialAutoplayState)

      swiperInstance.on('slideChange', () => {
        const currentAutoplayState = swiperInstance.autoplay?.running || false
        setIsAutoplayRunning(currentAutoplayState)
        updateIndex
      })

      return () => {
        swiperInstance.off('slideChange', updateIndex)
      }
    }
  }, [isAutoplayRunning, isSliderMounted])

  // const toggleAutoplay = () => {
  //   const swiperInstance = sliderRCA?.current?.swiper
  //   if (swiperInstance) {
  //     if (isAutoplayRunning) {
  //       swiperInstance.autoplay?.stop()
  //     } else {
  //       swiperInstance.autoplay?.start()
  //       setActiveIndex(swiperInstance.realIndex)
  //     }
  //     setIsAutoplayRunning(!isAutoplayRunning)
  //   }
  // }

  useEffect(() => {
    if (isAutoplayRunning && isNavShown) {
      return toggleAutoplay() // Calls the toggleAutoplay function
    }
  })

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  if (loading || sliderLoading) {
    return (
      <>
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
          <div role="status">
            <svg
              aria-hidden="true"
              className="mr-2 h-[80vh] w-8 animate-spin fill-black text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {images[0] != null && (
        <div className={cx('slider-wrapper')}>
          <SingleRCASlider
            images={rcaIndexData.map((item) => item.imageUrl)}
            handleSlideChange={handleSlideChange}
            nextUri={nextUri}
            sliderRCA={sliderRCA}
            isSliderMounted={isSliderMounted}
            setIsSliderMounted={setIsSliderMounted}
          />
        </div>
      )}
      {images[0] == null && <div className={cx('slider-wrapper')}></div>}
      {/* Under the Slider */}
      {parentTitle && (
        <SingleRCAEntryHeader
          parentTitle={parentTitle}
          className={'parentClass'}
          // category={category}
        />
      )}
      {/* Before Content Wrapper */}
      {title && (
        <SingleRCAEntryHeader
          title={title}
          className={parentTitle ? 'bothClass' : 'defaultClass'}
          // category={category}
        />
      )}
      <article
        className={cx(
          'component',
          transformedContent !== 'null' && title !== null ? 'sm:top-0' : '',
        )}
      >
        <div className={cx('with-slider-wrapper')}>
          {rcaIndexData[0]?.name !== null && (
            <div className={cx('content-list-wrapper')}>
              {rcaIndexData?.map((rcaIndex, index) => (
                <>
                  <div
                    className={cx([
                      'button-pagination',
                      activeIndex == index ? 'active' : undefined,
                    ])}
                    id={rcaIndex?.name ? rcaIndex.name : null}
                    key={index}
                  >
                    <button
                      className={cx('content-list')}
                      onClick={() => {
                        slideTo(index)
                        handleSlideChange(index)
                      }}
                    >
                      {rcaIndex?.name && (
                        <>
                          <div className={cx('content-index')}>{index + 1}</div>
                          <div className={cx('content-property-name')}>
                            {rcaIndex?.name}
                          </div>
                        </>
                      )}
                    </button>
                    <div
                      className={cx([
                        'content-url',
                        activeIndex == index ? 'show' : undefined,
                      ])}
                    >
                      {rcaIndex?.url && (
                        <div className={cx('content-property-url')}>
                          <Link href={rcaIndex?.url} target="_blank">
                            {'Visit Site'}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </div>
          )}
          {transformedContent !== 'null' && (
            <div
              className={cx('content-wrapper')}
              dangerouslySetInnerHTML={{ __html: transformedContent ?? '' }}
            />
          )}
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
                    <path
                      d="M52 8L15 45L52 82"
                      stroke="none"
                      stroke-width="20"
                    />
                  </svg>
                </Link>
              )}
            </div>
            <div className={cx('menu-wrapper')}>
              <button
                type="button"
                className={cx('menu-button')}
                onClick={() => {
                  setIsNavShown(!isNavShown)
                  if (isAutoplayRunning) {
                    return toggleAutoplay() // Calls the toggleAutoplay function
                  }
                }}
                aria-label="Toggle navigation"
                aria-controls={cx('rca-menu-wrapper')}
                aria-expanded={!isNavShown}
              >
                <div className={cx('menu-title')}>{'Awards Menu'}</div>
              </button>
            </div>
            <div className={cx('autoplay-button-wrapper')}>
              <div className={cx('image-wrapper')}>
                <div className={cx('menu-button')}>
                  <button
                    type="button"
                    className={cx('autoplay-icon')}
                    onClick={() => {
                      toggleAutoplay() // Calls the toggleAutoplay function
                      if (isNavShown) {
                        return setIsNavShown(!isNavShown) // Calls the toggleAutoplay function
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
      {/* RCA menu */}
      <div
        className={cx(['rca-menu-wrapper', isNavShown ? 'show' : undefined])}
      >
        <RCAFullMenu
          rcaDatabaseId={rcaDatabaseId}
          uri={uri}
          isNavShown={isNavShown}
          setIsNavShown={setIsNavShown}
        />
      </div>
    </>
  )
}
