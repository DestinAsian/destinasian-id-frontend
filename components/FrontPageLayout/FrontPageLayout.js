'use client'

import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  memo,
} from 'react'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import classNames from 'classnames/bind'
import Link from 'next/link'

import styles from './FrontPageLayout.module.scss'
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import { GetChildrenTravelGuides } from '../../queries/GetChildrenTravelGuides'

import TravelGuideCategories from '../CategoryHomePage/TravelGuideCategories'
import CategoryUpdates from '../CategoryHomePage/CategoryUpdates'
import CategoryNewsUpdates from '../CategoryHomePage/CategoryNewsUpdates'
import CategoryFeatures from '../CategoryHomePage/CategoryFeatures'

// Dynamic import untuk komponen ads berat
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

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= breakpoint)

    const throttled = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(update, 150)
    }

    update()
    window.addEventListener('resize', throttled, { passive: true })

    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener('resize', throttled)
    }
  }, [breakpoint])

  return isMobile
}

/* -------------------------------
        MAIN COMPONENT
-------------------------------- */
function FrontPageLayout() {
  const isMobile = useIsMobile()

  // === QUERY ===
  const { data: travelGuideData, loading: travelGuideLoading } = useQuery(
    GetChildrenTravelGuides,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'network-only',
    },
  )

  const { data: updatesData, loading: updatesLoading } = useQuery(
    GetCategoryUpdates,
    {
      variables: { include: ['41'] },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'network-only',
    },
  )

  const { data: featuresData, loading: featuresLoading } = useQuery(
    GetCategoryFeatures,
    {
      variables: { id: '20' },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'network-only',
    },
  )

  // === DATA EXTRACT ===
  const categoryEdges = updatesData?.category?.children?.edges || []
  const hasGuides =
    travelGuideData?.category?.children?.edges?.length > 0
  const categoryFeatures = featuresData?.category

  return (
    <>
      {/* === TOP AD === */}
      <div className={cx('ad-slot')}>
        {isMobile ? <MastHeadTopMobileHome /> : <MastHeadTopHome />}
      </div>

      {/* === TRAVEL GUIDES === */}
      {!travelGuideLoading && hasGuides && (
        <>
          <section className={cx('component-updates')}>
            <div className={cx('category-insights-component')}>
              <TravelGuideCategories data={travelGuideData} />
            </div>
          </section>
          <hr className={cx('divider')} />
        </>
      )}

      {/* === CATEGORY UPDATES === */}
      {!updatesLoading && categoryEdges.length > 0 && (
        <>
          <section className={cx('component-updates')}>
            <div className={cx('category-updates-component')}>
              <CategoryUpdates data={categoryEdges} />
            </div>
          </section>
          <hr className={cx('divider')} />
        </>
      )}

      {/* === BOTTOM AD === */}
      <div className={cx('ad-slot')}>
        {isMobile ? <MastHeadBottomMobileHome /> : <MastHeadBottomHome />}
      </div>

      {/* === CATEGORY TITLES === */}
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

      {/* === NEWS + HALF PAGE === */}
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

      {/* === CATEGORY FEATURES === */}
      <Suspense fallback={null}>
        {!featuresLoading && categoryFeatures && (
          <section className={cx('component-updates')}>
            <div className={cx('category-insights-component')}>
              <CategoryFeatures data={categoryFeatures} />
            </div>
          </section>
        )}
      </Suspense>
    </>
  )
}

export default memo(FrontPageLayout)
