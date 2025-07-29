import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import Link from 'next/link'

import styles from './FrontPageLayout.module.scss'
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import { GetChildrenTravelGuides } from '../../queries/GetChildrenTravelGuides'

import TravelGuideCategories from '../TravelGuideCategories/TravelGuideCategories'
import CategoryUpdates from '../CategoryUpdates/CategoryUpdates'
import CategoryNewsUpdates from '../CategoryNewsUpdates/CategoryNewsUpdates'
import CategoryFeatures from '../CategoryFeatures/CategoryFeatures'
import HalfPageHome1 from '../AdUnit/HalfPage1/HalfPageHome1'
import MastHeadTopHome from '../AdUnit/MastHeadTop/MastHeadTopHome'
import MastHeadTopMobileHome from '../AdUnit/MastHeadTopMobile/MastHeadTopMobileHome'
import MastHeadBottomHome from '../AdUnit/MastHeadBottom/MastHeadBottomHome'
import MastHeadBottomMobileHome from '../AdUnit/MastHeadBottomMobile/MastHeadBottomMobileHome'

const cx = classNames.bind(styles)

export default function FrontPageLayout() {
  const [isMobile, setIsMobile] = useState(false)

  const { data: travelGuideData, loading: travelGuideLoading, error: travelGuideError } = useQuery(GetChildrenTravelGuides, {
    fetchPolicy: 'cache-first',
  })

  const { data: updatesData, loading: updatesLoading, error: updatesError } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
    fetchPolicy: 'cache-first',
  })

  const { data: featuresData, loading: featuresLoading, error: featuresError } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
    fetchPolicy: 'cache-first',
  })

  const categoryEdges = updatesData?.category?.children?.edges || []
  const categoryFeatures = featuresData?.category

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div>{isMobile ? <MastHeadTopMobileHome /> : <MastHeadTopHome />}</div>

      {/* TRAVEL GUIDE CHILDREN */}
      {!travelGuideLoading && !travelGuideError && travelGuideData?.category?.children?.edges?.length > 0 && (
        <div className={cx('component-updates')}>
          <div className={cx('category-insights-component')}>
            <TravelGuideCategories data={travelGuideData} />
          </div>
        </div>
      )}

      <hr className={cx('divider')} />

      {/* CATEGORY UPDATES */}
      {!updatesLoading && !updatesError && categoryEdges.length > 0 && (
        <div className={cx('component-updates')}>
          <div className={cx('category-updates-component')}>
            <CategoryUpdates data={categoryEdges} />
          </div>
        </div>
      )}

      <hr className={cx('divider')} />

      <div>
        {isMobile ? <MastHeadBottomMobileHome /> : <MastHeadBottomHome />}
      </div>

      <hr className={cx('divider')} />

      {/* CATEGORY UPDATES TITLES */}
      {categoryEdges.length > 0 &&
        categoryEdges.map(({ node: category }) => {
          const parentName = category?.parent?.node?.name || ''
          const childName = category.name
          return (
            <div key={category.id} className={cx('category-updates-component')}>
              <Link href={category.uri}>
                <h2 className={styles.title}>
                  {parentName ? `${parentName} ${childName}` : childName}
                </h2>
              </Link>
            </div>
          )
        })}

      {/* CATEGORY NEWS UPDATES + HALF PAGE */}
      <div className={cx('component-news-updates')}>
        <div className={cx('two-columns')}>
          <div className={cx('left-column')}>
            {!updatesLoading && !updatesError && categoryEdges.length > 0 && (
              <div className={cx('category-updates-component')}>
                <CategoryNewsUpdates data={categoryEdges} />
              </div>
            )}
          </div>
          <div className={cx('right-column')}>
            <aside className={cx('outnow-wrapper')}>
              <div className={cx('outnow-component')}>
                <HalfPageHome1 />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <hr className={cx('divider-news-updates')} />

      {/* CATEGORY FEATURES */}
      {!featuresLoading && !featuresError && categoryFeatures && (
        <div className={cx('component-updates')}>
          <div className={cx('category-insights-component')}>
            <CategoryFeatures data={categoryFeatures} />
          </div>
        </div>
      )}
    </>
  )
}