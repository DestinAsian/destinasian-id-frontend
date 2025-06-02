import className from 'classnames/bind'
import styles from './ContentWrapperGuide.module.scss'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const GallerySlider = dynamic(() => import('../../components/GallerySlider/GallerySlider'))

import { BACKEND_URL } from '../../constants/backendUrl'

let cx = className.bind(styles)

export default function ContentWrapperGuide({ content, children }) {
  const [processedContent, setProcessedContent] = useState([])

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const finalElements = []

    const processNode = (node, index) => {
      // Instagram blockquote
      if (
        node.nodeType === 1 &&
        node.tagName === 'BLOCKQUOTE' &&
        node.getAttribute('data-instgrm-permalink')
      ) {
        const url = node.getAttribute('data-instgrm-permalink')
        const captioned = node.hasAttribute('data-instgrm-captioned')

        finalElements.push(
          <div
            key={`ig-${index}`}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <InstagramEmbed url={url} width={500} captioned={captioned} />
          </div>,
        )
        return
      }

      // Galeri (div id="gallery-...")
      if (
        node.nodeType === 1 &&
        node.tagName === 'DIV' &&
        node.id?.startsWith('gallery-')
      ) {
        finalElements.push(
          <GallerySlider key={`gallery-${index}`} gallerySlider={node} />,
        )
        return
      }

      // Gambar biasa (gunakan next/image dengan rasio 4:3)
      if (node.nodeType === 1 && node.tagName === 'IMG') {
        const src = node.getAttribute('src')
        const alt = node.getAttribute('alt') || 'Image'

        finalElements.push(
          <div
            key={`img-${index}`}
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '75%', // rasio 4:3
              marginBottom: '1rem',
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>,
        )
        return
      }

      // Node lain: render langsung sebagai HTML
      if (node.nodeType === 1) {
        finalElements.push(
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: node.outerHTML }}
          />,
        )
      }

      // Node teks biasa
      if (node.nodeType === 3 && node.textContent.trim() !== '') {
        finalElements.push(<p key={`text-${index}`}>{node.textContent}</p>)
      }
    }

    Array.from(doc.body.childNodes).forEach((node, i) => processNode(node, i))
    setProcessedContent(finalElements)
  }, [content])

  return (
    <article className={cx('component')}>
      <div className={cx('content-wrapper')}>{processedContent}</div>
      {children}
    </article>
  )
}
