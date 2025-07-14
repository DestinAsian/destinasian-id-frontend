import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageLayout.module.scss'
import dynamic from 'next/dynamic'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import { GetChildrenTravelGuides } from '../../queries/GetChildrenTravelGuides'
import TravelGuideCategories from '../TravelGuideCategories/TravelGuideCategories'

const Outnow = dynamic(() => import('../Outnow/Outnow'))

const CategoryUpdates = dynamic(() =>
  import('../CategoryUpdates/CategoryUpdates'),
)

const CategoryNewsUpdates = dynamic(() =>
  import('../CategoryNewsUpdates/CategoryNewsUpdates'),
)

const CategoryFeatures = dynamic(() =>
  import('../CategoryFeatures/CategoryFeatures'),
)


const cx = classNames.bind(styles)

export default function FrontPageLayout() {
  const {
    data: updatesData,
    loading: updatesLoading,
    error: updatesError,
  } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  const {
    data: featuresData,
    loading: featuresLoading,
    error: featuresError,
  } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
  })

  // Parsing Data
  const categoryEdges = updatesData?.category?.children?.edges || []
  const categoryFeatures = featuresData?.category

  const {
    data: travelGuideData,
    loading: travelGuideLoading,
    error: travelGuideError,
  } = useQuery(GetChildrenTravelGuides)
  return (
    <>
      {/* <HalfPage1 />
      <MastHeadTop /> */}

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

      <hr className={cx('divider')} />

      {/* NEWS UPDATES - TITLE */}
      {categoryEdges.map(({ node: category }) => {
        const parentName = category?.parent?.node?.name || ''
        const childName = category.name
        return (
          <div key={category.id} className={cx('category-updates-component')}>
            <h2 className={styles.title}>
              {parentName ? `${parentName} ${childName}` : childName}
            </h2>
          </div>
        )
      })}

      {/* NEWS UPDATES - CONTENT + OUTNOW */}
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
                <Outnow />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <hr className={cx('divider')} />

      {/* FEATURES */}
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
