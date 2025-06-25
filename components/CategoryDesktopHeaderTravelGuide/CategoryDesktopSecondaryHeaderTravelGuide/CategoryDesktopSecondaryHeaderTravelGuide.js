import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryDesktopSecondaryHeaderTravelGuide.module.scss'
import dynamic from 'next/dynamic'


const ChildrenNavigationTravelGuide = dynamic(() => import('../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/ChildrenNavigationTravelGuide/ChildrenNavigationTravelGuide'))
const ParentNavigationTravelGuide = dynamic(() => import('../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/ParentNavigationTravelGuide/ParentNavigationTravelGuide'))
const SingleNavigationTravelGuide = dynamic(() => import('../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/SingleNavigationTravelGuide/SingleNavigationTravelGuide'))

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
  const [categoryUrl, setCategoryUrl] = useState('')
  const [isMainNavShown, setIsMainNavShown] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)

  useEffect(() => {
    setCurrentUrl(window.location.pathname)
  }, [])

  useEffect(() => {
    setCategoryUrl(categoryUri)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMainNavShown || isNavShown ? 'hidden' : 'visible'
  }, [isMainNavShown, isNavShown])

  function isActive(uri) {
    return currentUrl + '/' === uri
  }

  function isActiveCategory(uri) {
    return categoryUrl === uri
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
