
// import classNames from 'classnames/bind'
// import styles from './ParentNavigation.module.scss'

// import MainCategoryMenu from '../../../../components/TravelGuidesMenu/MainCategoryMenu/MainCategoryMenu'
// import TravelGuidesMenu from '../../../../components/TravelGuidesMenu/TravelGuidesMenu'

// import { useQuery } from '@apollo/client'
// import { GetParentNavigation } from '../../../../queries/GetParentNavigation'

// let cx = classNames.bind(styles)

// export default function ParentNavigation({
//   databaseId,
//   isMainNavShown,
//   setIsMainNavShown,
//   isNavShown,
//   setIsNavShown,
//   isScrolled,
//   isActive,
//   categoryName,
// }) {
//   const catPerPage = 4

//   let catVariable = {
//     first: catPerPage,
//     id: databaseId,
//   }

//   // Ambil data kategori (tetap ambil karena dipakai subkategori)
//   const { data } = useQuery(GetParentNavigation, {
//     variables: catVariable,
//     fetchPolicy: 'network-only',
//     nextFetchPolicy: 'cache-and-network',
//   })
//   return (
//     <>
//       {/* Overlay blur di luar menu */}
//       {isNavShown && (
//         <div
//           className={cx('blur-overlay')}
//           onClick={() => setIsNavShown(false)}
//         />
//       )}

//       <div
//         className={cx(
//           'component',
//           isMainNavShown || isNavShown ? 'show' : undefined,
//         )}
//       >
//         <div
//           className={cx(
//             'navbar-wrapper',
//             isMainNavShown || isNavShown ? 'show' : undefined,
//           )}
//         >
//           {/* Tombol Parent - selalu "Guides" */}
//           <div
//             className={cx(
//               isScrolled ? 'sticky-text-menu-wrapper' : 'text-menu-wrapper',
//               isNavShown ? 'show' : undefined,
//             )}
//           >
//             <div className={cx('menu-button-parent')}>
//               <button
//                 type="button"
//                 className={cx('menu-icon')}
//                 onClick={() => {
//                   setIsNavShown(!isNavShown)
//                   if (isMainNavShown) setIsMainNavShown(false)
//                 }}
//               >
//                 <div className={cx('da-guide-wrapper')}>
//                   <span className={cx('nav-name')}>{data.category.name || 'Guides' }</span>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* List Subkategori */}
//           <div
//             className={cx(
//               'navigation-wrapper',
//               isMainNavShown || isNavShown ? 'show' : undefined,
//             )}
//           >
//             <div className={cx('navigation')}>
//               {data?.category?.children?.edges?.map((post) => (
//                 <li key={post?.node?.uri} className={cx('nav-link')}>
//                   {post?.node?.uri && (
//                     <a
//                       href={post?.node?.uri}
//                       className={cx(
//                         isActive(post?.node?.uri) ? 'active' : 'not-active',
//                       )}
//                     >
//                       <h2 className={cx('nav-name')}>{post?.node?.name}</h2>
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </div>
//           </div>


//           {/* Menu Utama */}
//           <div
//             className={cx([
//               'full-menu-wrapper',
//               isMainNavShown ? 'show' : undefined,
//             ])}
//           >
//             <MainCategoryMenu categoryName={categoryName} />
//           </div>

//           {/* Menu Travel Guides */}
//           <div
//             className={cx([
//               'full-menu-wrapper',
//               'guides-box',
//               isNavShown ? 'show' : undefined,
//             ])}
//           >
//             <TravelGuidesMenu />
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }


import classNames from 'classnames/bind'
import styles from './ParentNavigation.module.scss'

import MainCategoryMenu from '../../../../components/TravelGuidesMenu/MainCategoryMenu/MainCategoryMenu'
import TravelGuidesMenu from '../../../../components/TravelGuidesMenu/TravelGuidesMenu'

import { useQuery } from '@apollo/client'
import { GetParentNavigation } from '../../../../queries/GetParentNavigation'

let cx = classNames.bind(styles)

export default function ParentNavigation({
  databaseId,
  isMainNavShown,
  setIsMainNavShown,
  isNavShown,
  setIsNavShown,
  isScrolled,
  isActive,
  categoryName,
}) {
  const catPerPage = 4

  let catVariable = {
    first: catPerPage,
    id: databaseId,
  }

  // Ambil data kategori
  const { data } = useQuery(GetParentNavigation, {
    variables: catVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  return (
    <div
      className={cx(
        'component',
        isMainNavShown || isNavShown ? 'show' : undefined,
      )}
    >
      <div
        className={cx(
          'navbar-wrapper',
          isMainNavShown || isNavShown ? 'show' : undefined,
        )}
      >
        {/* Tombol Parent */}
        {data?.category && (
          <div
            className={cx(
              isScrolled ? 'sticky-text-menu-wrapper' : 'text-menu-wrapper',
              isNavShown ? 'show' : undefined,
            )}
          >
            <div className={cx('menu-button-parent')}>
              <button
                type="button"
                className={cx('menu-icon')}
                onClick={() => {
                  setIsNavShown(!isNavShown)
                  if (isMainNavShown) setIsMainNavShown(false)
                }}
              >
                <div className={cx('da-guide-wrapper')}>
                  <span className={cx('nav-name')}>{data.category.name}</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* List Subkategori */}
        <div
          className={cx(
            'navigation-wrapper',
            isMainNavShown || isNavShown ? 'show' : undefined,
          )}
        >
          <div className={cx('navigation')}>
            {data?.category?.children?.edges?.map((post) => (
              <li key={post?.node?.uri} className={cx('nav-link')}>
                {post?.node?.uri && (
                  <a
                    href={post?.node?.uri}
                    className={cx(
                      isActive(post?.node?.uri) ? 'active' : 'not-active',
                    )}
                  >
                    <h2 className={cx('nav-name')}>{post?.node?.name}</h2>
                  </a>
                )}
              </li>
            ))}
          </div>
        </div>

        {/* Menu Utama */}
        <div
          className={cx([
            'full-menu-wrapper',
            isMainNavShown ? 'show' : undefined,
          ])}
        >
          <MainCategoryMenu categoryName={categoryName} />
        </div>

        {/* Menu Travel Guides (yang dulu di titik tiga) */}
        <div
          className={cx(['full-menu-wrapper', isNavShown ? 'show' : undefined])}
        >
          <TravelGuidesMenu />
        </div>
      </div>
    </div>
  )
}