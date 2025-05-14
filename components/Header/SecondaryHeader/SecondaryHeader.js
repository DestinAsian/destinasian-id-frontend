
import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './SecondaryHeader.module.scss'
import { TravelGuidesMenu } from '../../../components'
import Link from 'next/link'
import { GetSecondaryHeaders } from '../../../queries/GetSecondaryHeaders'

let cx = classNames.bind(styles)

export default function SecondaryHeader({
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isRCANavShown,
  setIsRCANavShown,
  isScrolled,
}) {

  const { data, error } = useQuery(GetSecondaryHeaders, {
    variables: { include: ["20", "29", "3"] },
  })

  if (error) return <div>Error loading categories!</div>

  const categories = data?.categories?.edges || []

  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          <button
            type="button"
            className={cx('menu-button', isGuidesNavShown ? 'active' : '')}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              isRCANavShown ? setIsRCANavShown(!isRCANavShown) : null
              setSearchQuery('')
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isRCANavShown}
          >
            <div className={cx('menu-title')}>{`Guides`}</div>
          </button>

          {/* Render kategori dinamis (News, Insights, Features) */}
          {categories.map((category) => {
            const { id, name, slug } = category.node
            return (
              <Link key={id} href={`/${slug}`}>
                <div className={cx('menu-button')}>
                  <div className={cx('menu-title')}>{name}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

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