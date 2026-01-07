'use client'

import { useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'

import styles from './HomepageSecondaryHeader.module.scss'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'
import { useSWRGraphQL } from '../../../lib/useSWRGraphQL'
import TravelGuidesMenu from '../../../components/TravelGuidesMenu/TravelGuidesMenu'

const cx = classNames.bind(styles)

// Static fallback (diletakkan DI LUAR → lebih ringan)
const DEFAULT_CATEGORIES = [
  { id: '20', name: 'News', uri: '/news' },
  { id: '29', name: 'Features', uri: '/features' },
  { id: '3', name: 'Insights', uri: '/insights' },
]

export default function HomepageSecondaryHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const router = useRouter()

  /* --------------------------------
   * Fetch secondary headers (SWR)
   * -------------------------------- */
  const { data } = useSWRGraphQL(
    'secondary-headers',
    GetSecondaryHeaders,
    { include: ['20', '29', '3'] }
  )

  /* --------------------------------
   * Normalize categories
   * -------------------------------- */
  const categories = useMemo(() => {
    if (data?.categories?.edges?.length) {
      return data.categories.edges.map(edge => edge.node)
    }
    return DEFAULT_CATEGORIES
  }, [data])

  /* --------------------------------
   * Lock body scroll for guides menu
   * -------------------------------- */
  useEffect(() => {
    document.body.style.overflow = isGuidesNavShown ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isGuidesNavShown])

  /* --------------------------------
   * Handlers
   * -------------------------------- */
  const toggleGuides = useCallback(() => {
    setIsGuidesNavShown(prev => !prev)
    setSearchQuery('')
  }, [setIsGuidesNavShown, setSearchQuery])

  const goToCategory = useCallback(
    (uri) => {
      router.push(uri)
    },
    [router]
  )

  /* --------------------------------
   * Render
   * -------------------------------- */
  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          {/* Guides */}
          <button
            type="button"
            className={cx(
              'menu-button',
              'menu-button-guides',
              { active: isGuidesNavShown }
            )}
            onClick={toggleGuides}
            aria-label="Toggle Guides navigation"
          >
            <span className={cx('menu-title')}>Guides</span>
          </button>

          {/* Categories */}
          {categories.map(({ id, name, uri }) => (
            <button
              key={id}
              type="button"
              className={cx('menu-button')}
              onClick={() => goToCategory(uri)}
            >
              <span className={cx('menu-title')}>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guides Overlay */}
      <div className={cx('full-menu-content', { show: isGuidesNavShown })}>
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
