import className from 'classnames/bind'
import styles from './TabsEditor.module.scss'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { LayoutGroup } from 'framer-motion'
// src/components/TabDays/TabDays.js
import React, { useState, useEffect } from 'react'
import { BACKEND_URL } from '../../constants/backendUrl'
let cx = className.bind(styles)

export default function TabsEditor({ tabsEditor, luxuryTravelClass }) {
  const [activeTab, setActiveTab] = useState('tab1')

  const [transformedContent1, setTransformedContent1] = useState('')

  const [transformedContent2, setTransformedContent2] = useState('')

  useEffect(() => {
    const extractImageData = (htmlContent) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')

      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)

      imageElements.forEach((img) => {
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt') || ''
        const width = img.getAttribute('width') || '500'
        const height = img.getAttribute('height') || '500'

        const imageComponent = (
          <Image
            src={src}
            alt={alt}
            width={parseInt(width, 10)}
            height={parseInt(height, 10)}
            style={{ objectFit: 'contain' }}
            priority
          />
        )

        const imageHtmlString = renderToStaticMarkup(imageComponent)
        img.outerHTML = imageHtmlString
      })

      return doc.body.innerHTML
    }

    // Transform content for both tabs
    if (tabsEditor) {
      const transformedTab1 = extractImageData(tabsEditor.tab1 || '')
      setTransformedContent1(transformedTab1)

      const transformedTab2 = extractImageData(tabsEditor.tab2 || '')
      setTransformedContent2(transformedTab2)
    }
  }, [tabsEditor])

  return (
    <div className={cx('component')}>
      <div
        className={
          luxuryTravelClass === 'luxuryTravelClass'
            ? 'tabs-container mx-auto max-w-[700px] sm:mx-0 sm:pl-[30px]'
            : 'tabs-container mx-auto max-w-[700px]'
        }
      >
        <div className="my-4 flex border-2 border-black">
          <button
            onClick={() => setActiveTab('tab1')}
            className={`flex-1 border px-4 py-2 ${
              activeTab === 'tab1'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'bg-[#f5f5f5] text-[#000000]'
            } rounded-l text-center`}
          >
            {tabsEditor?.tabTitle1}
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={`flex-1 border px-4 py-2 ${
              activeTab === 'tab2'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'bg-[#f5f5f5] text-[#000000]'
            } rounded-r text-center`}
          >
            {tabsEditor?.tabTitle2}
          </button>
        </div>
        <div className="p-4 text-left sm:px-0">
          {activeTab === 'tab1' && (
            <div
              className={cx('')}
              dangerouslySetInnerHTML={{ __html: transformedContent1 ?? '' }}
            />
          )}
          {activeTab === 'tab2' && (
            <div
              className={cx('')}
              dangerouslySetInnerHTML={{ __html: transformedContent2 ?? '' }}
            />
          )}
        </div>
        <div className="mb-4 flex border-2 border-black">
          <button
            onClick={() => setActiveTab('tab1')}
            className={`flex-1 border px-4 py-2 ${
              activeTab === 'tab1'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'bg-[#f5f5f5] text-[#000000]'
            } rounded-l text-center`}
          >
            {tabsEditor?.tabTitle1}
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={`flex-1 border px-4 py-2 ${
              activeTab === 'tab2'
                ? 'bg-[#000000] text-[#ffffff]'
                : 'bg-[#f5f5f5] text-[#000000]'
            } rounded-r text-center`}
          >
            {tabsEditor?.tabTitle2}
          </button>
        </div>
      </div>
    </div>
  )
}
