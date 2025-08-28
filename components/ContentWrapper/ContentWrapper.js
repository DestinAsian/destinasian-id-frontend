import className from 'classnames/bind'
import styles from './ContentWrapper.module.scss'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'

const cx = className.bind(styles)

export default function ContentWrapper({ content, children }) {
  const [transformedContent, setTransformedContent] = useState('')

  useEffect(() => {
    const extractHTMLData = () => {
      const parser = new DOMParser()
      const cleanedContent = content.replaceAll(
        'https://destinasian.co.id',
        'https://backend.destinasian.co.id'
      )
      const doc = parser.parseFromString(cleanedContent, 'text/html')

      const extractImagesRecursively = (node) => {
        if (
          node?.nodeType === 1 &&
          node.tagName === 'IMG' &&
          typeof node.getAttribute === 'function' &&
          node.getAttribute('src')?.includes(BACKEND_URL)
        ) {
          // Skip images inside .gallery
          if (node.closest('.gallery')) return

          // Skip if img has inline styles
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
          node.childNodes?.forEach(extractImagesRecursively)
        }
      }

      Array.from(doc.body.childNodes).forEach(extractImagesRecursively)

      const elements = Array.from(doc.body.childNodes).map((node, index) => {
        if (node?.nodeType === 1 && node?.matches('div.gallery')) {
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
      <div className={cx('content-wrapper')}>{transformedContent}</div>
      {children}
    </article>
  )
}