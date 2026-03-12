import React from 'react'
import classNames from 'classnames/bind'
import styles from './SecondaryDesktopHeaderPage.module.scss'
import Link from 'next/link'
import { normalizeInternalHref } from '@/lib/normalizeInternalHref'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'
import { useSWRGraphQL } from '../../../lib/useSWRGraphQL'
import TravelGuidesMenu from '../../../components/TravelGuidesMenu/TravelGuidesMenu'

const cx = classNames.bind(styles)

export default function SecondaryDesktopHeaderPage({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  const { data, error, isLoading: loading } = useSWRGraphQL(
    ['secondary-headers-page', '20-29-3'],
    GetSecondaryHeaders,
    { include: ['20', '29', '3'] },
    {
      apollo: {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        ensureFresh: true,
        staleTimeMs: 30000,
      },
    },
  )

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

          {categories.map(({ id, name, uri }) => (
            <Link key={id} href={normalizeInternalHref(uri)} passHref>
              <div className={cx('menu-button')}>
                <div className={cx('menu-title')}>{name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={cx('full-menu-content', isGuidesNavShown && 'show')}>
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
