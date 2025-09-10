'use client'

import className from 'classnames/bind'
import styles from './ContentWrapperEditorial.module.scss'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'

const cx = className.bind(styles)

export default function ContentWrapperEditorial({ content, children }) {
  const [transformedContent, setTransformedContent] = useState('')

  useEffect(() => {
    if (!content) return

    const parser = new DOMParser()
    const cleanedContent = content.replaceAll(
      'https://destinasian.co.id',
      '' // replace with backend domain if needed
    )

    const doc = parser.parseFromString(cleanedContent, 'text/html')

    // Recursive function to extract images and captions
    const extractImagesRecursively = (node) => {
      if (
        node?.nodeType === 1 &&
        node.tagName === 'IMG' &&
        node.getAttribute('src')?.includes(BACKEND_URL)
      ) {
        if (node.closest('.gallery')) return
        if (node.hasAttribute('style')) return

        let src = node.getAttribute('src') || ''
        let srcset = node.getAttribute('srcset') || ''
        const alt = node.getAttribute('alt') || 'Image'
        const width = node.getAttribute('width') || 800
        const height = node.getAttribute('height') || 600

        src = src.replace(BACKEND_URL, BACKEND_URL)
        srcset = srcset.replaceAll(BACKEND_URL, BACKEND_URL)

        // Check for figcaption
        let captionText = ''
        const figure = node.closest('figure')
        if (figure) {
          const figcaption = figure.querySelector('figcaption')
          if (figcaption) {
            captionText = figcaption.innerHTML
            figcaption.remove()
          }
        }
        if (!captionText && alt && alt.trim() !== 'Image') {
          captionText = alt
        }

        const imageComponent = (
          <figure className="figure">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              style={{ objectFit: 'contain' }}
              priority
            />
            {captionText && (
              <figcaption dangerouslySetInnerHTML={{ __html: captionText }} />
            )}
          </figure>
        )

        node.outerHTML = renderToStaticMarkup(imageComponent)
      } else {
        node?.childNodes?.forEach(extractImagesRecursively)
      }
    }

    Array.from(doc.body.childNodes).forEach(extractImagesRecursively)

    // Handle dropcap shortcode
    const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/gi
    const processDropcap = (node) => {
      if (node.nodeType === 1 && node.tagName === 'P' && node.innerHTML.includes('[dropcap]')) {
        node.innerHTML = node.innerHTML.replace(
          dropcapRegex,
          (_, p1) => `<span class="dropcap">${p1.toUpperCase()}</span>`
        )
      }
      node?.childNodes?.forEach(processDropcap)
    }
    Array.from(doc.body.childNodes).forEach(processDropcap)

    // Render elements
    const elements = Array.from(doc.body.childNodes).map((node, index) => {
      if (node?.nodeType === 1 && node?.matches('div.gallery')) {
        return <GallerySlider key={`gallery-${index}`} gallerySlider={node} />
      }
      return <div key={index} dangerouslySetInnerHTML={{ __html: node.outerHTML }} />
    })

    setTransformedContent(elements)
  }, [content])

  return (
    <article className={cx('component')}>
      <div className={cx('with-slider-wrapper')}>
        <div className={cx('content-wrapper')}>{transformedContent}</div>
        {children}
      </div>
    </article>
  )
}
