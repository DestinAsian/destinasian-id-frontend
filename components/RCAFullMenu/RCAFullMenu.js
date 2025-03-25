import { useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import { Button, FeaturedImage, NavigationMenu } from '../../components'
import styles from './RCAFullMenu.module.scss'
import React, { useState, useEffect } from 'react'
import * as MENUS from '../../constants/menus'
import { GetRCAMenu } from '../../queries/GetRCAMenu'
import Link from 'next/link'

let cx = classNames.bind(styles)

export default function RCAFullMenu({
  mainLogo,
  secondaryLogo,
  rcaDatabaseId,
  uri,
  isNavShown,
  setIsNavShown,
  className,
}) {
  const postsPerPage = 100
  const firstYearOfRCA = 2007

  // Get Pages
  const { data, error, loading } = useQuery(GetRCAMenu, {
    variables: {
      first: postsPerPage,
      after: null,
      id: rcaDatabaseId,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Get all posts (including nested child posts if needed)
  const allPosts =
    data?.readersChoiceAward?.children?.edges.map((post) => post.node) || []

  // Filter posts where `parentCustomLabel` is null
  const filteredAllPosts = allPosts.filter(
    (post) => post?.rcaPageAttributes?.parentCustomLabel === null,
  )

  // Function to filter out duplicate categories
  const uniqueCategories = filteredAllPosts.reduce((unique, post) => {
    const categoryName = post?.categories?.edges[0]?.node?.name
    if (!unique.includes(categoryName)) {
      unique.push(categoryName)
    }
    return unique
  }, [])

  const extractYearFromURI = (uri) => {
    if (!uri) return null // Handle case where uri is undefined/null
    const match = uri.match(/\b(19|20)\d{2}\b/) // Find a 4-digit year (from 1900-2099)
    return match ? parseInt(match[0], 10) : null // Convert to integer and return
  }

  const getOrdinalSuffix = (number) => {
    if (!number) return '' // Handle null cases
    if (number % 100 >= 11 && number % 100 <= 13) return number + 'th' // Special case for 11-13
    switch (number % 10) {
      case 1:
        return number + 'st'
      case 2:
        return number + 'nd'
      case 3:
        return number + 'rd'
      default:
        return number + 'th'
    }
  }

  const yearOfRCA = extractYearFromURI(uri)
  const anniversary = yearOfRCA ? yearOfRCA - firstYearOfRCA : null
  const formattedAnniversary = anniversary
    ? getOrdinalSuffix(anniversary)
    : 'Unknown'

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  if (loading) {
    return (
      <>
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
          <Button className="gap-x-4 ">{'Loading...'}</Button>
        </div>
      </>
    )
  }

  return (
    <div className={cx('component')}>
      {/* Full menu */}
      <div
        className={cx(
          'full-menu-content',
          className === 'light-color' ? 'full-menu-content-light' : '',
        )}
      >
        <div className={cx('menu-wrapper')}>
          {/* <NavigationMenu
            className={cx(['rca-navigation-menu'])}
            menuItems={filteredAllPosts}
          /> */}
          <div className={cx(['rca-navigation-menu'])}>
            <div className={cx('menu-name')}>
              {uri && (
                <Link href={uri}>
                  <span>
                    {`${formattedAnniversary} Annual Readers’ Choice Awards - ${yearOfRCA}`}
                  </span>
                </Link>
              )}
            </div>
            <div className={cx('menu')}>
              {uniqueCategories.map((categoryName, index) => (
                <div className={cx('menu-list-wrapper')} key={index}>
                  <div className={cx('category-wrapper')}>
                    <h2 className={cx('category')}>{categoryName}</h2>
                  </div>
                  <div className={cx('content-wrapper')}>
                    {filteredAllPosts.map((post) => {
                      const postCategory =
                        post?.categories?.edges[0]?.node?.name
                      if (postCategory === categoryName) {
                        return (
                          <div className={cx('content')} key={post?.id}>
                            <div className={cx('title-wrapper')}>
                              {post?.uri && (
                                <Link href={post?.uri}>
                                  <span className={cx('title')}>
                                    {post?.title}
                                  </span>
                                </Link>
                              )}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* close button */}
          <div className={cx('close-button')}>
            <button
              type="button"
              className={cx('close-icon')}
              onClick={() => {
                setIsNavShown(!isNavShown)
              }}
              aria-label="Toggle navigation"
              aria-controls={cx('full-menu-wrapper')}
              aria-expanded={!isNavShown}
            >
              <svg
                width="83"
                height="79"
                viewBox="0 0 83 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M53.8 17.85L49.9 16.95L49.9 2.49634e-06L82.45 1.81358e-07L82.45 17.55L77.05 18.6L60.1 39.9L77.05 58.05L81.7 59.55L81.7 78.6L38.05 78.6L38.05 60.9L42.1 59.55L36.1 51.9L35.8 51.9L29.65 59.55L33.55 60.9L33.55 78.6L2.79999 78.6L2.79999 59.55L8.34999 58.2L23.95 40.05L5.64998 18.45L0.699985 17.55L0.699983 5.99549e-06L44.05 2.9124e-06L44.05 16.95L39.85 17.85L47.65 26.25L47.95 26.25L53.8 17.85Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
