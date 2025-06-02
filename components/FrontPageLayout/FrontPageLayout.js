import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageLayout.module.scss'

import dynamic from 'next/dynamic'
const Outnow = dynamic(() => import('../../components/Outnow/Outnow'))
const CategoryUpdates = dynamic(() =>
  import('../../components/CategoryUpdates/CategoryUpdates'),
)
const CategoryInsigths = dynamic(() =>
  import('../../components/CategoryInsigths/CategoryInsigths'),
)
const CategoryEatdrink = dynamic(() =>
  import('../../components/CategoryEatdrink/CategoryEatdrink'),
)
const CategoryIndo = dynamic(() =>
  import('../../components/CategoryIndo/CategoryIndo'),
)

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryInsights } from '../../queries/GetCategoryInsights'
import { GetCategoryEatdrink } from '../../queries/GetCategoryEatdrink'
import { GetIndoCategory } from '../../queries/GetIndoCategory'

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
    data: insightsData,
    loading: insightsLoading,
    error: insightsError,
  } = useQuery(GetCategoryInsights, {
    variables: { id: '29' },
  })
  const {
    data: eatdrinkData,
    loading: eatdrinkLoading,
    error: eatdrinkError,
  } = useQuery(GetCategoryEatdrink, {
    variables: { id: '651' },
  })

  const {
    data: indoData,
    loading: indoLoading,
    error: indoError,
  } = useQuery(GetIndoCategory, {
    variables: {
      include: ['14616', '14601', '14606', '14611'],
    },
  })

  // Safely extract category children edges for updates
  const updatesCategory = Array.isArray(updatesData?.category?.children?.edges)
    ? updatesData.category.children.edges
    : []

  // Safely extract category insights
  const categoryInsights = insightsData?.category
  const categoryEatdrink = eatdrinkData?.category
  const indoCategories =
    indoData?.categories?.edges?.map((edge) => edge.node) || []

  return (
    <>
      <div className={cx('component-indo')}>
        {!indoLoading && !indoError && indoCategories.length > 0 && (
          <div className={cx('category-indo-component')}>
            <CategoryIndo data={indoCategories} />
          </div>
        )}
      </div>
      <div className={cx('component-updates')}>
        <div className={cx('two-columns')}>
          <div className={cx('left-column')}>
            {!updatesLoading && !updatesError && updatesCategory.length > 0 && (
              <div className={cx('category-updates-component')}>
                <CategoryUpdates data={updatesCategory} />
              </div>
            )}
          </div>
          <div className={cx('right-column')}>
            <aside className="sticky top-14 h-auto sm:top-20">
              <div className={cx('outnow-component')}>
                <Outnow />
              </div>
            </aside>
          </div>
        </div>
      </div>
      <div className={cx('component-updates')}>
        {!insightsLoading && !insightsError && categoryInsights && (
          <div className={cx('category-insights-component')}>
            <CategoryInsigths data={categoryInsights} />
          </div>
        )}
      </div>
      <hr className={cx('divider')} />
      <div className={cx('component-updates')}>
        {!eatdrinkLoading && !eatdrinkError && categoryEatdrink && (
          <div className={cx('category-insights-component')}>
            <CategoryEatdrink data={categoryEatdrink} />
          </div>
        )}
      </div>
    </>
  )
}