import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageLayout.module.scss'
import dynamic from 'next/dynamic'

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
import { GetIndoCategory } from '../../queries/GetIndoCategory'

const cx = classNames.bind(styles)

const Outnow = dynamic(() => import('../../components/Outnow/Outnow'))
const CategoryUpdates = dynamic(() => import('../../components/CategoryUpdates/CategoryUpdates'))
const CategoryNewsUpdates = dynamic(() => import('../../components/CategoryNewsUpdates/CategoryNewsUpdates'))
const CategoryFeatures = dynamic(() => import('../../components/CategoryFeatures/CategoryFeatures'))
const CategoryIndo = dynamic(() => import('../../components/CategoryIndo/CategoryIndo'))

// const HalfPage1 = dynamic(() => import('../../components/AdUnit/HalfPage1/HalfPage1'))
// const MastHeadTop = dynamic(() => import('../../components/AdUnit/MastHeadTop/MastHeadTop'))

export default function FrontPageLayout() {
  // Query: Indo Category
  const { data: indoData, loading: indoLoading, error: indoError } = useQuery(GetIndoCategory, {
    variables: { include: ['14616', '14601', '14606', '14611'] },
  })

  // Query: Updates & News Updates (pakai query yang sama)
  const { data: updatesData, loading: updatesLoading, error: updatesError } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  const { data: newsupdatesData, loading: newsupdatesLoading, error: newsupdatesError } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  // Query: Features
  const { data: featuresData, loading: featuresLoading, error: featuresError } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
  })

  // Parsing Data
  const indoCategories = indoData?.categories?.edges?.map(edge => edge.node) || []
  const updatesCategory = updatesData?.category?.children?.edges || []
  const newsupdatesCategory = newsupdatesData?.category?.children?.edges || []
  const categoryFeatures = featuresData?.category

  return (
    <>
      {/* <HalfPage1 />
      <MastHeadTop /> */}

      {/* INDONESIA SECTION */}
      {!indoLoading && !indoError && indoCategories.length > 0 && (
        <div className={cx('component-updates')}>
          <div className={cx('category-insights-component')}>
            <CategoryIndo data={indoCategories} />
          </div>
        </div>
      )}

      <hr className={cx('divider')} />

      {/* CATEGORY UPDATES */}
      {!updatesLoading && !updatesError && updatesCategory.length > 0 && (
        <div className={cx('component-updates')}>
          <div className={cx('category-updates-component')}>
            <CategoryUpdates data={updatesCategory} />
          </div>
        </div>
      )}

      <hr className={cx('divider')} />

      {/* NEWS UPDATES - TITLE */}
      {newsupdatesCategory.map(({ node: category }) => {
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
            {!newsupdatesLoading && !newsupdatesError && newsupdatesCategory.length > 0 && (
              <div className={cx('category-updates-component')}>
                <CategoryNewsUpdates data={newsupdatesCategory} />
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
