import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './CategoryDesktopSecondaryHeader.module.scss'

import ChildrenNavigation from '../../../components/CategoryHeader/CategorySecondaryHeader/ChildrenNavigation/ChildrenNavigation'
import ParentNavigation from '../../../components/CategoryHeader/CategorySecondaryHeader/ParentNavigation/ParentNavigation'
import SingleNavigation from '../../../components/CategoryHeader/CategorySecondaryHeader/SingleNavigation/SingleNavigation'

const cx = classNames.bind(styles)

export default function CategoryDesktopSecondaryHeader({
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
  }, [categoryUri])

  useEffect(() => {
    // Prevent body scroll when navigation menus are open
    document.body.style.overflow = isMainNavShown || isNavShown ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMainNavShown, isNavShown])

  const isActive = (uri) => currentUrl + '/' === uri
  const isActiveCategory = (uri) => categoryUrl === uri

  return (
    <nav className={cx('component')}>
      <div className={cx('container-wrapper', 'sticky')}>
        <div className={cx('navbar')}>
          {data?.category?.children?.edges?.length > 0 && (
            <ParentNavigation
              databaseId={databaseId}
              isActive={isActive}
              isMainNavShown={isMainNavShown}
              setIsMainNavShown={setIsMainNavShown}
              isNavShown={isNavShown}
              setIsNavShown={setIsNavShown}
              categoryName={name}
            />
          )}

          {!data?.category?.children?.edges?.length &&
            data?.category?.parent?.node?.children?.edges?.length > 0 && (
              <ChildrenNavigation
                databaseId={databaseId}
                isActive={isActive}
                isMainNavShown={isMainNavShown}
                setIsMainNavShown={setIsMainNavShown}
                isNavShown={isNavShown}
                setIsNavShown={setIsNavShown}
                categoryName={parent}
              />
            )}

          {data?.travelGuide?.categories?.edges[0]?.node?.parent && (
            <SingleNavigation
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
