import React, { useState, useEffect } from 'react'
import className from 'classnames/bind'
import styles from './GallerySliderSingle.module.scss'
import Image from 'next/image'
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg'

let cx = className.bind(styles)

export default function GallerySliderSingle({ gallerySlider }) {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!gallerySlider) return

    const processGalleryImages = (galleryNode) => {
      let imagesArray = []

      const extractImagesRecursively = (node) => {
        if (node.nodeType === 1 && node.tagName === 'IMG') {
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
            caption,
          })
        } else {
          Array.from(node.childNodes).forEach(extractImagesRecursively)
        }
      }

      extractImagesRecursively(galleryNode)
      return imagesArray
    }

    setImages(processGalleryImages(gallerySlider))
  }, [gallerySlider])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // return (
  //   <div className={cx('component', 'gallery-slider-wrapper')}>
  //     <div className={cx('slide-wrapper')}>
  //       <div className={cx('image-wrapper')}>
  //         {images[currentIndex] && (
  //           <Image
  //             src={images[currentIndex].src}
  //             alt={images[currentIndex].alt}
  //             fill
  //             priority
  //           />
  //         )}

  //         {images[currentIndex]?.caption && (
  //           <div className={cx('caption-wrapper')}>
  //             <div
  //               className={cx('caption')}
  //               dangerouslySetInnerHTML={{ __html: images[currentIndex].caption }}
  //             />
  //           </div>
  //         )}

  //         {/* Tombol Navigasi */}
  //         <button className={cx('custom-button', 'prev')} onClick={handlePrev}>
  //           <CgChevronLeft />
  //         </button>
  //         <button className={cx('custom-button', 'next')} onClick={handleNext}>
  //           <CgChevronRight />
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // )
  return (
    <div className={cx('swiperContainer')}>
      <div className={cx('gallery-slider-wrapper')}>
        <div className={cx('slideWrapper')}>
          <div className={cx('imageWrapper')}>
            {images[currentIndex] && (
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                priority
                className={cx('thumbnail')}
              />
            )}
  
            {images[currentIndex]?.caption && (
              <div className={cx('overlay')}>
                <div
                  className={cx('postTitle')}
                  dangerouslySetInnerHTML={{
                    __html: images[currentIndex].caption,
                  }}
                />
              </div>
            )}
  
            <button className={cx('customButton', 'prev')} onClick={handlePrev}>
              <CgChevronLeft />
            </button>
            <button className={cx('customButton', 'next')} onClick={handleNext}>
              <CgChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
}
