import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './SecondaryDesktopHeader.module.scss'
import Link from 'next/link'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'

import TravelGuidesMenu from '../../../components/TravelGuidesMenu/TravelGuidesMenu'


const cx = classNames.bind(styles)

export default function SecondaryDesktopHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const { data, error, loading } = useQuery(GetSecondaryHeaders, {
    variables: { include: ['20', '29', '3'] },
    fetchPolicy: 'cache-first',
  })

  if (error || loading || !data?.categories?.edges?.length) return null

  const categories = data.categories.edges.map((edge) => ({
    id: edge.node.id,
    name: edge.node.name,
    uri: edge.node.uri,
  }))

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
            <div className={cx('menu-title')}>Guides</div>
          </button>

          {/* Link kategori */}
          {categories.map(({ id, name, uri }) => (
            <Link key={id} href={uri}>
              <div className={cx('menu-button')}>
                <div className={cx('menu-title')}>{name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Menu Travel Guides */}
      <div className={cx('full-menu-content', isGuidesNavShown && 'show')}>
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
