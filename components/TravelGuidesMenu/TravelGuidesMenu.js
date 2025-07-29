
import { useQuery, useApolloClient } from '@apollo/client'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '../../constants/menus'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Accordion } from 'flowbite-react'
import classNames from 'classnames/bind'
import styles from './TravelGuidesMenu.module.scss'
import flatListToHierarchical from '../../utilities/flatListToHierarchical'
import { GetPrimaryMenu } from '../../queries/GetPrimaryMenu'
import { GetTravelGuides } from '../../queries/GetTravelGuides'
import { GetTravelGuidesMenu } from '../../queries/GetTravelGuidesMenu'
import Image from 'next/image'

const cx = classNames.bind(styles)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function TravelGuidesMenu(className) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [HonorsCircleArray, setHonorsCircle] = useState([])

  const client = useApolloClient()

  const { data: menusData, loading: menusLoading } = useQuery(GetPrimaryMenu, {
    variables: {
      first: 20,
      headerLocation: PRIMARY_LOCATION,
    },
    fetchPolicy: 'cache-first',
  })

  const primaryMenu = menusData?.headerMenuItems?.edges ?? []

  const mainCategoryLabels = useMemo(() => {
    return primaryMenu
      .map((post) => post?.node?.connectedNode?.node?.name)
      .filter(Boolean)
  }, [primaryMenu])

  const { data: travelGuidesData, loading: travelGuidesloading, error: travelGuidesError } = useQuery(
    GetTravelGuides,
    {
      variables: { search: 'null' },
      fetchPolicy: 'cache-first',
    }
  )

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        const topCategories = mainCategoryLabels.slice(0, 6) // HANYA ambil 6 kategori teratas

        const allResults = await Promise.all(
          topCategories.map(async (category) => {
            const response = await client.query({
              query: GetTravelGuides,
              variables: { search: category },
              fetchPolicy: 'cache-first',
            })
            const processedData = response?.data?.tags?.edges ?? []
            return { category, data: processedData }
          })
        )

        if (isMounted) {
          setResults(allResults)
          // Delay ringan agar menu tampil duluan
          setTimeout(() => {
            setHonorsCircle(allResults)
          }, 300)
        }
      } catch (error) {
        console.error('Failed fetching guides:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (mainCategoryLabels.length > 0) {
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [mainCategoryLabels, client])

  const { data: footerMenusData, loading: footerMenusLoading } = useQuery(GetTravelGuidesMenu, {
    variables: {
      first: 1000,
      footerHeaderLocation: FOOTER_LOCATION,
    },
    fetchPolicy: 'cache-first',
  })

  const footerMenu = footerMenusData?.footerHeaderMenuItems?.nodes ?? []
  const hierarchicalMenuItems = flatListToHierarchical(footerMenu)

  if (loading || menusLoading || travelGuidesloading || footerMenusLoading) {
    return (
      <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]">
        <div role="status">
          <svg
            aria-hidden="true"
            className="text-black-200 dark:text-black-600 mr-2 h-[80vh] w-8 animate-spin fill-black"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    )
  }

  function renderMenu(items) {
    return (
      <>
        {items?.map((item) => {
          const menuId = item?.id
          const parentName = item?.label
          const parentUri = item?.url || item?.path || '#'

          const childrenMenus = item?.connectedNode?.node?.children?.edges || []

          return (
            <div key={menuId} id={menuId} className={cx('menu-row')}>
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
        })}
      </>
    )
  }

  return (
    <div className={cx('travel-guides-menu', className)}>
      {renderMenu(hierarchicalMenuItems)}
      {/* Kamu bisa menambahkan render HonorsCircleArray di sini jika diperlukan */}
    </div>
  )
}
