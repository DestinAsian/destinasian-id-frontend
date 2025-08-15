import classNames from 'classnames/bind'
import styles from './SingleNavigation.module.scss'
import { useQuery } from '@apollo/client'
import { GetSingleNavigationTravelGuide } from '../../../../queries/GetSingleNavigationTravelGuide'

import MainCategoryMenu from '../../../../components/TravelGuidesMenu/MainCategoryMenu/MainCategoryMenu'
import TravelGuidesMenu from '../../../../components/TravelGuidesMenu/TravelGuidesMenu'
import Link from 'next/link'

let cx = classNames.bind(styles)

export default function SingleNavigation({
  databaseId,
  isMainNavShown,
  setIsMainNavShown,
  isNavShown,
  setIsNavShown,
  isScrolled,
  isActiveCategory,
  categoryName,
}) {
  const { data } = useQuery(GetSingleNavigationTravelGuide, {
    variables: { first: 4, id: databaseId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const parentNode =
    data?.travelGuide?.categories?.edges?.[0]?.node?.parent?.node
  const children = parentNode?.children?.edges || []

  return (
    <>
      {/* Overlay blur di luar menu (klik untuk menutup) */}
      {isNavShown && (
        <div className={cx('blur-overlay')} onClick={() => setIsNavShown(false)} />
      )}

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
          {/* Tombol kiri: nama parent category (toggle menu Guides) */}
          <div
            className={cx(
              isScrolled ? 'sticky-text-menu-wrapper' : 'text-menu-wrapper',
            )}
          >
            <div className={cx('menu-button-single')}>
              <button
                type="button"
                className={cx('menu-icon')}
                onClick={() => {
                  setIsNavShown(!isNavShown)
                  if (isMainNavShown) setIsMainNavShown(false)
                }}
              >
                <div className={cx('da-guide-wrapper')}>
                  <span className={cx('nav-name')}>
                    {/* {'Guides'} */}
                    {parentNode?.name ?? ''}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* List subkategori */}
          <div className={cx('navigation-wrapper')}>
            <ul className={cx('navigation')}>
              {children.map(({ node }) => (
                <li key={node?.uri} className={cx('nav-link')}>
                  {node?.uri && (
                    <Link
                      href={node.uri}
                      className={cx(
                        isActiveCategory(node.uri) ? 'active' : 'not-active',
                      )}
                    >
                      <h2 className={cx('nav-name')}>{node.name}</h2>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
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

          {/* Menu Travel Guides */}
          <div
            className={cx([
              'full-menu-wrapper',
              'guides-box',
              isNavShown ? 'show' : undefined,
            ])}
          >
            <TravelGuidesMenu />
          </div>
        </div>
      </div>
    </>
  )
}
