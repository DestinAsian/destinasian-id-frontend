'use client'

import React, { useState, useRef, memo } from 'react'
import dynamic from 'next/dynamic'
import classNames from 'classnames/bind'
import Link from 'next/link'

import styles from './FrontPageLayout.module.scss'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import { GetChildrenTravelGuides } from '../../queries/GetChildrenTravelGuides'

import { useSWRGraphQL } from '../../lib/useSWRGraphQL'

import TravelGuideCategories from '../CategoryHomePage/TravelGuideCategories'
import CategoryUpdates from '../CategoryHomePage/CategoryUpdates'
import CategoryNewsUpdates from '../CategoryHomePage/CategoryNewsUpdates'
import CategoryFeatures from '../CategoryHomePage/CategoryFeatures'

// === ADS (DYNAMIC IMPORT – NON BLOCKING) ===
const MastHeadTopHome = dynamic(() =>
  import('../AdUnit/MastHeadTop/MastHeadTopHome'),
)
const MastHeadTopMobileHome = dynamic(() =>
  import('../AdUnit/MastHeadTopMobile/MastHeadTopMobileHome'),
)
const MastHeadBottomHome = dynamic(() =>
  import('../AdUnit/MastHeadBottom/MastHeadBottomHome'),
)
const MastHeadBottomMobileHome = dynamic(() =>
  import('../AdUnit/MastHeadBottomMobile/MastHeadBottomMobileHome'),
)
const HalfPageHome1 = dynamic(() =>
  import('../AdUnit/HalfPage1/HalfPageHome1'),
)

const cx = classNames.bind(styles)

/* --------------------------------
        LIGHT MOBILE DETECTION
-------------------------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  const mediaRef = useRef(null)

  if (typeof window !== 'undefined' && !mediaRef.current) {
    mediaRef.current = window.matchMedia(`(max-width: ${breakpoint}px)`)
  }

  React.useEffect(() => {
    if (!mediaRef.current) return

    const media = mediaRef.current
    setIsMobile(media.matches)

    const handler = (e) => setIsMobile(e.matches)
    media.addEventListener('change', handler)

    return () => media.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}

/* --------------------------------
        MAIN COMPONENT
-------------------------------- */
function FrontPageLayout() {
  const isMobile = useIsMobile()

  /* ===== SWR GRAPHQL (NON BLOCKING) ===== */
  const { data: travelGuideData } = useSWRGraphQL(
    'travel-guides',
    GetChildrenTravelGuides,
  )

  const { data: updatesData } = useSWRGraphQL(
    'category-updates',
    GetCategoryUpdates,
    { include: ['41'] },
  )

  const { data: featuresData } = useSWRGraphQL(
    'category-features',
    GetCategoryFeatures,
    { id: '20' },
  )

  /* ===== DATA NORMALIZATION ===== */
  const categoryEdges = updatesData?.category?.children?.edges ?? []
  const hasGuides =
    travelGuideData?.category?.children?.edges?.length > 0

  const categoryFeatures = featuresData?.category

  return (
    <>
      {/* ===== TOP AD ===== */}
      <div className={cx('ad-slot')}>
        {isMobile ? <MastHeadTopMobileHome /> : <MastHeadTopHome />}
      </div>

      {/* ===== TRAVEL GUIDES ===== */}
      {hasGuides && (
        <>
          <section className={cx('component-updates')}>
            <div className={cx('category-insights-component')}>
              <TravelGuideCategories data={travelGuideData} />
            </div>
          </section>
          <hr className={cx('divider')} />
        </>
      )}

      {/* ===== CATEGORY UPDATES ===== */}
      {categoryEdges.length > 0 && (
        <>
          <section className={cx('component-updates')}>
            <div className={cx('category-updates-component')}>
              <CategoryUpdates data={categoryEdges} />
            </div>
          </section>
          <hr className={cx('divider')} />
        </>
      )}

      {/* ===== BOTTOM AD ===== */}
      <div className={cx('ad-slot')}>
        {isMobile ? <MastHeadBottomMobileHome /> : <MastHeadBottomHome />}
      </div>

      {/* ===== CATEGORY TITLES ===== */}
      {categoryEdges.map(({ node: category }) => {
        const parent = category?.parent?.node?.name

        return (
          <section
            key={category.id}
            className={cx('category-updates-component')}
          >
            <Link href={category.uri}>
              <h2 className={styles.title}>
                {parent ? `${parent} ${category.name}` : category.name}
              </h2>
            </Link>
          </section>
        )
      })}

      {/* ===== NEWS + HALF PAGE ===== */}
      {categoryEdges.length > 0 && (
        <>
          <section className={cx('component-news-updates')}>
            <div className={cx('two-columns')}>
              <div className={cx('left-column')}>
                <CategoryNewsUpdates data={categoryEdges} />
              </div>
              <aside className={cx('right-column')}>
                <div className={cx('outnow-wrapper')}>
                  <HalfPageHome1 />
                </div>
              </aside>
            </div>
          </section>
          <hr className={cx('divider-news-updates')} />
        </>
      )}

      {/* ===== CATEGORY FEATURES ===== */}
      {categoryFeatures && (
        <section className={cx('component-updates')}>
          <div className={cx('category-insights-component')}>
            <CategoryFeatures data={categoryFeatures} />
          </div>
        </section>
      )}
    </>
  )
}

export default memo(FrontPageLayout)
