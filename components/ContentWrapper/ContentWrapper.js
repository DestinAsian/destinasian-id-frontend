import className from 'classnames/bind'
import styles from './ContentWrapper.module.scss'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { GallerySlider } from '../../components'
import { BACKEND_URL } from '../../constants/backendUrl'

let cx = className.bind(styles)

export default function ContentWrapper({ content, children, single, tags, backIssue }) {
  const [processedContent, setProcessedContent] = useState([])

  useEffect(() => {



    const parser = new DOMParser()

    
    const doc = parser.parseFromString(content, 'text/html')
    const bodyChildren = Array.from(doc.body.childNodes)

    const finalElements = []

    bodyChildren.forEach((node, index) => {
      // Tangani elemen galeri
      if (node.nodeType === 1 && node.tagName === 'DIV' && node.id?.includes('gallery-')) {
        const galleryImages = Array.from(node.querySelectorAll('img')).map((img) => {
          const src = img.getAttribute('src')
          const alt = img.getAttribute('alt') || ''

          // Membuat caption untuk gambar
          const caption = alt ? <figcaption>{alt}</figcaption> : null

          return {
            src,
            alt,
            caption: alt,
          }
        })

        finalElements.push(
          <GallerySlider key={`gallery-${index}`} gallerySlider={galleryImages} backIssue={backIssue} />
        )
        return
      }

      // Tangani gambar biasa
      if (node.nodeType === 1 && node.tagName === 'IMG') {
        const src = node.getAttribute('src')
        const alt = node.getAttribute('alt') || 'Image'
        const width = parseInt(node.getAttribute('width')) || 600
        const height = parseInt(node.getAttribute('height')) || 400

        finalElements.push(
          <Image
            key={`img-${index}`}
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit: 'contain' }}
          />
        )
        return
      }

      // Tangani elemen lain sebagai HTML biasa
      if (node.nodeType === 1) {
        finalElements.push(
          <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: node.outerHTML }} />
        )
      }

      // Tangani node teks langsung
      if (node.nodeType === 3) {
        finalElements.push(
          <p key={`text-${index}`}>{node.textContent}</p>
        )
      }
    })

    setProcessedContent(finalElements)
  }, [content])

  return (
    <article className={cx('component')}>
      <div className={cx('content-wrapper')}>
        {processedContent}
      </div>
      {children}
    </article>
  )
}
