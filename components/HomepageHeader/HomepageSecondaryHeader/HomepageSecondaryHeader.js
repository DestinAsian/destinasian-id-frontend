import classNames from 'classnames/bind'
import styles from './HomepageSecondaryHeader.module.scss'
import { TravelGuidesMenu } from '../../../components'

let cx = classNames.bind(styles)

export default function HomepageSecondaryHeader({
  searchQuery,
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  return (
    <>
      <div
        className={cx(
          'navigation-wrapper',
          { sticky: isScrolled },
        )}
      >
        <div className={cx('menu-wrapper')}>
          {/* Tombol Travel Stories */}
          <button
            type="button"
            className={cx(
              'menu-button',
              searchQuery ? 'active' : '',
              searchQuery && !isScrolled && 'active-not-scrolled',
            )}
            onClick={() => {
              searchQuery ? setSearchQuery('') : setSearchQuery('travel')
              if (isGuidesNavShown) setIsGuidesNavShown(false)
            }}
            aria-label="Toggle Travel Stories"
          >
            <div className={cx('menu-title')}>{`Travel Stories`}</div>
          </button>

          {/* Tombol Guides */}
          <button
            type="button"
            className={cx(
              'menu-button',
              isGuidesNavShown ? 'active' : '',
              isGuidesNavShown && !isScrolled && 'active-not-scrolled',
            )}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              setSearchQuery('')
            }}
            aria-label="Toggle Guides"
          >
            <div className={cx('menu-title')}>{`Guides`}</div>
          </button>
        </div>
      </div>

      {/* Konten Menu Guides */}
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

// const cx = classNames.bind(styles)

// export default function HomepageSecondaryHeader({
//   setSearchQuery,
//   isNewsNavShown,
//   setIsNewsNavShown,
//   isInsightNavShown,
//   setIsInsightNavShown,
//   isFeaturesNavShown,
//   setIsFeaturesNavShown,
//   isCityGuidesNavShown,
//   setIsCityGuidesNavShown,
//   isHonorsNavShown,
//   setIsHonorsNavShown,
//   isScrolled,
// }) {
//   return (
//     <>
//       <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
//         <div className={cx('menu-wrapper')}>
//           {/* News */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               isNewsNavShown && 'active',
//               isNewsNavShown && !isScrolled && 'active-not-scrolled'
//             )}
//             onClick={() => {
//               setIsNewsNavShown(!isNewsNavShown)
//               setSearchQuery('')
//             }}
//           >
//             <div className={cx('menu-title')}>News</div>
//           </button>

//           {/* Insight */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               isInsightNavShown && 'active',
//               isInsightNavShown && !isScrolled && 'active-not-scrolled'
//             )}
//             onClick={() => {
//               setIsInsightNavShown(!isInsightNavShown)
//               setSearchQuery('')
//             }}
//           >
//             <div className={cx('menu-title')}>Insight</div>
//           </button>

//           {/* Features */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               isFeaturesNavShown && 'active',
//               isFeaturesNavShown && !isScrolled && 'active-not-scrolled'
//             )}
//             onClick={() => {
//               setIsFeaturesNavShown(!isFeaturesNavShown)
//               setSearchQuery('')
//             }}
//           >
//             <div className={cx('menu-title')}>Features</div>
//           </button>

//           {/* City Guides */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               isCityGuidesNavShown && 'active',
//               isCityGuidesNavShown && !isScrolled && 'active-not-scrolled'
//             )}
//             onClick={() => {
//               setIsCityGuidesNavShown(!isCityGuidesNavShown)
//               setSearchQuery('')
//             }}
//           >
//             <div className={cx('menu-title')}>City Guides</div>
//           </button>

//           {/* Honors Circle */}
//           <button
//             type="button"
//             className={cx(
//               'menu-button',
//               isHonorsNavShown && 'active',
//               isHonorsNavShown && !isScrolled && 'active-not-scrolled'
//             )}
//             onClick={() => {
//               setIsHonorsNavShown(!isHonorsNavShown)
//               setSearchQuery('')
//             }}
//           >
//             <div className={cx('menu-title')}>Honors Circle</div>
//           </button>
//         </div>
//       </div>

//       {/* Konten News */}
//       {isNewsNavShown && (
//         <div className={cx('full-menu-content', 'show')}>
//           <div className={cx('full-menu-wrapper')}>
//             <p>News content here</p>
//           </div>
//         </div>
//       )}

//       {/* Konten Insight */}
//       {isInsightNavShown && (
//         <div className={cx('full-menu-content', 'show')}>
//           <div className={cx('full-menu-wrapper')}>
//             <p>Insight content here</p>
//           </div>
//         </div>
//       )}

//       {/* Konten Features */}
//       {isFeaturesNavShown && (
//         <div className={cx('full-menu-content', 'show')}>
//           <div className={cx('full-menu-wrapper')}>
//             <p>Features content here</p>
//           </div>
//         </div>
//       )}

//       {/* Konten City Guides */}
//       {isCityGuidesNavShown && (
//         <div className={cx('full-menu-content', 'show')}>
//           <div className={cx('full-menu-wrapper')}>
//             <TravelGuidesMenu />
//           </div>
//         </div>
//       )}

//       {/* Konten Honors Circle */}
//       {isHonorsNavShown && (
//         <div className={cx('full-menu-content', 'show')}>
//           <div className={cx('full-menu-wrapper')}>
//             <p>Honors Circle content here</p>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }