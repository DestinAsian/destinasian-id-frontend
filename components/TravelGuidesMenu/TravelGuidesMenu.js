import { useQuery, useApolloClient } from '@apollo/client'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '../../constants/menus'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames/bind'
import styles from './TravelGuidesMenu.module.scss'
import flatListToHierarchical from '../../utilities/flatListToHierarchical'
import { GetPrimaryMenu } from '../../queries/GetPrimaryMenu'
import { GetTravelGuides } from '../../queries/GetTravelGuides'
import { GetTravelGuidesMenu } from '../../queries/GetTravelGuidesMenu'

const cx = classNames.bind(styles)

export default function TravelGuidesMenu(className) {
  const [results, setResults] = useState([])
  const client = useApolloClient()

  /** 🔹 Primary menu (header) */
  const { data: menusData } = useQuery(GetPrimaryMenu, {
    variables: { first: 20, headerLocation: PRIMARY_LOCATION },
    fetchPolicy: 'cache-first',
  })

  const primaryMenu = menusData?.headerMenuItems?.edges ?? []

  const mainCategoryLabels = useMemo(
    () =>
      primaryMenu
        .map((post) => post?.node?.connectedNode?.node?.name)
        .filter(Boolean)
        .slice(0, 6),
    [primaryMenu]
  )

  /** 🔹 Fetch Travel Guides by category */
  useEffect(() => {
    let isMounted = true

    const fetchGuides = async () => {
      try {
        const responses = await Promise.all(
          mainCategoryLabels.map((category) =>
            client.query({
              query: GetTravelGuides,
              variables: { search: category },
              fetchPolicy: 'cache-first',
            })
          )
        )

        const formatted = responses.map((res, index) => ({
          category: mainCategoryLabels[index],
          data: res?.data?.tags?.edges ?? [],
        }))

        if (isMounted) setResults(formatted)
      } catch (err) {
        // ❌ hanya log error (biar gampang debugging, tanpa spam console)
        console.error('Failed to fetch travel guides:', err)
      }
    }

    if (mainCategoryLabels.length > 0) fetchGuides()

    return () => {
      isMounted = false
    }
  }, [mainCategoryLabels, client])

  /** 🔹 Footer menu */
  const { data: footerMenusData, loading: footerMenusLoading } = useQuery(
    GetTravelGuidesMenu,
    {
      variables: {
        first: 30,
        footerHeaderLocation: FOOTER_LOCATION,
      },
      fetchPolicy: 'cache-first',
    }
  )

  const footerMenu = footerMenusData?.footerHeaderMenuItems?.nodes ?? []
  const hierarchicalMenuItems = useMemo(
    () => flatListToHierarchical(footerMenu),
    [footerMenu]
  )

  /** 🔹 Render menu */
  const renderMenu = (items) =>
    items?.map((item) => {
      const menuId = item?.id
      const parentName = item?.label
      const parentUri = item?.url || item?.path || '#'
      const childrenMenus = item?.connectedNode?.node?.children?.edges || []

      return (
        <div key={menuId} className={cx('menu-row')}>
          <div className={cx('parent-menu')}>
            <Link href={parentUri}>
              <span
                className={cx(
                  'title',
                  className?.className === 'dark-color' ? 'title-dark' : ''
                )}
              >
                {parentName}
              </span>
              <span className={cx('separator', 'parent-separator')}>|</span>
            </Link>
          </div>

          {childrenMenus.length > 0 && (
            <ul className={cx('children-menu')}>
              {childrenMenus.map((edge, index) => {
                const childName = edge?.node?.name
                const childUri = edge?.node?.uri

                return (
                  <li key={childUri} className={cx('nav-link')}>
                    {index > 0 && <span className={cx('separator')}>|</span>}
                    <Link href={childUri}>
                      <h2
                        className={cx(
                          'nav-name',
                          className?.className === 'dark-color'
                            ? 'nav-name-dark'
                            : ''
                        )}
                      >
                        {childName}
                      </h2>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )
    })

  /** 🔹 Render utama */
  if (footerMenusLoading) return null

  return (
    <div className={cx('travel-guides-menu', className)}>
      {renderMenu(hierarchicalMenuItems)}
    </div>
  )
}
