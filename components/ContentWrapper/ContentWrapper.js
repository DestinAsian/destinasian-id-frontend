import className from 'classnames/bind'
import styles from './ContentWrapper.module.scss'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import dynamic from 'next/dynamic'
const GallerySliderSingle = dynamic(() =>
  import('../../components/GallerySliderSingle/GallerySliderSingle'),
)

let cx = className.bind(styles)

export default function ContentWrapper({ content, children }) {
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

      // Handle Instagram blockquote
      const elements = Array.from(doc.body.childNodes).map((node, index) => {
        // Gallery Slider
        if (node?.nodeType === 1 && node?.matches('div.gallery')) {
          const gallerySlider = node

          return <GallerySliderSingle gallerySlider={gallerySlider} />
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

// import className from 'classnames/bind'
// import styles from './ContentWrapper.module.scss'
// import { renderToStaticMarkup } from 'react-dom/server'
// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import dynamic from 'next/dynamic'
// import { BACKEND_URL } from '../../constants/backendUrl'

// const GallerySlider = dynamic(() =>
//   import('../../components/GallerySlider/GallerySlider'),
// )

// let cx = className.bind(styles)

// export default function ContentWrapper({
//   content,
//   children,
// }) {
//   const [processedContent, setProcessedContent] = useState([])

//   useEffect(() => {
//     const parser = new DOMParser()

//     const doc = parser.parseFromString(content, 'text/html')
//     const bodyChildren = Array.from(doc.body.childNodes)

//     const finalElements = []

//     bodyChildren.forEach((node, index) => {
//       // Tangani elemen galeri
//       if (
//         node.nodeType === 1 &&
//         node.tagName === 'DIV' &&
//         node.id?.includes('gallery-')
//       ) {
//         const galleryImages = Array.from(node.querySelectorAll('img')).map(
//           (img) => {
//             const src = img.getAttribute('src')
//             const alt = img.getAttribute('alt') || ''

//             // Membuat caption untuk gambar
//             const caption = alt ? <figcaption>{alt}</figcaption> : null

//             return {
//               src,
//               alt,
//               caption: alt,
//             }
//           },
//         )

//         finalElements.push(
//           <GallerySlider
//             key={`gallery-${index}`}
//             gallerySlider={galleryImages}
//           />,
//         )
//         return
//       }

//       // Tangani gambar biasa
//       if (node.nodeType === 1 && node.tagName === 'IMG') {
//         const src = node.getAttribute('src')
//         const alt = node.getAttribute('alt') || 'Image'
//         const width = parseInt(node.getAttribute('width')) || 600
//         const height = parseInt(node.getAttribute('height')) || 400

//         finalElements.push(
//           <Image
//             key={`img-${index}`}
//             src={src}
//             alt={alt}
//             width={width}
//             height={height}
//             style={{ objectFit: 'contain' }}
//           />,
//         )
//         return
//       }

//       // Tangani elemen lain sebagai HTML biasa
//       if (node.nodeType === 1) {
//         finalElements.push(
//           <div
//             key={`html-${index}`}
//             dangerouslySetInnerHTML={{ __html: node.outerHTML }}
//           />,
//         )
//       }

//       // Tangani node teks langsung
//       if (node.nodeType === 3) {
//         finalElements.push(<p key={`text-${index}`}>{node.textContent}</p>)
//       }
//     })

//     setProcessedContent(finalElements)
//   }, [content])

//   return (
//     <article className={cx('component')}>
//       <div className={cx('content-wrapper')}>{processedContent}</div>
//       {children}
//     </article>
//   )
// }
