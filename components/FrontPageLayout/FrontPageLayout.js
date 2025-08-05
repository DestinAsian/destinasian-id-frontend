'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import styles from './FrontPageLayout.module.scss'
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import { GetChildrenTravelGuides } from '../../queries/GetChildrenTravelGuides'

import TravelGuideCategories from '../TravelGuideCategories/TravelGuideCategories'
import CategoryUpdates from '../CategoryUpdates/CategoryUpdates'
import CategoryNewsUpdates from '../CategoryNewsUpdates/CategoryNewsUpdates'
import CategoryFeatures from '../CategoryFeatures/CategoryFeatures'

const MastHeadTopHome = dynamic(() => import('../AdUnit/MastHeadTop/MastHeadTopHome'))
const MastHeadTopMobileHome = dynamic(() => import('../AdUnit/MastHeadTopMobile/MastHeadTopMobileHome'))
const MastHeadBottomHome = dynamic(() => import('../AdUnit/MastHeadBottom/MastHeadBottomHome'))
const MastHeadBottomMobileHome = dynamic(() => import('../AdUnit/MastHeadBottomMobile/MastHeadBottomMobileHome'))
const HalfPageHome1 = dynamic(() => import('../AdUnit/HalfPage1/HalfPageHome1'))

const cx = classNames.bind(styles)

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

export default function FrontPageLayout() {
  const isMobile = useIsMobile()

  const { data: travelGuideData, loading: travelGuideLoading } = useQuery(GetChildrenTravelGuides, {
    fetchPolicy: 'cache-first',
  })

  const { data: updatesData, loading: updatesLoading } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
    fetchPolicy: 'cache-first',
  })

  const { data: featuresData, loading: featuresLoading } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
    fetchPolicy: 'cache-first',
  })

  const categoryEdges = updatesData?.category?.children?.edges || []
  const categoryFeatures = featuresData?.category

  return (
    <>
      <div>{isMobile ? <MastHeadTopMobileHome /> : <MastHeadTopHome />}</div>

      {/* TRAVEL GUIDE CHILDREN */}
      {!travelGuideLoading && travelGuideData?.category?.children?.edges?.length > 0 && (
        <div className={cx('component-updates')}>
          <div className={cx('category-insights-component')}>
            <TravelGuideCategories data={travelGuideData} />
          </div>
        </div>
      )}

      <hr className={cx('divider')} />

      {/* CATEGORY UPDATES */}
      {!updatesLoading && categoryEdges.length > 0 && (
        <div className={cx('component-updates')}>
          <div className={cx('category-updates-component')}>
            <CategoryUpdates data={categoryEdges} />
          </div>
        </div>
      )}

      <hr className={cx('divider')} />

      <div>{isMobile ? <MastHeadBottomMobileHome /> : <MastHeadBottomHome />}</div>

      <hr className={cx('divider')} />

      {/* CATEGORY TITLES */}
      {categoryEdges.map(({ node: category }) => {
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
            {categoryEdges.length > 0 && (
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
      <Suspense fallback={<div>Loading features…</div>}>
        {!featuresLoading && categoryFeatures && (
          <div className={cx('component-updates')}>
            <div className={cx('category-insights-component')}>
              <CategoryFeatures data={categoryFeatures} />
            </div>
          </div>
        )}
      </Suspense>
    </>
  )
}
