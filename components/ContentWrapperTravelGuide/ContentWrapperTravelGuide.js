import className from 'classnames/bind'
import styles from './ContentWrapperTravelGuide.module.scss'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import dynamic from 'next/dynamic'
const GallerySlider = dynamic(() =>
  import('../../components/GallerySlider/GallerySlider'),
)

let cx = className.bind(styles)

export default function ContentWrapperTravelGuide({ content, children }) {
  const [transformedContent, setTransformedContent] = useState('')

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

      //  //  [dropcap]...[/dropcap]
      //  const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/gi

      //  const processDropcap = (node) => {
      //    if (
      //      node.nodeType === 1 && // ELEMENT_NODE
      //      node.tagName === 'P' &&
      //      node.innerHTML.includes('[dropcap]')
      //    ) {
      //      node.innerHTML = node.innerHTML.replace(
      //        dropcapRegex,
      //        '<span class="dropcap">$1</span>',
      //      )
      //    }
 
      //    node.childNodes?.forEach(processDropcap)
      //  }
 
       const dropcapRegex = /\[dropcap\](.*?)\[\/dropcap\]/gi

       const processDropcap = (node) => {
         if (
           node.nodeType === 1 &&
           node.tagName === 'P' &&
           node.innerHTML.includes('[dropcap]')
         ) {
           node.innerHTML = node.innerHTML.replace(
             dropcapRegex,
             (match, p1) =>
               `<span class="dropcap">${p1.toUpperCase()}</span>`
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
      <div className={cx('content-wrapper')}>{transformedContent}</div>

      {children}
    </article>
  )
}