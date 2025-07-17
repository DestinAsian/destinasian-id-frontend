
import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './SecondaryDesktopHeader.module.scss'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'

const TravelGuidesMenu = dynamic(() =>
  import('../../../components/TravelGuidesMenu/TravelGuidesMenu'),
)

const cx = classNames.bind(styles)

export default function SecondaryDesktopHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const { data, error, loading } = useQuery(GetSecondaryHeaders, {
    variables: { include: ['20', '29', '3'] },
  })

  if (error) return <div>Error loading categories!</div>

  // Fallback cepat jika loading
  const defaultCategories = [
    { id: '20', name: 'News', uri: '/news' },
    { id: '29', name: 'Features', uri: '/features' },
    { id: '3', name: 'Insights', uri: '/insights' },
  ]

  const categories = loading
    ? defaultCategories
    : data?.categories?.edges.map((edge) => ({
        id: edge.node.id,
        name: edge.node.name,
        uri: edge.node.uri,
      }))

  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          {/* Tombol untuk Guides */}
          <button
            type="button"
            className={cx('menu-button', 'menu-button-guides', {
              active: isGuidesNavShown,
            })}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              setSearchQuery('')
            }}
            aria-label="Toggle navigation"
          >
            <div className={cx('menu-title')}>Guides</div>
          </button>

          {/* Kategori dari query atau fallback */}
          {categories.map(({ id, name, uri }) => (
            <Link key={id} href={uri} legacyBehavior>
              <a className={cx('menu-button')}>
                <div className={cx('menu-title')}>{name}</div>
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Menu penuh untuk Travel Guides */}
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


