import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageLayout.module.scss'

import dynamic from 'next/dynamic'

const Outnow = dynamic(() => 
  import('../../components/Outnow/Outnow'),
)
const CategoryUpdates = dynamic(() =>
  import('../../components/CategoryUpdates/CategoryUpdates'),
)
const CategoryNewsUpdates = dynamic(() =>
  import('../../components/CategoryNewsUpdates/CategoryNewsUpdates'),
)
const CategoryInsigths = dynamic(() =>
  import('../../components/CategoryInsigths/CategoryInsigths'),
)
const CategoryFeatures = dynamic(() =>
  import('../../components/CategoryFeatures/CategoryFeatures'),
)
const CategoryEatdrink = dynamic(() =>
  import('../../components/CategoryEatdrink/CategoryEatdrink'),
)
const CategoryIndo = dynamic(() =>
  import('../../components/CategoryIndo/CategoryIndo'),
)
const VideoFrontPage = dynamic(() =>
  import('../../components/VideoFrontPage/VideoFrontPage'),
)
const ContentWrapperVideo = dynamic(() =>
  import('../../components/ContentWrapperVideo/ContentWrapperVideo'),
)

import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryInsights } from '../../queries/GetCategoryInsights'
import { GetCategoryFeatures } from '../../queries/GetCategoryFeatures'
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
    data: newsupdatesData,
    loading: newsupdatesLoading,
    error: newsupdatesError,
  } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  // const { data } = useQuery(GetCategoryUpdates, {
  //   variables: { include: ['41'] },
  // })

  // const children = data?.category?.children?.edges || []

  const {
    data: insightsData,
    loading: insightsLoading,
    error: insightsError,
  } = useQuery(GetCategoryInsights, {
    variables: { id: '29' },
  })

  const {
    data: featuresData,
    loading: featuresLoading,
    error: featuresError,
  } = useQuery(GetCategoryFeatures, {
    variables: { id: '20' },
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

  const updatesCategory = Array.isArray(updatesData?.category?.children?.edges)
    ? updatesData.category.children.edges
    : []

  const newsupdatesCategory = Array.isArray(
    newsupdatesData?.category?.children?.edges,
  )
    ? newsupdatesData.category.children.edges
    : []

  const categoryInsights = insightsData?.category
  const categoryFeatures = featuresData?.category
  const categoryEatdrink = eatdrinkData?.category

  const indoCategories =
    indoData?.categories?.edges?.map((edge) => edge.node) || []
  return (
    <>
      <div className={cx('component-updates')}>
        {!indoLoading && !indoError && indoCategories.length > 0 && (
          <div className={cx('category-insights-component')}>
            <CategoryIndo data={indoCategories} />
          </div>
        )}
      </div>

      <hr className={cx('divider')} />

      <div className={cx('component-updates')}>
        {!updatesLoading && !updatesError && updatesCategory.length > 0 && (
          <div className={cx('category-updates-component')}>
            <CategoryUpdates data={updatesCategory} />
          </div>
        )}
      </div>
      <hr className={cx('divider')} />

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

      <div className={cx('component-news-updates')}>
        <div className={cx('two-columns')}>
          <div className={cx('left-column')}>
            {!newsupdatesLoading &&
              !newsupdatesError &&
              newsupdatesCategory.length > 0 && (
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

      <div className={cx('component-updates')}>
        {!featuresLoading && !featuresError && categoryFeatures && (
          <div className={cx('category-insights-component')}>
            <CategoryFeatures data={categoryFeatures} />
          </div>
        )}
      </div>

      {/* <div className={cx('component-updates')}>
        {!insightsLoading && !insightsError && categoryInsights && (
          <div className={cx('category-insights-component')}>
            <CategoryInsigths data={categoryInsights} />
          </div>
        )}
      </div> */}

      {/* <div className={cx('component-updates')}>
        {!eatdrinkLoading && !eatdrinkError && categoryEatdrink && (
          <div className={cx('category-insights-component')}>
            <CategoryEatdrink data={categoryEatdrink} />
          </div>
        )}
      </div> */}
    </>
  )
}
