import React from 'react'
import styles from './GuideFitur.module.scss'
import classNames from 'classnames'

const GuideFitur = ({ guidesfitur }) => {
  if (!guidesfitur) return null

  // Collect valid guide items
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
  ].filter((item) => item.title && item.image && item.url)

  const itemCount = guideItems.length

  return (
    <div className={styles.guideFiturSection}>
      <h2 className={styles.sectionTitle}>
        Apa yang ingin Anda jelajahi terlebih dahulu?
      </h2>
      <div
        className={classNames(styles.guideFiturWrap, {
          [styles.threeMobile]: itemCount === 3,
          [styles.fourMobile]: itemCount === 4,
        })}
      >
        {guideItems.map((item, index) => (
          <a key={index} href={item.url} className={styles.guideFiturItem}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} />
              <div className={styles.titleOverlay}>{item.title}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default GuideFitur
