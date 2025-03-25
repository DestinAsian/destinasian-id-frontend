import { gql } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './ModuleAd.module.scss'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'

let cx = classNames.bind(styles)

function hasImgTag(content) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')
  const imgTags = doc.getElementsByTagName('img')
  return imgTags.length > 0
}

export default function ModuleAd({ bannerAd }) {
  // Check if `bannerAd` is empty or does not contain an <img> tag
  const isComponentHidden = !bannerAd || !hasImgTag(bannerAd)

  const [transformedBannerAd, setTransformedBannerAd] = useState('')

  useEffect(() => {
    // Function to extract image data and replace <img> with <Image>
    const extractImageData = () => {
      // Create a DOMParser
      const parser = new DOMParser()

      // Parse the HTML content
      const doc = parser.parseFromString(bannerAd, 'text/html')

      // Get only image elements with src containing BACKEND_URL
      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)

      // Replace <img> elements with <Image> components
      imageElements.forEach((img) => {
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        const width = img.getAttribute('width')
        const height = img.getAttribute('height')

        // Create Image component
        const imageComponent = (
          <Image
            src={src}
            alt={alt}
            width={width ? width : '500'}
            height={height ? height : '500'}
            style={{ objectFit: 'contain' }}
            priority
          />
        )

        // Render the Image component to HTML string
        const imageHtmlString = renderToStaticMarkup(imageComponent)

        // Replace the <img> element with the Image HTML string in the HTML content
        img.outerHTML = imageHtmlString
      })

      // Set the transformed HTML content
      setTransformedBannerAd(doc.body.innerHTML)
    }

    // Call the function to extract image data and replace <img>
    extractImageData()
  }, [bannerAd])

  return (
    <div className={cx('component', isComponentHidden ? 'hide-component' : '')}>
      <div className={cx('banner-wrapper')}>
        <div className={cx('ad-container')}>
          {bannerAd && (
            // Render bannerAd only when it's not empty and not 'no banners'
            <div
              className={cx('ad-content')}
              dangerouslySetInnerHTML={{
                __html: transformedBannerAd,
              }}
            ></div>
          )}
        </div>

        <div className={cx('border-bottom')}></div>
      </div>
    </div>
  )
}

ModuleAd.fragments = {
  entry: gql`
    fragment ModuleAdFragment on RootQueryToBannerAdConnection {
      edges {
        node {
          content
          title
        }
      }
    }
  `,
}
