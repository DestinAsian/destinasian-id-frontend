'use client'

import classNames from 'classnames/bind'
import styles from './ContentWrapperPage.module.scss'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import GallerySlider from '../../components/GallerySliderPage/GallerySliderPage'

const cx = classNames.bind(styles)

export default function ContentWrapperPage({ content, children }) {
  const [output, setOutput] = useState([])

  useEffect(() => {
    if (!content) return

    const parser = new DOMParser()

    // --- BERSIHKAN URL DOMAIN OPSIONAL ---
    const cleanedContent = content.replaceAll('https://destinasian.co.id', '')

    // --- PROSES SHORTCODE GALLERY WP ---
    const galleryFixed = cleanedContent.replace(
      /\[gallery.*?ids="(.*?)".*?\]/gi,
      (match, ids) => {
        const idArray = ids.split(',')
        return `<div class="gallery" data-ids="${idArray.join(',')}"></div>`
      }
    )

    // --- PROSES CAPTION WP ---
    const captionFixed = galleryFixed.replace(
      /\[caption.*?\](.*?)\[\/caption\]/gis,
      (_, inner) => inner
    )

    const doc = parser.parseFromString(captionFixed, 'text/html')
    const nodes = [...doc.body.childNodes]

    const processed = nodes.map((node, index) => {

      // 1) HANDLE GALLERY
      if (node.nodeType === 1 && node.classList.contains('gallery')) {
        return <GallerySlider key={`g-${index}`} gallerySlider={node} />
      }

      // 2) HANDLE ROOT IMG
      if (node.nodeType === 1 && node.tagName === 'IMG') {
        return renderConvertedImage(node, index)
      }

      // 3) HANDLE IMG DI DALAM NODE
      if (node.querySelector?.('img')) {
        convertImagesInside(node)
      }

      // 4) HANDLE DROPCAP
      if (node.innerHTML?.includes('[dropcap]')) {
        applyDropcap(node)
      }

      // 5) HANDLE IFRAME (Google Form, Maps, dll)
      if (node.nodeType === 1 && node.tagName === 'IFRAME') {
        return (
          <div
            key={index}
            className="iframe-wrapper"
            dangerouslySetInnerHTML={{ __html: node.outerHTML }}
          />
        )
      }

      // 6) HANDLE TEXT NODE (INI YANG HILANG SEBELUMNYA)
      if (node.nodeType === 3) {
        const text = node.textContent.trim()
        if (!text) return null
        return <p key={index}>{text}</p>
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
        <div className={cx('content-wrapper')}>
          {output}
        </div>
        {children}
      </div>
    </article>
  )
}

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
        <figcaption dangerouslySetInnerHTML={{ __html: caption }} />
      )}
    </figure>
  )
}

function extractImageMeta(img) {
  return {
    src: img.getAttribute('src') || '',
    alt: img.getAttribute('alt') || 'Image',
    width: parseInt(img.getAttribute('width')) || 800,
    height: parseInt(img.getAttribute('height')) || 600,
  }
}

function convertImagesInside(node) {
  const imgs = node.querySelectorAll('img')

  imgs.forEach((img) => {
    if (img.closest('.gallery')) return

    const figure = document.createElement('figure')
    figure.classList.add('figure')

    const { src, alt, width, height } = extractImageMeta(img)

    const imgEl = document.createElement('img')
    imgEl.src = src
    imgEl.alt = alt
    imgEl.width = width
    imgEl.height = height

    figure.appendChild(imgEl)

    const caption = extractCaption(img)
    if (caption) {
      const capEl = document.createElement('figcaption')
      capEl.innerHTML = caption
      figure.appendChild(capEl)
    }

    img.replaceWith(figure)
  })
}

function extractCaption(img) {
  let caption = ''

  const fig = img.closest('figure')
  if (fig) {
    const cap = fig.querySelector('figcaption')
    if (cap) caption = cap.innerHTML
  }

  if (!caption && img.alt && img.alt !== 'Image') caption = img.alt

  return caption
}

function applyDropcap(node) {
  const regex = /\[dropcap\](.*?)\[\/dropcap\]/gi
  node.innerHTML = node.innerHTML.replace(
    regex,
    (_, text) => `<span class="dropcap">${text.toUpperCase()}</span>`
  )
}
