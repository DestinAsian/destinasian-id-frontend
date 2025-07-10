// import React from 'react'
// import classNames from 'classnames/bind'
// import styles from './GuideSecondLatestStories.module.scss'
// import Link from 'next/link'
// import Image from 'next/image'

// const cx = classNames.bind(styles)

// function stripDropcapTags(content) {
//   if (!content) return ''
//   let cleaned = content.replace(/\[\/?dropcap\]/gi, '')
//   cleaned = cleaned.replace(
//     /<span[^>]*class=["']?dropcap["']?[^>]*>(.*?)<\/span>/gi,
//     '$1'
//   )
//   return cleaned
// }

// const MAX_EXCERPT_LENGTH = 150

// export default function GuideSecondLatestStories({
//   title,
//   excerpt,
//   uri,
//   featuredImage,
//   caption,
//   // guide_book_now,
// }) {
//   const cleanedExcerpt = stripDropcapTags(excerpt)
//   let trimmedExcerpt = cleanedExcerpt?.substring(0, MAX_EXCERPT_LENGTH)
//   const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')
//   if (lastSpaceIndex !== -1) {
//     trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
//   }

//   return (
//     <section className={cx('wrapper')}>
//       {featuredImage && (
//         <div className={cx('imageWrapper')}>
//           <Link href={uri}>
//             <Image
//               src={featuredImage.sourceUrl}
//               alt={title + ' Featured Image'}
//               width={600}
//               height={400}
//               className={cx('mainImage')}
//             />
//           </Link>
//           {caption && <div className={cx('caption')}>{caption}</div>}
//         </div>
//       )}

//       <div className={cx('textWrapper')}>
//         {uri && (
//           <Link href={uri}>
//             <h2 className={cx('title')}>{title}</h2>
//           </Link>
//         )}
//         <div
//           className={cx('excerpt')}
//           dangerouslySetInnerHTML={{ __html: trimmedExcerpt }}
//         />
//         <div className={cx('buttonWrapper')}>
//           <Link href={uri}>
//             <button className={cx('readMoreButton')}>Baca Selanjutnya</button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   )
// }

// components/GuideSecondLatestStories/GuideSecondLatestStories.js

import React from 'react'
import classNames from 'classnames/bind'
import styles from './GuideSecondLatestStories.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const cx = classNames.bind(styles)

export default function GuideSecondLatestStories({ featuredImage, caption, uri }) {
  if (!featuredImage) return null

  return (
    <div className={cx('imageWrapper')}>
      <Link href={uri}>
        <Image
          src={featuredImage.sourceUrl}
          alt="Featured Image"
          width={600}
          height={400}
          className={cx('mainImage')}
        />
      </Link>
      {caption && <div className={cx('caption')}>{caption}</div>}
    </div>
  )
}
