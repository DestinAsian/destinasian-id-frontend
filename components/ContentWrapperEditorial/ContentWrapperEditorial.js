'use client'

import className from 'classnames/bind'
import styles from './ContentWrapperEditorial.module.scss'
import dynamic from 'next/dynamic'

import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'

let cx = className.bind(styles)

export default function ContentWrapperEditorial({ content, children, images }) {
  const [transformedContent, setTransformedContent] = useState('')

  useEffect(() => {
    const extractImageData = () => {
      const parser = new DOMParser()

      const cleanedContent = content.replaceAll(
        'https://test.destinasian.co.id',
        'https://testing.destinasian.co.id'
      )

      const doc = parser.parseFromString(cleanedContent, 'text/html')

      // === REPLACE <img> DENGAN <Image /> ===
      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)
      imageElements.forEach((img) => {
        let src = img.getAttribute('src')
        let srcset = img.getAttribute('srcset') || ''
        const alt = img.getAttribute('alt') || 'Image'
        const width = img.getAttribute('width') || '500'
        const height = img.getAttribute('height') || '500'

        // Replace domain
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
        img.outerHTML = imageHtmlString
      })

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

      // Simpan hasil ke state
      setTransformedContent(doc.body.innerHTML)
    }

    extractImageData()
  }, [content])

  return (
    <article className={cx('component')}>
      <div className={cx('with-slider-wrapper')}>
        <div
          className={cx('content-wrapper')}
          dangerouslySetInnerHTML={{ __html: transformedContent ?? '' }}
        />
        {children}
      </div>
    </article>
  )
}
