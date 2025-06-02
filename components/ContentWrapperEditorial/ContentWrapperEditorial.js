import className from 'classnames/bind'
import styles from './ContentWrapperEditorial.module.scss'
import dynamic from 'next/dynamic'

const SingleEditorialSlider = dynamic(() => import('../SingleEditorialSlider/SingleEditorialSlider'))
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'

let cx = className.bind(styles)

export default function ContentWrapperEditorial({ content, children, images }) {
  const [transformedContent, setTransformedContent] = useState('')

  useEffect(() => {
    // Function to extract image data and replace <img> with <Image>
    const extractImageData = () => {
      // Create a DOMParser
      const parser = new DOMParser()

      // Parse the HTML content
      const doc = parser.parseFromString(content, 'text/html')

      // Get only image elements with src containing BACKEND_URL
      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)

      // Replace <img> elements with <Image> components
      imageElements.forEach((img) => {
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        const width = img.getAttribute('width')
        const height = img.getAttribute('height')

        // Create Image component
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

        // Render the Image component to HTML string
        const imageHtmlString = renderToStaticMarkup(imageComponent)

        // Replace the <img> element with the Image HTML string in the HTML content
        img.outerHTML = imageHtmlString
      })

      // Set the transformed HTML content
      setTransformedContent(doc.body.innerHTML)
    }

    // Call the function to extract image data and replace <img>
    extractImageData()
  }, [content])

  return (
    <article className={cx('component')}>
      {images[0] != null && (
        <div className={cx('with-slider-wrapper')}>
          <SingleEditorialSlider images={images} />
          <div
            className={cx('content-wrapper')}
            dangerouslySetInnerHTML={{ __html: transformedContent ?? '' }}
          />
          {children}
        </div>
      )}

      {images[0] == null && (
        <div className={cx('with-slider-wrapper')}>
          <div
            className={cx('content-wrapper')}
            dangerouslySetInnerHTML={{ __html: transformedContent ?? '' }}
          />
          {children}
        </div>
      )}
    </article>
  )
}
