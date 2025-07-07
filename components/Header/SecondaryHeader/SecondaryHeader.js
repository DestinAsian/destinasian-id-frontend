import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './SecondaryHeader.module.scss'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'

const TravelGuidesMenu = dynamic(() =>
  import('../../../components/TravelGuidesMenu/TravelGuidesMenu')
)

const cx = classNames.bind(styles)

export default function SecondaryHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isScrolled,
}) {
  // Query untuk mengambil kategori dinamis (misalnya: News, Insights, Features)
  const { data, error, loading } = useQuery(GetSecondaryHeaders, {
    variables: { include: ['20', '29', '3'] },
  })

  if (error) return <div>Error loading categories!</div>

  // Gunakan useMemo agar kategori tidak dihitung ulang kecuali data berubah
  const categories = useMemo(() => data?.categories?.edges || [], [data])

  // Fungsi toggle untuk guides navigation
  const toggleGuidesNav = () => {
    setIsGuidesNavShown((prev) => !prev)
    setSearchQuery('')
  }

  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          <button
            type="button"
            className={cx('menu-button', 'menu-button-guides', {
              active: isGuidesNavShown,
            })}
            onClick={toggleGuidesNav}
            aria-label="Toggle navigation"
          >
            <div className={cx('menu-title')}>Guides</div>
          </button>

          {/* Render kategori dinamis */}
          {categories.map(({ node: category }) => {
            const { id, name, uri } = category
            return (
              <Link key={id} href={`/${uri}`}>
                <div className={cx('menu-button')}>
                  <div className={cx('menu-title')}>{name}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className={cx('full-menu-content', { show: isGuidesNavShown })}>
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
