'use client'

import className from 'classnames/bind'
import styles from './ContentWrapperLuxuryTravel.module.scss'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { renderToStaticMarkup } from 'react-dom/server'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySliderPage/GallerySliderPage'
import HalfPageGuides1 from '../../components/AdUnit/HalfPage1/HalfPageGuides1'

let cx = className.bind(styles)

export default function ContentWrapperLuxuryTravel({ content, children }) {
  const [output, setOutput] = useState([])
  const [isMobile, setIsMobile] = useState(false)

  const contentRef = useRef(null)
  const stickyRef = useRef(null)
  const stopRef = useRef(null)

  /* ============================================================
    1) RESPONSIVE CHECK (super ringan)
  ============================================================ */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* ============================================================
    2) SUPER LIGHTWEIGHT STICKY ADS
  ============================================================ */
  useEffect(() => {
    const handleScroll = () => {
      const sticky = stickyRef.current
      const wrapper = contentRef.current
      const stop = stopRef.current
      if (!sticky || !wrapper || !stop) return

      const STICKY_TOP = 32
      const ADS_HEIGHT = 600 // penting untuk smoothing
      const pageTop = wrapper.getBoundingClientRect().top
      const stopTop = stop.getBoundingClientRect().top

      // ===== CONDITION 1: Normal Static (belum masuk area sticky)
      if (pageTop > STICKY_TOP) {
        sticky.style.position = 'static'
        sticky.style.top = 'unset'
        sticky.style.bottom = 'unset'
        return
      }

      // ===== CONDITION 2: Sticky Fixed (bergerak mulus)
      if (stopTop > ADS_HEIGHT + STICKY_TOP) {
        sticky.style.position = 'fixed'
        sticky.style.top = `${STICKY_TOP}px`
        sticky.style.bottom = 'unset'
        return
      }

      // ===== CONDITION 3: Stop tepat di akhir area
      sticky.style.position = 'absolute'
      sticky.style.top = 'unset'
      sticky.style.bottom = '0'
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ============================================================
    3) PROCESS HTML → GALLERY + IMAGES (super cepat)
  ============================================================ */
  useEffect(() => {
    const parser = new DOMParser()
    const cleaned = content.replaceAll('https://destinasian.co.id', BACKEND_URL)
    const doc = parser.parseFromString(cleaned, 'text/html')

    const processNode = (node) => {
      // ========= 3A. GALLERY =========
      if (node.nodeType === 1 && node.matches('div.gallery')) {
        return <GallerySlider gallerySlider={node} />
      }

      // ========= 3B. SINGLE IMAGES =========
      if (node.nodeType === 1 && node.tagName === 'IMG') {
        if (node.closest('.gallery')) return null
        if (node.hasAttribute('style')) return null

        const src = node.src || ''
        const alt = node.alt || ''
        const width = Number(node.width) || 800
        const height = Number(node.height) || 600

        const imgComponent = (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority
            style={{ objectFit: 'contain' }}
          />
        )

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: renderToStaticMarkup(imgComponent),
            }}
          />
        )
      }

      // ========= 3C. DROPCAP =========
      if (
        node.nodeType === 1 &&
        node.tagName === 'P' &&
        node.innerHTML.includes('[dropcap]')
      ) {
        node.innerHTML = node.innerHTML.replace(
          /\[dropcap\](.*?)\[\/dropcap\]/gi,
          (_, p1) => `<span class="dropcap">${p1}</span>`,
        )
      }

      return <div dangerouslySetInnerHTML={{ __html: node.outerHTML }} />
    }

    const elements = Array.from(doc.body.childNodes).map(processNode)
    setOutput(elements)
  }, [content])

  /* ============================================================
    4) RENDER UI
  ============================================================ */
  return (
    <article className={cx('component')}>
      <div className={cx('layout-wrapper')} ref={contentRef}>
        <div className={cx('content-wrapper')}>
          {output}
          {children}

          <div ref={stopRef} style={{ height: 1 }} />

          {isMobile && (
            <div className={cx('ads-mobile')}>
              <HalfPageGuides1 />
            </div>
          )}
        </div>

        {!isMobile && (
          <aside className={cx('ads-wrapper')}>
            <div className={cx('sticky-ads')} ref={stickyRef}>
              <HalfPageGuides1 />
            </div>
          </aside>
        )}
      </div>
    </article>
  )
}
