import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageLayout.module.scss'

import { Outnow, CategoryUpdates } from '../../components'
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'

const cx = classNames.bind(styles)

export default function FrontPageLayout() {
  const {
    data: updatesData,
    loading: updatesLoading,
    error: updatesError,
  } = useQuery(GetCategoryUpdates, {
    variables: { include: ['41'] },
  })

  // Safely extract category children edges
  const updatesCategory = Array.isArray(updatesData?.category?.children?.edges)
    ? updatesData.category.children.edges
    : []

  return (
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
  )
}
