// import React from 'react'
// import { useQuery } from '@apollo/client'
// import classNames from 'classnames/bind'
// import styles from './FrontPageLayout.module.scss'

// import { Outnow, CategoryUpdates } from '../../components'
// import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'

// const cx = classNames.bind(styles)

// export default function FrontPageLayout() {
//   const {
//     data: updatesData,
//     loading: updatesLoading,
//     error: updatesError,
//   } = useQuery(GetCategoryUpdates, {
//     variables: { include: ['41'] },
//   })

//   // Safely extract category children edges
//   const updatesCategory = Array.isArray(updatesData?.category?.children?.edges)
//     ? updatesData.category.children.edges
//     : []

//   return (
//     <div className={cx('component-updates')}>
//       <div className={cx('two-columns')}>
//         <div className={cx('left-column')}>
//           {!updatesLoading && !updatesError && updatesCategory.length > 0 && (
//             <div className={cx('category-updates-component')}>
//               <CategoryUpdates data={updatesCategory} />
//             </div>
//           )}
//         </div>
//         <div className={cx('right-column')}>
//           <aside className="sticky top-14 h-auto sm:top-20">
//             <div className={cx('outnow-component')}>
//               <Outnow />
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   )
// }

import React from 'react'
import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import styles from './FrontPageLayout.module.scss'

import { Outnow, CategoryUpdates, CategoryInsigths } from '../../components'
import { GetCategoryUpdates } from '../../queries/GetCategoryUpdates'
import { GetCategoryInsights } from '../../queries/GetCategoryInsights' // Import the query for CategoryInsigths

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
    variables: { id: '29' }, // The ID of the category to fetch insights for
  })

  // Safely extract category children edges for updates
  const updatesCategory = Array.isArray(updatesData?.category?.children?.edges)
    ? updatesData.category.children.edges
    : []

  // Safely extract category insights
  const categoryInsights = insightsData?.category

  return (
    <>
      <div className={cx('component-updates')}>
        <div className={cx('two-columns')}>
          <div className={cx('left-column')}>
            {/* Render CategoryUpdates if data is available */}
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
        {/* Render CategoryInsigths if data is available */}
        {!insightsLoading && !insightsError && categoryInsights && (
          <div className={cx('category-insights-component')}>
            <CategoryInsigths data={categoryInsights} />
          </div>
        )}
      </div>
    </>
  )
}
