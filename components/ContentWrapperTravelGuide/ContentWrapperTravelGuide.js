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
  const [transformedContent, setTransformedContent] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const contentRef = useRef(null)
  const stickyRef = useRef(null)
  const stopRef = useRef(null)

  // Detect mobile screen
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleMediaChange = (e) => setIsMobile(e.matches)

    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!stickyRef.current || !contentRef.current || !stopRef.current) return

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sticky = stickyRef.current
          const content = contentRef.current
          const stop = stopRef.current

          const stickyTop = 32 // jarak dari atas
          const bannerHeight = 600 // tinggi banner fix
          const contentRect = content.getBoundingClientRect()
          const stopRect = stop.getBoundingClientRect()

          const maxTranslateY = stopRect.top - bannerHeight - stickyTop

          if (contentRect.top >= stickyTop) {
            // belum masuk area sticky
            sticky.style.position = 'static'
            sticky.style.top = 'unset'
            sticky.style.transform = 'none'
          } else if (maxTranslateY > 0) {
            // masih di area sticky → iklan fixed
            sticky.style.position = 'fixed'
            sticky.style.top = `${stickyTop}px`
            sticky.style.bottom = 'unset'
          } else {
            // sudah lewat batas → iklan absolute di bawah
            sticky.style.position = 'absolute'
            sticky.style.top = 'unset'
            sticky.style.bottom = '0'
          }

          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Transform HTML content: images, galleries, dropcaps
  useEffect(() => {
    const extractHTMLData = () => {
      const parser = new DOMParser()
      const cleanedContent = content.replaceAll(
        'https://destinasian.co.id',
        'https://backend.destinasian.co.id',
      )
      const doc = parser.parseFromString(cleanedContent, 'text/html')

      // Replace <img> with Next.js Image component
      const replaceImages = (node) => {
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

          const testDomain = 'https://destinasian.co.id'
          const newDomain = 'https://backend.destinasian.co.id'
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

          node.outerHTML = renderToStaticMarkup(imageComponent)
        } else {
          node.childNodes?.forEach(replaceImages)
        }
      }

      Array.from(doc.body.childNodes).forEach(replaceImages)

      // Handle dropcaps
      const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/gi
      const processDropcap = (node) => {
        if (
          node.nodeType === 1 &&
          node.tagName === 'P' &&
          node.innerHTML.includes('[dropcap]')
        ) {
          node.innerHTML = node.innerHTML.replace(
            dropcapRegex,
            (_, p1) => `<span class="dropcap">${p1.toUpperCase()}</span>`,
          )
        }
        node.childNodes?.forEach(processDropcap)
      }

      Array.from(doc.body.childNodes).forEach(processDropcap)

      // Convert gallery and normal nodes to React components
      const elements = Array.from(doc.body.childNodes).map((node, index) => {
        if (node.nodeType === 1 && node.matches('div.gallery')) {
          return <GallerySlider key={index} gallerySlider={node} />
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
