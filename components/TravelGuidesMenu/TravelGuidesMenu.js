"use client";

import React, { useMemo } from 'react'
import useSWR from 'swr'
import { useApolloClient } from '@apollo/client'
import Link from 'next/link'
import classNames from 'classnames/bind'

import styles from './TravelGuidesMenu.module.scss'
import flatListToHierarchical from '../../utilities/flatListToHierarchical'
import { GetPrimaryMenu } from '../../queries/GetPrimaryMenu'
import { GetTravelGuides } from '../../queries/GetTravelGuides'
import { GetTravelGuidesMenu } from '../../queries/GetTravelGuidesMenu'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '../../constants/menus'

const cx = classNames.bind(styles)

/* ================================
   SWR Fetcher with Apollo Client
================================ */
const apolloFetcher = (client, query, variables) =>
  client.query({
    query,
    variables,
    fetchPolicy: 'cache-first',
  })

export default function TravelGuidesMenu({ className }) {
  const client = useApolloClient()

  /* ================================
     PRIMARY MENU (HEADER)
  ================================ */
  const { data: menusData } = useSWR(
    ['primary-menu'],
    () =>
      apolloFetcher(client, GetPrimaryMenu, {
        first: 5,
        headerLocation: PRIMARY_LOCATION,
      }),
    {
      revalidateOnFocus: false,
    }
  )

  const primaryMenu =
    menusData?.data?.headerMenuItems?.edges ?? []

  const mainCategoryLabels = useMemo(
    () =>
      primaryMenu
        .map((post) => post?.node?.connectedNode?.node?.name)
        .filter(Boolean)
        .slice(0, 6),
    [primaryMenu]
  )

  /* ================================
     TRAVEL GUIDES (PARALLEL FETCH)
  ================================ */
  const { data: guidesData } = useSWR(
    mainCategoryLabels.length
      ? ['travel-guides', mainCategoryLabels]
      : null,
    async () => {
      const responses = await Promise.all(
        mainCategoryLabels.map((category) =>
          apolloFetcher(client, GetTravelGuides, {
            search: category,
          })
        )
      )

      return responses.map((res, index) => ({
        category: mainCategoryLabels[index],
        data: res?.data?.tags?.edges ?? [],
      }))
    },
    {
      revalidateOnFocus: false,
    }
  )

  /* ================================
     FOOTER MENU
  ================================ */
  const { data: footerMenusData } = useSWR(
    ['footer-menu'],
    () =>
      apolloFetcher(client, GetTravelGuidesMenu, {
        first: 30,
        footerHeaderLocation: FOOTER_LOCATION,
      }),
    {
      revalidateOnFocus: false,
    }
  )

  const footerMenu =
    footerMenusData?.data?.footerHeaderMenuItems?.nodes ?? []

  const hierarchicalMenuItems = useMemo(
    () => flatListToHierarchical(footerMenu),
    [footerMenu]
  )

  /* ================================
     RENDER MENU (UNCHANGED)
  ================================ */
  const renderMenu = (items) =>
    items?.map((item) => {
      const menuId = item?.id
      const parentName = item?.label
      const parentUri = item?.url || item?.path || '#'
      const childrenMenus =
        item?.connectedNode?.node?.children?.edges || []

      return (
        <div key={menuId} className={cx('menu-row')}>
          <div className={cx('parent-menu')}>
            <Link href={parentUri}>
              <span
                className={cx(
                  'title',
                  className === 'dark-color' ? 'title-dark' : ''
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
                    {index > 0 && (
                      <span className={cx('separator')}>|</span>
                    )}
                    <Link href={childUri}>
                      <h2
                        className={cx(
                          'nav-name',
                          className === 'dark-color'
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

  return (
    <div className={cx('travel-guides-menu', className)}>
      {renderMenu(hierarchicalMenuItems)}
    </div>
  )
}
