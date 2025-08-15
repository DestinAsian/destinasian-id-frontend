import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryDesktopSecondaryHeaderTravelGuide.module.scss'
import dynamic from 'next/dynamic'


// import ChildrenNavigationTravelGuide from '../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/ChildrenNavigationTravelGuide/ChildrenNavigationTravelGuide'
// import ParentNavigationTravelGuide from '../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/ParentNavigationTravelGuide/ParentNavigationTravelGuide'
// import SingleNavigationTravelGuide from '../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/SingleNavigationTravelGuide/SingleNavigationTravelGuide'
import ChildrenNavigationTravelGuide from '../../../components/CategoryHeader/CategorySecondaryHeader/ChildrenNavigation/ChildrenNavigation'
import ParentNavigationTravelGuide from '../../../components/CategoryHeader/CategorySecondaryHeader/ParentNavigation/ParentNavigation'
import SingleNavigationTravelGuide from '../../../components/CategoryHeader/CategorySecondaryHeader/SingleNavigation/SingleNavigation'

let cx = classNames.bind(styles)

export default function CategoryDesktopSecondaryHeaderTravelGuide({
  data,
  databaseId,
  categoryUri,
  name,
  parent,
  parentCategory,
}) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [isMainNavShown, setIsMainNavShown] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)

  // Ambil current URL dan atur body overflow
  useEffect(() => {
    setCurrentUrl(window.location.pathname)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMainNavShown || isNavShown ? 'hidden' : 'visible'
  }, [isMainNavShown, isNavShown])

  function isActive(uri) {
    return `${currentUrl}/` === uri
  }

  function isActiveCategory(uri) {
    return categoryUri === uri
  }


  return (
    <nav className={cx('component')}>
      <div className={cx('container-wrapper', 'sticky')}>
        <div className={cx('navbar')}>
          {/* Parent category navigation */}
          {data?.category?.children?.edges?.length > 0 && (
            <ParentNavigationTravelGuide
              databaseId={databaseId}
              isActive={isActive}
              isMainNavShown={isMainNavShown}
              setIsMainNavShown={setIsMainNavShown}
              isNavShown={isNavShown}
              setIsNavShown={setIsNavShown}
              categoryName={name}
            />
          )}
          {/* Children category navigation */}
          {!data?.category?.children?.edges?.length &&
            data?.category?.parent?.node?.children?.edges?.length > 0 && (
              <ChildrenNavigationTravelGuide
                databaseId={databaseId}
                isActive={isActive}
                isMainNavShown={isMainNavShown}
                setIsMainNavShown={setIsMainNavShown}
                isNavShown={isNavShown}
                setIsNavShown={setIsNavShown}
                categoryName={parent}
              />
            )}
          {/* Single travelGuide navigation */}
          {data?.travelGuide?.categories?.edges[0]?.node?.parent && (
            <SingleNavigationTravelGuide
              databaseId={databaseId}
              isActiveCategory={isActiveCategory}
              isMainNavShown={isMainNavShown}
              setIsMainNavShown={setIsMainNavShown}
              isNavShown={isNavShown}
              setIsNavShown={setIsNavShown}
              categoryName={parentCategory}
            />
          )}
        </div>
      </div>
    </nav>
  )
}
