import { useEffect, useState, useRef } from 'react'
import className from 'classnames/bind'
import styles from './ContentWrapperTravelGuide.module.scss'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'
import HalfPageGuides1 from '../../components/AdUnit/HalfPage1/HalfPageGuides1'


let cx = className.bind(styles)

export default function ContentWrapperTravelGuide({ content, children }) {
  const [transformedContent, setTransformedContent] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const contentRef = useRef(null)
  const stickyRef = useRef(null)
  const stopRef = useRef(null)


  // NOTE: Perbaiki cara deteksi mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')

    const handleMediaChange = (e) => {
      setIsMobile(e.matches)
    }

    // Set awal
    setIsMobile(mediaQuery.matches)

    // Listener untuk perubahan ukuran layar
    mediaQuery.addEventListener('change', handleMediaChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current || !contentRef.current || !stopRef.current) return

      const sticky = stickyRef.current
      const content = contentRef.current
      const stop = stopRef.current

      const contentRect = content.getBoundingClientRect()
      const stopRect = stop.getBoundingClientRect()

      const maxTranslateY = stopRect.top - sticky.offsetHeight - 32 // 32 = top offset (2rem)
      const stickyTop = 32 // sticky top

      if (contentRect.top < stickyTop && maxTranslateY > stickyTop) {
        sticky.style.position = 'fixed'
        sticky.style.top = `${stickyTop}px`
      } else {
        sticky.style.position = 'static'
      }

      if (stopRect.top <= sticky.offsetHeight + stickyTop) {
        sticky.style.position = 'absolute'
        sticky.style.top = 'unset'
        sticky.style.bottom = '0'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const extractHTMLData = () => {
      const parser = new DOMParser()

      const cleanedContent = content.replaceAll(
        'https://test.destinasian.co.id',
        'https://testing.destinasian.co.id',
      )
      // const doc = parser.parseFromString(content, 'text/html')
      const doc = parser.parseFromString(cleanedContent, 'text/html')
      // Recursively extract all images and their captions
      const extractImagesRecursively = (node) => {
        if (
          typeof node === 'object' &&
          node.nodeType === 1 &&
          node.tagName === 'IMG' &&
          typeof node.getAttribute === 'function' &&
          node.getAttribute('src')?.includes(BACKEND_URL)
        ) {
          console.log('CONTENT RAW:', content)

          // Skip images inside .gallery-slider
          const insideGallerySlider = node.closest('.gallery')
          if (insideGallerySlider) return

          // Skip if img has inline styles
          const hasInlineStyle = node.hasAttribute('style')
          if (hasInlineStyle) return
          // if (node.hasAttribute('style')) return
          let src = node.getAttribute('src') || ''
          let srcset = node.getAttribute('srcset') || ''

          // const src = node.getAttribute('src')
          const alt = node.getAttribute('alt') || 'Image'
          const width = node.getAttribute('width') || 800
          const height = node.getAttribute('height') || 600

          const testDomain = 'https://test.destinasian.co.id'
          const newDomain = 'https://testing.destinasian.co.id'
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

          const imageHtmlString = renderToStaticMarkup(imageComponent)
          node.outerHTML = imageHtmlString
        } else {
          // Traverse child nodes
          node.childNodes?.forEach(extractImagesRecursively)
        }
      }

      // Process the content's root element to find all <img> nodes and replace them
      Array.from(doc.body.childNodes).forEach(extractImagesRecursively)

      const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/gi

      const processDropcap = (node) => {
        if (
          node.nodeType === 1 &&
          node.tagName === 'P' &&
          node.innerHTML.includes('[dropcap]')
        ) {
          node.innerHTML = node.innerHTML.replace(
            dropcapRegex,
            (match, p1) => `<span class="dropcap">${p1.toUpperCase()}</span>`,
          )
        }

        node.childNodes?.forEach(processDropcap)
      }

      Array.from(doc.body.childNodes).forEach(processDropcap)

      // Handle Instagram blockquote
      const elements = Array.from(doc.body.childNodes).map((node, index) => {
        // Gallery Slider
        if (node?.nodeType === 1 && node?.matches('div.gallery')) {
          const gallerySlider = node

          return <GallerySlider gallerySlider={gallerySlider} />
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