import { useQuery, useApolloClient } from '@apollo/client'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '../../../constants/menus'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Accordion } from 'flowbite-react'
import classNames from 'classnames/bind'
import styles from './MainCategoryMenu.module.scss'
import flatListToHierarchical from '../../../utilities/flatListToHierarchical'
import { GetPrimaryMenu } from '../../../queries/GetPrimaryMenu'
import { GetTravelGuides } from '../../../queries/GetTravelGuides'
import { GetTravelGuidesMenu } from '../../../queries/GetTravelGuidesMenu'
import Image from 'next/image'

let cx = classNames.bind(styles)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function MainCategoryMenu(categoryName) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const client = useApolloClient()
  const [HonorsCircleArray, setHonorsCircle] = useState([])

  // const mainCategory = categoryName?.categoryName
  const mainCategory = categoryName?.categoryName ?? '' 
  const AccordionCustomIcon = () => (
    <span className={cx('custom-icon')}>{'+'}</span>
  )

  const AccordionCustomTheme = {
    base: 'text-white dark:text-white divide-y divide-transparent border-transparent dark:divide-transparent dark:border-transparent rounded-lg border',
    flush: {
      off: '',
      on: 'text-white bg-transparent dark:bg-transparent',
    },
  }

  const AccordionTitleCustomTheme = {
    base: 'flex w-full items-center justify-between pr-4',
    flush: {
      off: '',
      on: 'text-white bg-transparent dark:bg-transparent',
    },
    heading: '',
    open: {
      off: 'visible text-black dark:text-black',
      on: 'text-transparent',
    },
  }

  const { data: menusData, loading: menusLoading } = useQuery(GetPrimaryMenu, {
    variables: {
      first: 100,
      headerLocation: PRIMARY_LOCATION,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const primaryMenu = menusData?.headerMenuItems?.edges ?? []

  const mainCategoryLabels = useMemo(() => {
    return primaryMenu.filter(
      (post) => post?.node?.connectedNode?.node?.name === mainCategory,
    )
  }, [primaryMenu])

  const processResults = (posts) => {
    const honorsCircles = []
    const uniqueHonorsCircleIds = new Set()

    posts.forEach((post) => {
      if (
        honorsCircles.length < 5 &&
        post?.node?.honorsCircles?.edges?.length
      ) {
        post.node.honorsCircles.edges.forEach((innerPost) => {
          const databaseId = innerPost.node.databaseId
          if (
            honorsCircles.length < 5 &&
            !uniqueHonorsCircleIds.has(databaseId)
          ) {
            uniqueHonorsCircleIds.add(databaseId)
            honorsCircles.push(innerPost.node)
          }
        })
      }
    })

    honorsCircles.sort((a, b) => new Date(b.date) - new Date(a.date))

    return { honorsCircles }
  }

  let travelGuidesVariable = {
    search: 'null',
  }

  const {
    data: travelGuidesData,
    loading: travelGuidesloading,
    error: travelGuidesError,
  } = useQuery(GetTravelGuides, {
    variables: travelGuidesVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  if (travelGuidesError) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const allResults = []
        const category = mainCategory.toLowerCase()
        const response = await client.query({
          query: GetTravelGuides,
          variables: { search: category },
          fetchPolicy: 'network-only',
        })
        const processedData = processResults(response.data.tags.edges)
        allResults.push({ category, data: processedData })

        setResults(allResults)
      } catch (error) {
        return <pre>{JSON.stringify(error)}</pre>
      }
    }
    fetchData()
    setLoading(false)
  }, [client, mainCategoryLabels])

  useEffect(() => {
    const shuffleHonorsCirclePost = () => {
      const uniqueDatabaseIds = new Set()
      const contentHonorsCircle = []

      travelGuidesData?.tags?.edges?.forEach((contentNodes) => {
        if (
          contentNodes?.node?.honorsCircles?.edges?.length !== 0
        ) {
          contentNodes.node?.honorsCircles?.edges.forEach((post) => {
            const { databaseId } = post.node
            if (!uniqueDatabaseIds.has(databaseId)) {
              uniqueDatabaseIds.add(databaseId)
              contentHonorsCircle.push(post.node)
            }
          })
        }
      })

      contentHonorsCircle.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
      })

      const shuffledHonorsCircle = shuffleArray(contentHonorsCircle)
      const lastFiveHonorsCircle = shuffledHonorsCircle.slice(-5)
      setHonorsCircle(lastFiveHonorsCircle)
    }

    shuffleHonorsCirclePost()
  }, [travelGuidesData])

  let menuVariable = {
    first: 100,
    footerHeaderLocation: FOOTER_LOCATION,
  }

  const { data: footerMenusData, loading: footerMenusLoading } = useQuery(
    GetTravelGuidesMenu,
    {
      variables: menuVariable,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  const footerMenu = footerMenusData?.footerHeaderMenuItems?.nodes ?? []

  const mainMenu = useMemo(() => {
    const formattedMainCategory = mainCategory
      .replace(/\s+/g, '-')
      .toLowerCase()

    return footerMenu.filter((post) => {
      const path = post?.path || ''
      return path.toLowerCase().includes(formattedMainCategory)
    })
  }, [footerMenu, mainCategory])

  const hierarchicalMenuItems = flatListToHierarchical(mainMenu)

  if (loading || menusLoading || travelGuidesloading || footerMenusLoading) {
    return (
      <div className="mx-auto my-0 flex max-w-[100%] justify-center md:max-w-[700px]">
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
          </svg>
        </div>
      </div>
    )
  }

  const getHonorsCircle = [...HonorsCircleArray]
  function renderMenu(items) {
    return (
      <div
        id={items?.map((item) => {
          return item?.id
        })}
        className={cx('menu-wrapper')}
      >
        <Accordion arrowIcon={AccordionCustomIcon} theme={AccordionCustomTheme}>
          {items.map((item, index) => {
            const { id, path, label, children, connectedNode } = item
  
            // @TODO - Remove guard clause after ghost menu items are no longer appended to array.
            if (!item.hasOwnProperty('__typename')) {
              return null
            }
  
            return (
              <Accordion.Panel id={id}>
                <div key={id} id={id} className={cx('accordion-wrapper')}>
                  {/* Sub Guides */}
                  {children?.length ? (
                    <div className={cx('accordion-content-wrapper')}>
                      <Accordion.Content>
                        <div className={cx('accordion-content')}>
                          <div className={cx('first-wrapper')}>
                            {renderMenu(children)}
                          </div>
                          <div className={cx('second-wrapper')}>
                            <div className={cx('honors-circle-wrapper')}>
                              <div className={cx('left-wrapper')}>
                                {results[index]?.data?.honorsCircles?.map(
                                  (honorsCircle, index) => (
                                    <>
                                      {index === 0 && (
                                        <>
                                          {honorsCircle?.uri &&
                                            honorsCircle?.title &&
                                            honorsCircle?.featuredImage?.node
                                              ?.sourceUrl && (
                                              <Link href={honorsCircle?.uri}>
                                                <div
                                                  className={cx('image-wrapper')}
                                                >
                                                  <div className={cx('image')}>
                                                    <Image
                                                      src={
                                                        honorsCircle
                                                          ?.featuredImage?.node
                                                          ?.sourceUrl
                                                      }
                                                      alt={honorsCircle?.title}
                                                      fill
                                                      sizes="100%"
                                                      priority
                                                    />
                                                  </div>
                                                </div>
                                              </Link>
                                            )}
                                        </>
                                      )}
                                    </>
                                  )
                                )}
                                {results[index]?.data?.honorsCircles?.length ===
                                  0 && (
                                  <>
                                    {getHonorsCircle[0]?.uri &&
                                      getHonorsCircle[0]?.title &&
                                      getHonorsCircle[0]?.featuredImage?.node
                                        ?.sourceUrl && (
                                      <Link href={getHonorsCircle[0]?.uri}>
                                        <div className={cx('image-wrapper')}>
                                          <div className={cx('image')}>
                                            <Image
                                              src={
                                                getHonorsCircle[0]
                                                  ?.featuredImage?.node
                                                  ?.sourceUrl
                                              }
                                              alt={getHonorsCircle[0]?.title}
                                              fill
                                              sizes="100%"
                                              priority
                                            />
                                          </div>
                                        </div>
                                      </Link>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className={cx('right-wrapper')}>
                                <div className={cx('honors-circle-title')}>
                                  <span className={cx('content-title')}>
                                    {'Honors Circle'}
                                  </span>
                                </div>
                                <div className={cx('posts-wrapper')}>
                                  {results[index]?.data?.honorsCircles?.map(
                                    (honorsCircle, index, array) => (
                                      <div
                                        className={cx('posts-content-wrapper')}
                                        key={honorsCircle?.databaseId}
                                      >
                                        {honorsCircle?.title &&
                                          honorsCircle?.uri && (
                                            <Link href={honorsCircle?.uri}>
                                              <div
                                                className={cx('name-wrapper')}
                                              >
                                                <div
                                                  className={cx(
                                                    'content-name-wrapper'
                                                  )}
                                                >
                                                  <span className={cx('name')}>
                                                    {honorsCircle?.title}
                                                    {index !==
                                                      array.length - 1 && ' |'}
                                                  </span>
                                                </div>
                                              </div>
                                            </Link>
                                          )}
                                      </div>
                                    )
                                  )}
                                  {results[index]?.data?.honorsCircles?.length ===
                                    0 && (
                                    <>
                                      {getHonorsCircle?.map(
                                        (honorsCircle, index, array) => (
                                          <div
                                            className={cx(
                                              'posts-content-wrapper'
                                            )}
                                            key={honorsCircle?.databaseId}
                                          >
                                            {honorsCircle?.title &&
                                              honorsCircle?.uri && (
                                                <Link href={honorsCircle?.uri}>
                                                  <div
                                                    className={cx('name-wrapper')}
                                                  >
                                                    <div
                                                      className={cx(
                                                        'content-name-wrapper'
                                                      )}
                                                    >
                                                      <span
                                                        className={cx('name')}
                                                      >
                                                        {honorsCircle?.title}
                                                        {index !==
                                                          array.length - 1 &&
                                                          ' |'}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </Link>
                                              )}
                                          </div>
                                        )
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Content>
                    </div>
                  ) : (
                    <>
                      <div className={cx('left-wrapper')}>
                        {connectedNode?.node?.uri &&
                          connectedNode?.node?.name &&
                          connectedNode?.node?.categoryImages && (
                            <Link href={connectedNode?.node?.uri}>
                              <div className={cx('image-wrapper')}>
                                <div className={cx('image')}>
                                  <Image
                                    src={
                                      connectedNode?.node?.categoryImages
                                        ?.categorySlide1 !== null
                                        ? connectedNode?.node?.categoryImages
                                            ?.categorySlide1?.sourceUrl
                                        : connectedNode?.node?.categoryImages
                                            ?.categoryImages?.sourceUrl
                                    }
                                    alt={connectedNode?.node?.name}
                                    fill
                                    sizes="100%"
                                    priority
                                  />
                                </div>
                              </div>
                            </Link>
                          )}
                      </div>
                      <div className={cx('right-wrapper')}>
                        <div className={cx('sub-guides-wrapper')}>
                          <div className={cx('sub-guides-content')}>
                            <div className={cx('sub-guides-title')}>
                              {path && (
                                <Link href={path}>
                                  <span className={cx('title')}>
                                    {connectedNode?.node?.parent &&
                                      connectedNode?.node?.parent?.node?.name}{' '}
                                    {label ?? ''}
                                  </span>
                                </Link>
                              )}
                            </div>
                            <div key={index} className={cx('posts-wrapper')}>
                              {connectedNode?.node?.posts?.edges?.map(
                                (post, index, array) => (
                                  <div
                                    key={index}
                                    className={cx('posts-content-wrapper')}
                                  >
                                    {post?.node?.title && post?.node?.uri && (
                                      <Link href={post?.node?.uri}>
                                        <div className={cx('name-wrapper')}>
                                          <div
                                            className={cx(
                                              'content-name-wrapper'
                                            )}
                                          >
                                            <span className={cx('name')}>
                                              {post?.node?.title}
                                              {index !== array.length - 1 &&
                                                ' |'}
                                            </span>
                                          </div>
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Accordion.Panel>
            )
          })}
        </Accordion>
      </div>
    )
  }
  
  return (
    <div className={cx('component')}>
      {/* Full menu */}
      <div className={cx('full-menu-content')}>
        {renderMenu(hierarchicalMenuItems)}
      </div>
    </div>
  )
}