import classNames from 'classnames/bind'
import styles from './ContentWrapperPage.module.scss'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'

const cx = classNames.bind(styles)

export default function ContentWrapperPage({ content, children }) {
  const [transformedContent, setTransformedContent] = useState('')

  useEffect(() => {
    // Replace all images with Next.js <Image> for better performance
    const extractImageData = () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')

      // Select images pointing to backend URL
      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)

      imageElements.forEach((img) => {
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt') || 'Image'
        const width = img.getAttribute('width') || '500'
        const height = img.getAttribute('height') || '500'

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

        // Replace <img> with Next.js Image HTML string
        img.outerHTML = renderToStaticMarkup(imageComponent)
      })

      setTransformedContent(doc.body.innerHTML)
    }

    extractImageData()
  }, [content])

  return (
    <article className={cx('component')}>
      <div
        className={cx('content-wrapper')}
        dangerouslySetInnerHTML={{ __html: transformedContent }}
      />
      {children}
    </article>
  )
}
