// import classNames from 'classnames/bind'
// import dynamic from 'next/dynamic'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import styles from './SingleEntryHeader.module.scss'
// import Heading from '../../components/Heading/Heading'
// import FormatDate from '../../components/FormatDate/FormatDate'

// // Ads components (dynamic import to avoid SSR issues)
// const MastHeadTop = dynamic(
//   () => import('../../components/AdUnit/MastHeadTop/MastHeadTop'),
//   { ssr: false }
// )

// const MastHeadTopMobile = dynamic(
//   () => import('../../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'),
//   { ssr: false }
// )

// const cx = classNames.bind(styles)

// export default function SingleEntryHeader({
//   parent,
//   title,
//   parentCategory,
//   categoryUri,
//   categoryName,
//   author,
//   date,
// }) {
//   const [isMaximized, setIsMaximized] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)

//   // Expand EntryHeader after page load
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setIsMaximized(true)
//     }, 2000)

//     return () => clearTimeout(timeout)
//   }, [])

//   // Detect viewport size on load & resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768)
//     }

//     checkMobile() // initial check
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   return (
//     <div className={cx('component', { maximized: isMaximized })}>
//       {isMobile ? <MastHeadTopMobile /> : <MastHeadTop />}
//       <div className={cx('header-wrapper')}>
//         {parentCategory !== 'Rest of World' &&
//           categoryName !== 'Rest of World' &&
//           categoryUri && (
//             <Link href={categoryUri}>
//               <div className={cx('category-name')}>
//                 {parentCategory} {categoryName}
//               </div>
//             </Link>
//           )}
//         <Heading className={cx('title')}>
//           {parent || null} {title}
//         </Heading>
//         <time className={cx('meta-wrapper')} dateTime={date}>
//           <span className={cx('meta-author')}>
//             By {author}
//           </span>
//           &nbsp; | &nbsp;
//           <FormatDate date={date} />
//         </time>
//       </div>
//     </div>
//   )
// }


"use client";

import classNames from 'classnames/bind'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import Link from 'next/link'
import styles from './SingleEntryHeader.module.scss'
import Heading from '../../components/Heading/Heading'
import FormatDate from '../../components/FormatDate/FormatDate'

/* ================================
   Ads components (no SSR)
================================ */
const MastHeadTop = dynamic(
  () => import('../../components/AdUnit/MastHeadTop/MastHeadTop'),
  { ssr: false }
)

const MastHeadTopMobile = dynamic(
  () => import('../../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'),
  { ssr: false }
)

const cx = classNames.bind(styles)

/* ================================
   SWR helpers
================================ */

// delay 2s → maximize header
const maximizeFetcher = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000)
  })

// detect viewport
const mobileFetcher = () => window.innerWidth <= 768

export default function SingleEntryHeader({
  parent,
  title,
  parentCategory,
  categoryUri,
  categoryName,
  author,
  date,
}) {
  /* ================================
     Expand EntryHeader (same logic)
  ================================ */
  const { data: isMaximized = false } = useSWR(
    'entry-header-maximized',
    maximizeFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  /* ================================
     Detect viewport (same logic)
  ================================ */
  const { data: isMobile = false } = useSWR(
    'viewport-mobile',
    mobileFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return (
    <div className={cx('component', { maximized: isMaximized })}>
      {isMobile ? <MastHeadTopMobile /> : <MastHeadTop />}

      <div className={cx('header-wrapper')}>
        {parentCategory !== 'Rest of World' &&
          categoryName !== 'Rest of World' &&
          categoryUri && (
            <Link href={categoryUri}>
              <div className={cx('category-name')}>
                {parentCategory} {categoryName}
              </div>
            </Link>
          )}

        <Heading className={cx('title')}>
          {parent || null} {title}
        </Heading>

        <time className={cx('meta-wrapper')} dateTime={date}>
          <span className={cx('meta-author')}>
            By {author}
          </span>
          &nbsp; | &nbsp;
          <FormatDate date={date} />
        </time>
      </div>
    </div>
  )
}
