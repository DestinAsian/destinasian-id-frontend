'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './TravelGuidesCategories.module.scss'
import classNames from 'classnames/bind'

import logohilton from '../../assets/logo/logo_hilton.png'

const cx = classNames.bind(styles)

const normalize = (str = '') => str.toLowerCase().trim()
const ORDER = ['bali', 'jakarta', 'bandung', 'surabaya']

const TravelGuideCategories = ({ data }) => {
  const categories = data?.category?.children?.edges?.map(({ node }) => node) || []
  if (!categories.length) return null

  const byName = categories.reduce((acc, cat) => {
    acc[normalize(cat.name)] = cat
    return acc
  }, {})

  const orderedCategories = ORDER.map((key) => byName[key]).filter(Boolean)

  return (
    <div className={cx('wrapper')}>
      <div className={cx('titleWrapper')}>
        <h2 className={cx('title')}>Guides</h2>
        {/* Hilton logo */}
        <Image
          src={logohilton}
          alt="Hilton Logo"
          width={100}
          height={100}
          className={cx('logo')}
          priority
          draggable={false}
        />
      </div>

      <div className={cx('grid')}>
        {orderedCategories.map(({ id, name, uri, categoryImages }) => {
          const imageUrl = categoryImages?.categorySlide1?.mediaItemUrl
          const isComingSoon = ['bandung', 'surabaya'].includes(normalize(name))

          const CardContent = (
            <div
              className={cx('card', { comingSoon: isComingSoon })}
              draggable={false}
            >
              <div className={cx('imageWrapper')}>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={800}   // set fixed width for aspect ratio
                    height={600}  // 4:3 ratio → prevents layout shift
                    className={cx('image')}
                    loading="lazy"
                    draggable={false}
                  />
                )}
                <div className={cx('textWrapper')}>
                  <h3 className={cx('nameOverlay')}>{name}</h3>
                  {isComingSoon && (
                    <p className={cx('comingsoon')}>(Coming Soon)</p>
                  )}
                </div>
              </div>
            </div>
          )

          return isComingSoon ? (
            <div key={id}>{CardContent}</div>
          ) : (
            <Link key={id} href={uri} draggable={false}>
              {CardContent}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TravelGuideCategories



// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import styles from './TravelGuidesCategories.module.scss'
// import classNames from 'classnames/bind'

// const cx = classNames.bind(styles)

// const normalize = (str = '') => str.toLowerCase().trim()
// const ORDER = ['bali', 'jakarta', 'bandung', 'surabaya']

// const TravelGuideCategories = ({ data }) => {
//   const categories = data?.category?.children?.edges?.map(({ node }) => node) || []
//   if (!categories.length) return null

//   const byName = categories.reduce((acc, cat) => {
//     acc[normalize(cat.name)] = cat
//     return acc
//   }, {})

//   const orderedCategories = ORDER.map((key) => byName[key]).filter(Boolean)

//   return (
//     <div className={cx('wrapper')}>
//       <h2 className={cx('title')}>Guides</h2>
//       <div className={cx('grid')}>
//         {orderedCategories.map(({ id, name, uri, categoryImages }) => {
//           const imageUrl = categoryImages?.categorySlide1?.mediaItemUrl
//           const isComingSoon = ['bandung', 'surabaya'].includes(normalize(name))

//           return (
//             <Link key={id} href={uri} className={cx('card')} draggable="false">
//               <div className={cx('imageWrapper')}>
//                 {imageUrl && (
//                   <img
//                     src={imageUrl}
//                     alt={name}
//                     className={cx('image')}
//                     loading="lazy"
//                     draggable="false"
//                   />
//                 )}
//                 <div className={cx('textWrapper')}>
//                   <h3 className={cx('nameOverlay')}>{name}</h3>
//                   {isComingSoon && (
//                     <p className={cx('comingsoon')}>(Coming Soon)</p>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default TravelGuideCategories


// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import styles from './TravelGuidesCategories.module.scss'
// import classNames from 'classnames/bind'

// const cx = classNames.bind(styles)

// const normalize = (str = '') => str.toLowerCase().trim()
// const ORDER = ['bali', 'jakarta', 'bandung', 'surabaya']

// const TravelGuideCategories = ({ data }) => {
//   const categories =
//     data?.category?.children?.edges?.map(({ node }) => node) || []
//   if (!categories.length) return null

//   const byName = categories.reduce((acc, cat) => {
//     acc[normalize(cat.name)] = cat
//     return acc
//   }, {})

//   const orderedCategories = ORDER.map((key) => byName[key]).filter(Boolean)

//   return (
//     <div className={cx('wrapper')}>
//       <h2 className={cx('title')}>Guides</h2>
//       <div className={cx('grid')}>
//         {orderedCategories.map(({ id, name, uri, categoryImages }) => {
//           const imageUrl =
//             categoryImages?.categorySlide1?.node?.mediaItemUrl || null
//           const isComingSoon = ['bandung', 'surabaya'].includes(normalize(name))

//           return (
//             <Link key={id} href={uri} className={cx('card')} draggable="false">
//               <div className={cx('imageWrapper')}>
//                 {imageUrl && (
//                   <img
//                     src={imageUrl}
//                     alt={name}
//                     className={cx('image')}
//                     loading="lazy"
//                     draggable="false"
//                   />
//                 )}
//                 <div className={cx('textWrapper')}>
//                   <h3 className={cx('nameOverlay')}>{name}</h3>
//                   {isComingSoon && (
//                     <p className={cx('comingsoon')}>(Coming Soon)</p>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default TravelGuideCategories
