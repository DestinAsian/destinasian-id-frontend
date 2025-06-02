import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './HomepageSecondaryHeader.module.scss'
import dynamic from 'next/dynamic'

const TravelGuidesMenu = dynamic(() => import('../../../components/TravelGuidesMenu/TravelGuidesMenu'))
import Link from 'next/link'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'

let cx = classNames.bind(styles)

export default function SecondaryHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const { data, error } = useQuery(GetSecondaryHeaders, {
    variables: { include: ["20", "29", "3"] },
  })

  if (error) return <div>Error loading categories!</div>

  const categories = data?.categories?.edges || []

  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          <button
            type="button"
            className={cx('menu-button', isGuidesNavShown ? 'active' : '')}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              setSearchQuery('')
            }}
            aria-label="Toggle navigation"
          >
            <div className={cx('menu-title')}>{`Guides`}</div>
          </button>

          {/* Render kategori dinamis (News, Insights, Features) */}
          {categories.map((category) => {
            const { id, name, slug } = category.node
            return (
              <Link key={id} href={`/${slug}`}>
                <div className={cx('menu-button')}>
                  <div className={cx('menu-title')}>{name}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div
        className={cx(
          'full-menu-content',
          isGuidesNavShown ? 'show' : undefined,
        )}
      >
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}






// import classNames from 'classnames/bind'
// import styles from './HomepageSecondaryHeader.module.scss'
// import { TravelGuidesMenu } from '../../../components'

// let cx = classNames.bind(styles)

// export default function HomepageSecondaryHeader({
//   searchQuery,
//   setSearchQuery,
//   isGuidesNavShown,
//   setIsGuidesNavShown,
//   isScrolled,
// }) {
//   return (
//     <>
//       <div
//         className={cx(
//           'navigation-wrapper',
//           { sticky: isScrolled },
//         )}
//       >
//         <div className={cx('menu-wrapper')}>
//           {/* Tombol Travel Stories */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               searchQuery ? 'active' : '',
//               searchQuery && !isScrolled && 'active-not-scrolled',
//             )}
//             onClick={() => {
//               searchQuery ? setSearchQuery('') : setSearchQuery('travel')
//               if (isGuidesNavShown) setIsGuidesNavShown(false)
//             }}
//             aria-label="Toggle Travel Stories"
//           >
//             <div className={cx('menu-title')}>{`Travel Stories`}</div>
//           </button>

//           {/* Tombol Guides */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               isGuidesNavShown ? 'active' : '',
//               isGuidesNavShown && !isScrolled && 'active-not-scrolled',
//             )}
//             onClick={() => {
//               setIsGuidesNavShown(!isGuidesNavShown)
//               setSearchQuery('')
//             }}
//             aria-label="Toggle Guides"
//           >
//             <div className={cx('menu-title')}>{`Guides`}</div>
//           </button>
//           {/* Tombol Guides */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               isGuidesNavShown ? 'active' : '',
//               isGuidesNavShown && !isScrolled && 'active-not-scrolled',
//             )}
//             onClick={() => {
//               setIsGuidesNavShown(!isGuidesNavShown)
//               setSearchQuery('')
//             }}
//             aria-label="Toggle Guides"
//           >
//             <div className={cx('menu-title')}>{`Guides`}</div>
//           </button>
//         </div>
//       </div>

//       {/* Konten Menu Guides */}
//       <div
//         className={cx(
//           'full-menu-content',
//           isGuidesNavShown ? 'show' : undefined,
//         )}
//       >
//         <div className={cx('full-menu-wrapper')}>
//           <TravelGuidesMenu />
//         </div>
//       </div>
//     </>
//   )
// }


