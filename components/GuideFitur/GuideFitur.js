import React, { useEffect, useMemo, useState } from 'react'
import styles from './GuideFitur.module.scss'
import classNames from 'classnames'

const pickImageUrl = (imageField) => {
  if (!imageField) return ''
  if (typeof imageField === 'string') return imageField
  return imageField.mediaItemUrl || imageField.sourceUrl || ''
}

const normalizeUri = (url) => {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  try {
    if (trimmed.startsWith('http')) {
      const parsed = new URL(trimmed)
      return parsed.pathname || ''
    }
    return trimmed
  } catch {
    return trimmed
  }
}

export default function GuideFitur({ guidesfitur, fallbackImage }) {
  const [resolvedByUri, setResolvedByUri] = useState({})
  const safeGuides = guidesfitur || {}

  const guideItems = useMemo(
    () =>
      [
        {
          title: safeGuides.titleGuideFitur1,
          image: pickImageUrl(safeGuides.featureImageGuideFitur1),
          url: safeGuides.linkUrlGuideFitur1,
        },
        {
          title: safeGuides.titleGuideFitur2,
          image: pickImageUrl(safeGuides.featureImageGuideFitur2),
          url: safeGuides.linkUrlGuideFitur2,
        },
        {
          title: safeGuides.titleGuideFitur3,
          image: pickImageUrl(safeGuides.featureImageGuideFitur3),
          url: safeGuides.linkUrlGuideFitur3,
        },
        {
          title: safeGuides.titleGuideFitur4,
          image: pickImageUrl(safeGuides.featureImageGuideFitur4),
          url: safeGuides.linkUrlGuideFitur4,
        },
      ]
        .map((item) => ({
          ...item,
          title: typeof item.title === 'string' ? item.title.trim() : '',
          url: typeof item.url === 'string' ? item.url.trim() : '',
          image: typeof item.image === 'string' ? item.image.trim() : '',
          uri: normalizeUri(item.url),
        }))
        .filter((item) => item.title && item.url),
    [safeGuides],
  )

  const fallbackImageUrl =
    typeof fallbackImage === 'string' ? fallbackImage.trim() : ''

  const urisToResolve = useMemo(
    () =>
      guideItems
        .filter((item) => !item.image && item.uri)
        .map((item) => item.uri)
        .filter((uri, index, arr) => arr.indexOf(uri) === index),
    [guideItems],
  )

  useEffect(() => {
    let cancelled = false

    if (!urisToResolve.length) {
      setResolvedByUri({})
      return () => {
        cancelled = true
      }
    }

    const resolveImages = async () => {
      try {
        const res = await fetch('/api/guidefitur/resolve-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uris: urisToResolve }),
        })
        const json = await res.json()
        const map = json?.map && typeof json.map === 'object' ? json.map : {}

        if (!cancelled) setResolvedByUri(map)
      } catch {
        if (!cancelled) setResolvedByUri({})
      }
    }

    resolveImages()

    return () => {
      cancelled = true
    }
  }, [urisToResolve])

  if (!guideItems.length) return null

  return (
    <div className={styles.guideFiturSection}>
      <h2 className={styles.sectionTitle}>
        Apa yang ingin Anda jelajahi terlebih dahulu?
      </h2>
      <div
        className={classNames(styles.guideFiturWrap, {
          [styles.threeMobile]: guideItems.length === 3,
          [styles.fourMobile]: guideItems.length === 4,
        })}
      >
        {guideItems.map((item, index) => {
          const backendImage =
            item.image || resolvedByUri[item.uri] || fallbackImageUrl

          return (
            <a
              key={`${item.url}-${index}`}
              href={item.url}
              className={styles.guideFiturItem}
            >
              <div className={styles.imageWrapper}>
                {backendImage ? (
                  <img
                    src={backendImage}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={styles.imagePlaceholder} aria-hidden="true" />
                )}
                <div className={styles.titleOverlay}>{item.title}</div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
