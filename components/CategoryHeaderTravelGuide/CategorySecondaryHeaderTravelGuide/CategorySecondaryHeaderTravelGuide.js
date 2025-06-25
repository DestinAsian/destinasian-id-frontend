import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './CategorySecondaryHeaderTravelGuide.module.scss'
import dynamic from 'next/dynamic'

const SingleNavigationTravelGuide = dynamic(() => import('../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/SingleNavigationTravelGuide/SingleNavigationTravelGuide'))
const ChildrenNavigationTravelGuide = dynamic(() => import('../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/ChildrenNavigationTravelGuide/ChildrenNavigationTravelGuide'))
const ParentNavigationTravelGuide = dynamic(() => import('../../../components/CategoryHeaderTravelGuide/CategorySecondaryHeaderTravelGuide/ParentNavigationTravelGuide/ParentNavigationTravelGuide'))


let cx = classNames.bind(styles)

export default function CategorySecondaryHeaderTravelGuide({
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
              <ParentNavigationTravelGuide
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
              <ChildrenNavigationTravelGuide
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
          {/* Single travelGuide navigation */}
          {data?.travelGuide?.categories?.edges[0]?.node?.parent && (
            <SingleNavigationTravelGuide
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
