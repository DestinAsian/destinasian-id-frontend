import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './CategorySecondaryHeader.module.scss'
import dynamic from 'next/dynamic'

// const ChildrenNavigation = dynamic(() => import('../../../components/CategoryHeader/CategorySecondaryHeader/ChildrenNavigation/ChildrenNavigation'))
// const ParentNavigation = dynamic(() => import('../../../components/CategoryHeader/CategorySecondaryHeader/ParentNavigation/ParentNavigation'))
// const SingleNavigation = dynamic(() => import('../../../components/CategoryHeader/CategorySecondaryHeader/SingleNavigation/SingleNavigation'))
import ChildrenNavigation from '../../../components/CategoryHeader/CategorySecondaryHeader/ChildrenNavigation/ChildrenNavigation'
import ParentNavigation from '../../../components/CategoryHeader/CategorySecondaryHeader/ParentNavigation/ParentNavigation'
import SingleNavigation from '../../../components/CategoryHeader/CategorySecondaryHeader/SingleNavigation/SingleNavigation'



let cx = classNames.bind(styles)

export default function CategorySecondaryHeader({
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
  const [isScrolled, setIsScrolled] = useState(false)
  const [prevScrollY, setPrevScrollY] = useState(0) 

  // Add currentUrl function
  useEffect(() => {
    setCurrentUrl(window.location.pathname)
  }, [])
  function isActive(uri) {
    return currentUrl + '/' === uri
  }

  // Add currentCategoryUrl function
  useEffect(() => {
    setCategoryUrl(categoryUri)
  }, [])
  function isActiveCategory(uri) {
    return categoryUrl === uri
  }

  // Stop scrolling pages when isNavShown
  useEffect(() => {
    if (isMainNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isMainNavShown])

  // Stop scrolling pages when isNavShown
  useEffect(() => {
    if (isNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isNavShown])

  // Show sticky header when scroll down, Hide it when scroll up
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      setIsScrolled(
        currentScrollY > 0,
        // && currentScrollY < prevScrollY
      )
      setPrevScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollY])

  return (
    <nav className={cx('component')}>
      <div
        className={cx(
          'container-wrapper',
          { sticky: isScrolled },
          isMainNavShown || isNavShown ? 'show' : undefined,
        )}
      >
        <div className={cx('navbar')}>
          {/* Parent category navigation */}
          {data?.category?.children?.edges?.length != 0 &&
            data?.category?.children != null &&
            data?.category?.children != undefined && (
              <ParentNavigation
                databaseId={databaseId}
                isActive={isActive}
                isMainNavShown={isMainNavShown}
                setIsMainNavShown={setIsMainNavShown}
                isNavShown={isNavShown}
                setIsNavShown={setIsNavShown}
                isScrolled={isScrolled}
                categoryName={name}
              />
            )}
          {/* Children category navigation */}
          {!data?.category?.children?.edges?.length &&
            data?.category?.parent?.node?.children?.edges?.length != 0 &&
            data?.category?.parent != null &&
            data?.category?.parent != undefined && (
              <ChildrenNavigation
                databaseId={databaseId}
                isActive={isActive}
                isMainNavShown={isMainNavShown}
                setIsMainNavShown={setIsMainNavShown}
                isNavShown={isNavShown}
                setIsNavShown={setIsNavShown}
                isScrolled={isScrolled}
                categoryName={parent}
              />
            )}
          {/* Single post navigation */}
          {data?.post?.categories?.edges[0]?.node?.parent && (
            <SingleNavigation
              databaseId={databaseId}
              isActiveCategory={isActiveCategory}
              isMainNavShown={isMainNavShown}
              setIsMainNavShown={setIsMainNavShown}
              isNavShown={isNavShown}
              setIsNavShown={setIsNavShown}
              isScrolled={isScrolled}
              categoryName={parentCategory}
            />
          )}
        </div>
      </div>
    </nav>
  )
}
