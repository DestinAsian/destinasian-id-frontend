import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './SecondaryHeader.module.scss'
import Link from 'next/link'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'
import TravelGuidesMenu from '../../../components/TravelGuidesMenu/TravelGuidesMenu'

const cx = classNames.bind(styles)

export default function SecondaryHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const { data, error, loading } = useQuery(GetSecondaryHeaders, {
    variables: { include: ['20', '29', '3'] },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  // Lock/unlock body scroll when guides menu is toggled
  useEffect(() => {
    document.body.style.overflow = isGuidesNavShown ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isGuidesNavShown])

  if (error || loading || !data?.categories?.edges?.length) return null

  const categories = data.categories.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    uri: node.uri,
  }))

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

          {/* Category links */}
          {categories.map(({ id, name, uri }) => (
            <Link key={id} href={uri}>
              <div className={cx('menu-button')}>
                <div className={cx('menu-title')}>{name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Full screen Travel Guides menu */}
      <div className={cx('full-menu-content', isGuidesNavShown && 'show')}>
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
