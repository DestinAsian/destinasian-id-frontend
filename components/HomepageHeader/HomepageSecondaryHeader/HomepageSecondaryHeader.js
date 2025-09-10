import React, { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import styles from './HomepageSecondaryHeader.module.scss'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'
import TravelGuidesMenu from '../../../components/TravelGuidesMenu/TravelGuidesMenu'

const cx = classNames.bind(styles)

export default function HomepageSecondaryHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const router = useRouter()

  const { data, loading, error } = useQuery(GetSecondaryHeaders, {
    variables: { include: ['20', '29', '3'] },
    fetchPolicy: 'cache-first',
  })

  // Default fallback categories (used when query fails or still loading)
  const defaultCategories = [
    { id: '20', name: 'News', uri: '/news' },
    { id: '29', name: 'Features', uri: '/features' },
    { id: '3', name: 'Insights', uri: '/insights' },
  ]

  // Prevent unnecessary re-renders with useMemo
  const categories = useMemo(() => {
    if (loading) return defaultCategories
    if (data?.categories?.edges?.length > 0) {
      return data.categories.edges.map((cat) => cat.node)
    }
    return defaultCategories
  }, [loading, data])

  // Lock/unlock body scroll when Guides menu is open
  useEffect(() => {
    document.body.style.overflow = isGuidesNavShown ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isGuidesNavShown])

  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          {/* Guides button */}
          <button
            type="button"
            className={cx('menu-button', 'menu-button-guides', {
              active: isGuidesNavShown,
            })}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              setSearchQuery('')
            }}
            aria-label="Toggle Guides navigation"
          >
            <div className={cx('menu-title')}>Guides</div>
          </button>

          {/* Category buttons */}
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

      {/* Fullscreen Guides menu */}
      <div className={cx('full-menu-content', isGuidesNavShown && 'show')}>
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
