'use client'

import className from 'classnames/bind'
import styles from './ContentWrapperEditorial.module.scss'

import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'

let cx = className.bind(styles)

export default function ContentWrapperEditorial({ content, children }) {
  const [transformedContent, setTransformedContent] = useState('')

  useEffect(() => {
    const extractHTMLData = () => {
      const parser = new DOMParser()

      // Bersihkan domain
      const cleanedContent = content.replaceAll(
        'https://destinasian.co.id',
        // 'https://backend.destinasian.co.id'
      )

      const doc = parser.parseFromString(cleanedContent, 'text/html')

      // === FUNGSI REKURSIF UNTUK IMG + CAPTION ===
      const extractImagesRecursively = (node) => {
        if (
          typeof node === 'object' &&
          node.nodeType === 1 &&
          node.tagName === 'IMG' &&
          typeof node.getAttribute === 'function' &&
          node.getAttribute('src')?.includes(BACKEND_URL)
        ) {
          // Skip jika ada di dalam gallery
          if (node.closest('.gallery')) return

          // Skip jika ada inline style
          if (node.hasAttribute('style')) return

          let src = node.getAttribute('src') || ''
          let srcset = node.getAttribute('srcset') || ''
          const alt = node.getAttribute('alt') || 'Image'
          const width = node.getAttribute('width') || 800
          const height = node.getAttribute('height') || 600

          const testDomain = 'https://backend.destinasian.co.id'
          const newDomain = 'https://backend.destinasian.co.id'
          src = src.replace(testDomain, newDomain)
          srcset = srcset.replaceAll(testDomain, newDomain)


          console.log('[IMG FOUND]', {
            src,
            srcset,
            alt,
            width,
            height
          })
      

          // Cek kalau parent figure punya caption
          let captionText = ''
          const figure = node.closest('figure')
          if (figure) {
            const figcaption = figure.querySelector('figcaption')
            if (figcaption) {
              captionText = figcaption.innerHTML
              figcaption.remove()
            }
          }

          // Kalau nggak ada figcaption, fallback ke alt
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

          const imageHtmlString = renderToStaticMarkup(imageComponent)
          node.outerHTML = imageHtmlString
        } else {
          node.childNodes?.forEach(extractImagesRecursively)
        }
      }

      Array.from(doc.body.childNodes).forEach(extractImagesRecursively)

      // === PROSES DROP CAP ===
      const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/gi
      const processDropcap = (node) => {
        if (
          node.nodeType === 1 &&
          node.tagName === 'P' &&
          node.innerHTML.includes('[dropcap]')
        ) {
          node.innerHTML = node.innerHTML.replace(
            dropcapRegex,
            (match, p1) => `<span class="dropcap">${p1.toUpperCase()}</span>`
          )
        }
        node.childNodes?.forEach(processDropcap)
      }
      Array.from(doc.body.childNodes).forEach(processDropcap)

      // === RENDER KONTEN ===
      const elements = Array.from(doc.body.childNodes).map((node, index) => {
        if (node?.nodeType === 1 && node?.matches('div.gallery')) {
          return <GallerySlider key={`gallery-${index}`} gallerySlider={node} />
        }
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: node.outerHTML }}
          />
        )
      })

      setTransformedContent(elements)
    }

    extractHTMLData()
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
