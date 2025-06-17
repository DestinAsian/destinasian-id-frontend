import className from 'classnames/bind'
import styles from './ContentWrapperEditorial.module.scss'
import dynamic from 'next/dynamic'

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
      const parser = new DOMParser()

      // Ganti domain test ke testing
      const cleanedContent = content.replaceAll(
        'https://test.destinasian.co.id',
        'https://testing.destinasian.co.id'
      )

      const doc = parser.parseFromString(cleanedContent, 'text/html')

      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)

      imageElements.forEach((img) => {
        let src = img.getAttribute('src')
        let srcset = img.getAttribute('srcset') || ''
        const alt = img.getAttribute('alt') || 'Image'
        const width = img.getAttribute('width') || '500'
        const height = img.getAttribute('height') || '500'

        // Replace domain in src & srcset if needed
        const testDomain = 'https://test.destinasian.co.id'
        const newDomain = 'https://testing.destinasian.co.id'
        src = src.replace(testDomain, newDomain)
        srcset = srcset.replaceAll(testDomain, newDomain)

        const imageComponent = (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
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
  }, [content])

  return (
    <article className={cx('component')}>
      {images[0] != null && (
        <div className={cx('with-slider-wrapper')}>
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
