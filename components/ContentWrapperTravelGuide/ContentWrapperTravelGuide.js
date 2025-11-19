

'use client'

import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames/bind'
import styles from './ContentWrapperTravelGuide.module.scss'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'
import HalfPageGuides1 from '../../components/AdUnit/HalfPage1/HalfPageGuides1'

const cx = classNames.bind(styles)

export default function ContentWrapperTravelGuide({ content, children }) {
  const [nodes, setNodes] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const contentRef = useRef(null)
  const stickyRef = useRef(null)
  const stopRef = useRef(null)

  //  MOBILE DETECTION

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

//  STICKY SCROLL LOGIC – optimized
  useEffect(() => {
    let running = false

    const onScroll = () => {
      if (running) return
      running = true

      requestAnimationFrame(() => {
        const sticky = stickyRef.current
        const content = contentRef.current
        const stop = stopRef.current
        if (!sticky || !content || !stop) {
          running = false
          return
        }

        const stickyTop = 32
        const bannerHeight = 600

        const cRect = content.getBoundingClientRect()
        const sRect = stop.getBoundingClientRect()
        const maxY = sRect.top - bannerHeight - stickyTop

        if (cRect.top >= stickyTop) {
          sticky.style.position = 'static'
        } else if (maxY > 0) {
          sticky.style.position = 'fixed'
          sticky.style.top = `${stickyTop}px`
        } else {
          sticky.style.position = 'absolute'
          sticky.style.bottom = '0'
          sticky.style.top = 'unset'
        }

        running = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** ----------------------------------------------------
   * OPTIMIZED HTML TRANSFORM
   * - Single pass
   * - Replace IMG
   * - Dropcap
   * - Gallery detection
   * ---------------------------------------------------- */
  useEffect(() => {
    if (!content) return

    const parser = new DOMParser()

    // Fast domain fix
    const fixedHTML = content.replaceAll('https://destinasian.co.id', BACKEND_URL)

    const doc = parser.parseFromString(fixedHTML, 'text/html')
    const bodyNodes = [...doc.body.childNodes]

    const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/i

    const processNode = (node) => {
      if (node.nodeType !== 1) return

      // 1. DROP CAP
      if (node.tagName === 'P' && dropcapRegex.test(node.innerHTML)) {
        node.innerHTML = node.innerHTML.replace(
          dropcapRegex,
          (_, p1) => `<span class="dropcap">${p1.toUpperCase()}</span>`
        )
      }

      // 2. IMG → Next Image
      if (
        node.tagName === 'IMG' &&
        node.src.includes(BACKEND_URL) &&
        !node.closest('.gallery') &&
        !node.hasAttribute('style')
      ) {
        const src = node.getAttribute('src')
        const alt = node.getAttribute('alt') || 'Image'
        const width = node.getAttribute('width') || 800
        const height = node.getAttribute('height') || 600

        node.outerHTML = renderToStaticMarkup(
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit: 'contain' }}
            priority
          />
        )

        return
      }

      // Recursive children
      node.childNodes?.forEach(processNode)
    }

    bodyNodes.forEach(processNode)

// CREATE FINAL REACT ELEMENTS
    const final = bodyNodes.map((node, i) => {
      // Gallery
      if (node.nodeType === 1 && node.matches('div.gallery')) {
        return <GallerySlider key={`g-${i}`} gallerySlider={node} />
      }

      // Normal nodes
      return (
        <div
          key={`n-${i}`}
          dangerouslySetInnerHTML={{ __html: node.outerHTML }}
        />
      )
    })

    setNodes(final)
  }, [content])


  return (
    <article className={cx('component')}>
      <div className={cx('layout-wrapper')} ref={contentRef}>
        <div className={cx('content-wrapper')}>
          {nodes}
          {children}
          <div ref={stopRef} style={{ height: '1px' }} />

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