import classNames from 'classnames/bind'
import styles from './ContentWrapper.module.scss'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'
import GallerySlider from '../../components/GallerySlider/GallerySlider'

const cx = classNames.bind(styles)

export default function ContentWrapper({ content, children }) {
  const [output, setOutput] = useState([])

  useEffect(() => {
    if (!content) return

    const parser = new DOMParser()

    // Replace domain dalam satu langkah lebih cepat
    const cleaned = content.replaceAll(
      'https://destinasian.co.id',
      BACKEND_URL
    )

    const doc = parser.parseFromString(cleaned, 'text/html')
    const nodes = Array.from(doc.body.childNodes)

    const result = nodes.map((node, index) => {
      // Jika galeri
      if (node.nodeType === 1 && node.classList.contains('gallery')) {
        return <GallerySlider key={index} gallerySlider={node} />
      }

      // Jika IMG langsung di root
      if (node.nodeType === 1 && node.tagName === 'IMG') {
        return convertImage(node, index)
      }

      // Cek IMG secara child (1 level, cukup)
      if (node.querySelector?.('img')) {
        convertImagesInside(node)
      }

      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: node.outerHTML }}
        />
      )
    })

    setOutput(result)
  }, [content])

  return (
    <article className={cx('component')}>
      <div className={cx('content-wrapper')}>{output}</div>
      {children}
    </article>
  )
}

/** Convert IMG → Next/Image */
function convertImage(img, index) {
  let src = img.getAttribute('src') || ''
  const alt = img.getAttribute('alt') || 'Image'
  const width = parseInt(img.getAttribute('width')) || 800
  const height = parseInt(img.getAttribute('height')) || 600

  return (
    <Image
      key={index}
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}

/** Convert IMG inside node */
function convertImagesInside(node) {
  const imgs = node.querySelectorAll('img')

  imgs.forEach((img) => {
    if (img.closest('.gallery')) return

    const src = img.getAttribute('src')
    const alt = img.getAttribute('alt') || 'Image'
    const width = parseInt(img.getAttribute('width')) || 800
    const height = parseInt(img.getAttribute('height')) || 600

    // Replace <img> → <Image> string
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      <img 
        src="${src}" 
        alt="${alt}" 
        width="${width}" 
        height="${height}" 
        style="object-fit:contain"
      />
    `
    img.replaceWith(wrapper.firstChild)
  })
}
