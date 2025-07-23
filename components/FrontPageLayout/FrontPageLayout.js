// import React from 'react'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageLayout.module.scss'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// GraphQL Queries
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import { GetChildrenTravelGuides } from '../../queries/GetChildrenTravelGuides'

// Static Components
import TravelGuideCategories from '../TravelGuideCategories/TravelGuideCategories'

// Dynamic Imports
// Dynamic Imports (dengan ssr: false)
const Outnow = dynamic(() => import('../Outnow/Outnow'), { ssr: false })
const CategoryUpdates = dynamic(
  () => import('../CategoryUpdates/CategoryUpdates'),
  { ssr: false },
)
const CategoryNewsUpdates = dynamic(
  () => import('../CategoryNewsUpdates/CategoryNewsUpdates'),
  { ssr: false },
)
const CategoryFeatures = dynamic(
  () => import('../CategoryFeatures/CategoryFeatures'),
  { ssr: false },
)
const PreviewHalfPage1 = dynamic(() =>
  import('../../components/AdUnit/Preview/PreviewHalfPage1/PreviewHalfPage1'),
)
const MastHeadTop = dynamic(() =>
  import('../../components/AdUnit/MastHeadTop/MastHeadTop'),
)
const MastHeadTopMobile = dynamic(() =>
  import('../../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'),
)
const MastHeadBottom = dynamic(() =>
  import('../../components/AdUnit/MastHeadBottom/MastHeadBottom'),
)
const MastHeadBottomMobile = dynamic(() =>
  import('../../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile'),
)
const PreviewMastHeadBottom = dynamic(() =>
  import(
    '../../components/AdUnit/Preview/PreviewMastHeadBottom/PreviewMastHeadBottom'
  ),
)
const PreviewMastHeadBottomMobile = dynamic(() =>
  import(
    '../../components/AdUnit/Preview/PreviewMastHeadBottomMobile/PreviewMastHeadBottomMobile'
  ),
)

const cx = classNames.bind(styles)

export default function FrontPageLayout() {
  // Get Travel Guide Categories
  const {
    data: travelGuideData,
    loading: travelGuideLoading,
    error: travelGuideError,
  } = useQuery(GetChildrenTravelGuides, {
    fetchPolicy: 'cache-first',
    // nextFetchPolicy: 'cache-and-network',
  })

  // Get Updates
  const {
    data: updatesData,
    loading: updatesLoading,
    error: updatesError,
  } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
    fetchPolicy: 'cache-first',
    // nextFetchPolicy: 'cache-and-network',
  })

  // Get Features
  const {
    data: featuresData,
    loading: featuresLoading,
    error: featuresError,
  } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
    fetchPolicy: 'cache-first',
    // nextFetchPolicy: 'cache-and-network',
  })

  // Prepare Data
  const categoryEdges = updatesData?.category?.children?.edges || []
  const categoryFeatures = featuresData?.category

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div>{isMobile ? <MastHeadTopMobile /> : <MastHeadTop />}</div>
      {/* TRAVEL GUIDES CHILDREN */}
      {!travelGuideLoading &&
        !travelGuideError &&
        travelGuideData?.category?.children?.edges?.length > 0 && (
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
      {/* <div>{isMobile ? <MastHeadBottomMobile /> : <MastHeadBottom />}</div> */}
      <hr className={cx('divider')} />

      <div>
        {isMobile ? <PreviewMastHeadBottomMobile /> : <PreviewMastHeadBottom />}
      </div>
      <hr className={cx('divider')} />
      {/* CATEGORY UPDATES - TITLE */}
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

      {/* CATEGORY NEWS UPDATES + OUTNOW */}
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
                {/* <Outnow /> */}
                <PreviewHalfPage1 />
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
