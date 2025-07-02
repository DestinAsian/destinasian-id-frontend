import React from 'react'
import styles from './GuideFitur.module.scss'

const GuideFitur = ({ guidesfitur }) => {
  if (!guidesfitur) return null

  const guideItems = [
    {
      title: guidesfitur.titleGuideFitur1,
      image: guidesfitur.featureImageGuideFitur1?.mediaItemUrl,
      url: guidesfitur.linkUrlGuideFitur1,
    },
    {
      title: guidesfitur.titleGuideFitur2,
      image: guidesfitur.featureImageGuideFitur2?.mediaItemUrl,
      url: guidesfitur.linkUrlGuideFitur2,
    },
    {
      title: guidesfitur.titleGuideFitur3,
      image: guidesfitur.featureImageGuideFitur3?.mediaItemUrl,
      url: guidesfitur.linkUrlGuideFitur3,
    },
    {
      title: guidesfitur.titleGuideFitur4,
      image: guidesfitur.featureImageGuideFitur4?.mediaItemUrl,
      url: guidesfitur.linkUrlGuideFitur4,
    },
  ]

  return (
    <div className={styles.guideFiturWrap}>
      {guideItems.map(
        (item, index) =>
          item.title &&
          item.image &&
          item.url && (
            <a
              key={index}
              href={item.url}
              className={styles.guideFiturItem}
            >
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.title} />
                <div className={styles.titleOverlay}>{item.title}</div>
              </div>
            </a>
          ),
      )}
    </div>
  )
}

export default GuideFitur
