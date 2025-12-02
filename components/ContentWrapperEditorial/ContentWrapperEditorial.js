'use client'

import className from 'classnames/bind'
import styles from './ContentWrapperEditorial.module.scss'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'

const cx = className.bind(styles)

export default function ContentWrapperEditorial({ content, children }) {
  const [output, setOutput] = useState([])

  useEffect(() => {
    if (!content) return

    const parser = new DOMParser()

    // Domain replace (lebih ringan)
    const cleaned = content.replaceAll(
      'https://destinasian.co.id',
      BACKEND_URL
    )

    const doc = parser.parseFromString(cleaned, 'text/html')
    const nodes = [...doc.body.childNodes]

    const processed = nodes.map((node, index) => {
      // 1) === HANDLE GALLERY
      if (node.nodeType === 1 && node.classList.contains('gallery')) {
        return <GallerySlider key={`g-${index}`} gallerySlider={node} />
      }

      // 2) === HANDLE IMG DI ROOT
      if (node.nodeType === 1 && node.tagName === 'IMG') {
        return renderConvertedImage(node, index)
      }

      // 3) === HANDLE IMG DI DALAM NODE (1 level cek cukup)
      if (node.querySelector?.('img')) {
        convertImagesInside(node)
      }

      // 4) === HANDLE DROPCAP (lebih cepat)
      if (node.innerHTML?.includes('[dropcap]')) {
        applyDropcap(node)
      }

      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: node.outerHTML }}
        />
      )
    })

    setOutput(processed)
  }, [content])

  return (
    <article className={cx('component')}>
      <div className={cx('with-slider-wrapper')}>
        <div className={cx('content-wrapper')}>{output}</div>
        {children}
      </div>
    </article>
  )
}

    // FUNCTION: CONVERT IMG (BISA + CAPTION)
function renderConvertedImage(img, index) {
  const { src, alt, width, height } = extractImageMeta(img)

  const caption = extractCaption(img)

  return (
    <figure key={index} className="figure">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit: 'contain' }}
        priority
      />
      {caption && (
        <figcaption
          dangerouslySetInnerHTML={{ __html: caption }}
        />
      )}
    </figure>
  )
}

    // FUNCTION: EXTRACT IMG PROPERTIES
function extractImageMeta(img) {
  return {
    src: img.getAttribute('src') || '',
    alt: img.getAttribute('alt') || 'Image',
    width: parseInt(img.getAttribute('width')) || 800,
    height: parseInt(img.getAttribute('height')) || 600,
  }
}

    // FUNCTION: CONVERT IMG DI DALAM NODE
function convertImagesInside(node) {
  const imgs = node.querySelectorAll('img')

  imgs.forEach((img) => {
    if (img.closest('.gallery')) return
    if (img.hasAttribute('style')) return

    const figure = document.createElement('figure')
    figure.classList.add('figure')

    const { src, alt, width, height } = extractImageMeta(img)

    const imgElement = document.createElement('img')
    imgElement.src = src
    imgElement.alt = alt
    imgElement.width = width
    imgElement.height = height
    imgElement.style.objectFit = 'contain'

    figure.appendChild(imgElement)

    const caption = extractCaption(img)
    if (caption) {
      const captionEl = document.createElement('figcaption')
      captionEl.innerHTML = caption
      figure.appendChild(captionEl)
    }

    img.replaceWith(figure)
  })
}

    // FUNCTION: EXTRACT CAPTION (FIGURE OR ALT)
function extractCaption(img) {
  let caption = ''

  const fig = img.closest('figure')
  if (fig) {
    const cap = fig.querySelector('figcaption')
    if (cap) {
      caption = cap.innerHTML
      cap.remove()
    }
  }

  if (!caption && img.alt && img.alt !== 'Image') {
    caption = img.alt
  }

  return caption
}

    // FUNCTION: DROPCAP PROCESSOR
function applyDropcap(node) {
  const regex = /\[dropcap\](.*?)\[\/dropcap\]/gi
  node.innerHTML = node.innerHTML.replace(
    regex,
    (_, text) => `<span class="dropcap">${text.toUpperCase()}</span>`
  )
}
