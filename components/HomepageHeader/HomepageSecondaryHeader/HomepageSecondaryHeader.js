import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import styles from './HomepageSecondaryHeader.module.scss'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'
import TravelGuidesMenu from '../../../components/TravelGuidesMenu/TravelGuidesMenu'
const cx = classNames.bind(styles)

export default function SecondaryHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const router = useRouter()

  const { data, loading, error } = useQuery(GetSecondaryHeaders, {
    variables: { include: ['20', '29', '3'] },
  })

  // Default fallback categories
  const defaultCategories = [
    { id: '20', name: 'News', uri: '/news' },
    { id: '29', name: 'Features', uri: '/features' },
    { id: '3', name: 'Insights', uri: '/insights' },
  ]

  // Gunakan memo untuk mencegah render ulang tidak perlu
  const categories = useMemo(() => {
    if (loading) return defaultCategories
    if (data?.categories?.edges?.length > 0) {
      return data.categories.edges.map((cat) => cat.node)
    }
    return defaultCategories // fallback jika data kosong atau error
  }, [loading, data])

  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          {/* Tombol Guides */}
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
            <div className={cx('menu-title', 'menu-button-guides')}>Guides</div>
          </button>

          {/* Tombol Kategori */}
          {categories.map(({ id, name, uri }) => (
            <div
              key={id}
              className={cx('menu-button')}
              role="button"
              tabIndex={0}
              onClick={() => router.push(uri)}
              onKeyPress={(e) => e.key === 'Enter' && router.push(uri)}
            >
              <div className={cx('menu-title')}>{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigasi Penuh untuk Guides */}
      <div className={cx('full-menu-content', isGuidesNavShown ? 'show' : undefined)}>
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
