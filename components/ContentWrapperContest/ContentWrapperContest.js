'use client'

import className from 'classnames/bind'
import styles from './ContentWrapperContest.module.scss'
import { useEffect, useState, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'
import HalfPageGuides1 from '../../components/AdUnit/HalfPage1/HalfPageGuides1'

const cx = className.bind(styles)

export default function ContentWrapperContest({ content, children }) {
  const [transformedContent, setTransformedContent] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const contentRef = useRef(null)
  const stickyRef = useRef(null)
  const stopRef = useRef(null)

  // DETEKSI MOBILE
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setIsMobile(e.matches)
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // STICKY ADS
  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current || !contentRef.current || !stopRef.current) return

      const sticky = stickyRef.current
      const content = contentRef.current
      const stop = stopRef.current

      const stickyTop = 32
      const stickyHeight = sticky.offsetHeight
      const contentRect = content.getBoundingClientRect()
      const stopRect = stop.getBoundingClientRect()
      const maxTranslateY = stopRect.top - stickyHeight - stickyTop

      if (contentRect.top < stickyTop && maxTranslateY > stickyTop) {
        sticky.style.position = 'fixed'
        sticky.style.top = `${stickyTop}px`
        sticky.style.bottom = 'unset'
      } else if (stopRect.top <= stickyHeight + stickyTop) {
        sticky.style.position = 'absolute'
        sticky.style.top = 'unset'
        sticky.style.bottom = '0'
      } else {
        sticky.style.position = 'static'
        sticky.style.top = 'unset'
        sticky.style.bottom = 'unset'
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // TRANSFORM HTML CONTENT (IMAGES + DROPCAP + GALLERY)
  useEffect(() => {
    if (!content) return

    const parser = new DOMParser()
    const cleanedContent = content.replaceAll(
      'https://destinasian.co.id',
      'https://backend.destinasian.co.id'
    )
    const doc = parser.parseFromString(cleanedContent, 'text/html')

    const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/gi

    // traversal sekaligus untuk img & dropcap
    const traverseNode = (node) => {
      if (!node || node.nodeType !== 1) return

      // REPLACE <IMG> biasa (bukan gallery)
      if (node.tagName === 'IMG' && node.getAttribute('src')?.includes(BACKEND_URL)) {
        if (!node.closest('.gallery') && !node.hasAttribute('style')) {
          let src = node.getAttribute('src') || ''
          let srcset = node.getAttribute('srcset') || ''
          const alt = node.getAttribute('alt') || 'Image'
          const width = node.getAttribute('width') || 800
          const height = node.getAttribute('height') || 600

          src = src.replace('https://destinasian.co.id', BACKEND_URL)
          srcset = srcset.replaceAll('https://destinasian.co.id', BACKEND_URL)

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
          node.outerHTML = renderToStaticMarkup(imageComponent)
          return
        }
      }

      // PROCESS DROPCAP
      if (node.tagName === 'P' && node.innerHTML.includes('[dropcap]')) {
        node.innerHTML = node.innerHTML.replace(dropcapRegex, (_, p1) => {
          return `<span class="dropcap">${p1.toUpperCase()}</span>`
        })
      }

      node.childNodes?.forEach(traverseNode)
    }

    Array.from(doc.body.childNodes).forEach(traverseNode)

    // RENDER KE REACT
    const elements = Array.from(doc.body.childNodes).map((node, index) => {
      if (node.nodeType === 1 && node.matches('div.gallery')) {
        return <GallerySlider key={`gallery-${index}`} gallerySlider={node} />
      }
      return <div key={`content-${index}`} dangerouslySetInnerHTML={{ __html: node.outerHTML }} />
    })

    setTransformedContent(elements)
  }, [content])

  return (
    <article className={cx('component')}>
      <div className={cx('layout-wrapper')} ref={contentRef}>
        <div className={cx('content-wrapper')}>
          {transformedContent}
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
