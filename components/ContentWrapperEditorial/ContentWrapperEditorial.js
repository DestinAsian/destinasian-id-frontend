'use client'

import className from 'classnames/bind'
import styles from './ContentWrapperEditorial.module.scss'
import Image from 'next/image'
import useSWR from 'swr'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'

const cx = className.bind(styles)

/* =========================
   SWR FETCHER (BROWSER ONLY)
========================= */
const parseContent = async (content) => {
  if (!content || typeof window === 'undefined') return []

  const parser = new DOMParser()

  const cleaned = content.replaceAll(
    'https://destinasian.co.id',
    BACKEND_URL
  )

  const doc = parser.parseFromString(cleaned, 'text/html')
  const nodes = [...doc.body.childNodes]

  return nodes.map((node, index) => {
    // GALLERY
    if (node.nodeType === 1 && node.classList.contains('gallery')) {
      return <GallerySlider key={`g-${index}`} gallerySlider={node} />
    }

    // IMG ROOT
    if (node.nodeType === 1 && node.tagName === 'IMG') {
      return renderConvertedImage(node, index)
    }

    // IMG INSIDE
    if (node.querySelector?.('img')) {
      convertImagesInside(node)
    }

    // DROPCAP
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
}

/* =========================
   COMPONENT
========================= */
export default function ContentWrapperEditorial({ content, children }) {
  const isBrowser = typeof window !== 'undefined'

  const { data: output = [] } = useSWR(
    isBrowser && content ? ['editorial', content] : null,
    () => parseContent(content),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 🔥 cache 1 menit
    }
  )

  return (
    <article className={cx('component')}>
      <div className={cx('with-slider-wrapper')}>
        <div className={cx('content-wrapper')}>{output}</div>
        {children}
      </div>
    </article>
  )
}

/* =========================
   HELPERS (UNCHANGED)
========================= */

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
    width: Number(img.getAttribute('width')) || 800,
    height: Number(img.getAttribute('height')) || 600,
  }
}

function convertImagesInside(node) {
  node.querySelectorAll('img').forEach((img) => {
    if (img.closest('.gallery')) return
    if (img.hasAttribute('style')) return

    const figure = document.createElement('figure')
    figure.className = 'figure'

    const { src, alt, width, height } = extractImageMeta(img)

    const imgEl = document.createElement('img')
    imgEl.src = src
    imgEl.alt = alt
    imgEl.width = width
    imgEl.height = height
    imgEl.style.objectFit = 'contain'

    figure.appendChild(imgEl)

    const caption = extractCaption(img)
    if (caption) {
      const cap = document.createElement('figcaption')
      cap.innerHTML = caption
      figure.appendChild(cap)
    }

    img.replaceWith(figure)
  })
}

function extractCaption(img) {
  const fig = img.closest('figure')
  const cap = fig?.querySelector('figcaption')
  if (cap) {
    const html = cap.innerHTML
    cap.remove()
    return html
  }
  return img.alt && img.alt !== 'Image' ? img.alt : ''
}

function applyDropcap(node) {
  node.innerHTML = node.innerHTML.replace(
    /\[dropcap\](.*?)\[\/dropcap\]/gi,
    (_, t) => `<span class="dropcap">${t.toUpperCase()}</span>`
  )
}
