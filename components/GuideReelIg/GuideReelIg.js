// import React from 'react'
// import styles from './GuideReelIg.module.scss'
// import classNames from 'classnames/bind'

// const cx = classNames.bind(styles)
// const GuideReelIg = ({ guideReelIg }) => {
//   if (!guideReelIg) return null

//   const {
//     titleReelIg,
//     contentReelIg,
//     videoReelIg1,
//     ReelGuideIg1,
//     linkUrlReelIg1,
//     bannerReelIg2,
//     linkUrlBannerReelIg2,
//     ReelGuideIg2,
//     linkUrlReelIg2,
//   } = guideReelIg

//   return (
//     <div className={styles.guideReelIgWrap}>
//       {titleReelIg && (
//       <div
//         className={cx('titleWrapper')}
//         dangerouslySetInnerHTML={{ __html: titleReelIg }}
//       />
//     )}

//     {contentReelIg && (
//       <div
//         className={cx('contentWrapper')}
//         dangerouslySetInnerHTML={{ __html: contentReelIg }}
//       />
//     )}

//       {/* Bagian Atas */}
//       <div className={styles.topSection}>
//         <div className={styles.leftReel}>
//           {ReelGuideIg1?.mediaItemUrl && (
//               <div
//               className={styles.leftReel}
//               dangerouslySetInnerHTML={{ __html: ReelGuideIg1 }}
//             />
//           )}
//         </div>
//         {/* <div className={styles.leftReel}>
//           {ReelGuideIg1?.mediaItemUrl && (
//             <a href={linkUrlReelIg1}>
//               <img
//                 src={ReelGuideIg1.mediaItemUrl}
//                 alt="Guide Reel Left"
//               />
//             </a>
//           )}
//         </div> */}
//         <div className={styles.rightVideo}>
//           {videoReelIg1 && (
//             <div
//               className={styles.videoContent}
//               dangerouslySetInnerHTML={{ __html: videoReelIg1 }}
//             />
//           )}
//         </div>
//       </div>

//       {/* Bagian Bawah */}
//       <div className={styles.bottomSection}>
//         {/* <div className={styles.leftBanner}>
//           {bannerReelIg2 && (
//             <div
//             className={styles.leftBanner}
//             dangerouslySetInnerHTML={{ __html: bannerReelIg2 }}
//           />
//           )}
//         </div> */}
//         <div className={styles.leftBanner}>
//           {bannerReelIg2?.mediaItemUrl && (
//             <a href={linkUrlBannerReelIg2}>
//               <img src={bannerReelIg2.mediaItemUrl} alt="Banner Reel" />
//             </a>
//           )}
//         </div>
//         <div className={styles.rightReel}>
//           {ReelGuideIg2?.mediaItemUrl && (
//             <div
//             className={styles.rightReel}
//             dangerouslySetInnerHTML={{ __html: ReelGuideIg2}}
//           />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GuideReelIg

import React from 'react'
import styles from './GuideReelIg.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const GuideReelIg = ({ guideReelIg }) => {
  if (!guideReelIg) return null

  const {
    titleReelIg,
    contentReelIg,
    videoReelIg1,
    reelGuideIg1,
    bannerReelIg2,
    linkUrlBannerReelIg2,
    reelGuideIg2,
  } = guideReelIg

  return (
    <div className={styles.guideReelIgWrap}>
      {/* JUDUL DAN KONTEN */}
      {titleReelIg && (
        <div
          className={cx('titleWrapper')}
          dangerouslySetInnerHTML={{ __html: titleReelIg }}
        />
      )}

      {contentReelIg && (
        <div
          className={cx('contentWrapper')}
          dangerouslySetInnerHTML={{ __html: contentReelIg }}
        />
      )}

      {/* SECTION ATAS */}
      <div className={styles.topSection}>
        {/* IG REEL */}
        <div className={styles.leftReel}>
          {reelGuideIg1 && (
            <div
              className={cx('reelContent')}
              dangerouslySetInnerHTML={{ __html: reelGuideIg1 }}
            />
          )}
        </div>

        {/* VIDEO */}
        <div className={styles.rightVideo}>
          {videoReelIg1 && (
            <div
              className={cx('videoContent')}
              dangerouslySetInnerHTML={{ __html: videoReelIg1 }}
            />
          )}
        </div>
      </div>

      {/* SECTION BAWAH */}
      <div className={styles.bottomSection}>
        <div className={styles.leftBanner}>
          {bannerReelIg2?.mediaItemUrl && (
            <a href={linkUrlBannerReelIg2} target="_blank" rel="noopener noreferrer">
              <img src={bannerReelIg2.mediaItemUrl} alt="Banner Reel" />
            </a>
          )}
        </div>

        {/* IG REEL BAWAH */}
        <div className={styles.rightReel}>
          {reelGuideIg2 && (
            <div
              className={cx('reelContent')}
              dangerouslySetInnerHTML={{ __html: reelGuideIg2 }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default GuideReelIg
