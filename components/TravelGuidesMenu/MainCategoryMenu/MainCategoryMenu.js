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
  const client = useApolloClient() // Use Apollo Client instance
  const [PartnerContentArray, setPartnerContent] = useState([])
  const [HonorsCircleArray, setHonorsCircle] = useState([])

  // main category name
  const mainCategory = categoryName?.categoryName

  const AccordionCustomIcon = () => (
    <span className={cx('custom-icon')}>{'+'}</span>
  )

  // Theme for Accordion
  const AccordionCustomTheme = {
    base: 'text-white dark:text-white divide-y divide-transparent border-transparent dark:divide-transparent dark:border-transparent rounded-lg border',
    flush: {
      off: '',
      on: 'text-white bg-transparent dark:bg-transparent',
    },
  }

  // Theme for Accordion Title/Button
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

  // Get menus
  const { data: menusData, loading: menusLoading } = useQuery(GetPrimaryMenu, {
    variables: {
      first: 100,
      headerLocation: PRIMARY_LOCATION,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Primary Menu
  const primaryMenu = menusData?.headerMenuItems?.edges ?? []
  // Main category labels array (memoized)
  const mainCategoryLabels = useMemo(() => {
    return primaryMenu.filter(
      (post) => post?.node?.connectedNode?.node?.name === mainCategory,
    )
  }, [primaryMenu])
  // ProcessResults on Advertorials & HonorsCircles
  const processResults = (posts) => {
    const advertorials = []
    const uniqueAdvertorialIds = new Set()
    const honorsCircles = []
    const uniqueHonorsCircleIds = new Set()

    posts.forEach((post) => {
      if (advertorials.length < 5 && post?.node?.advertorials?.edges?.length) {
        post.node.advertorials.edges.forEach((innerPost) => {
          const databaseId = innerPost.node.databaseId
          if (
            advertorials.length < 5 &&
            !uniqueAdvertorialIds.has(databaseId)
          ) {
            uniqueAdvertorialIds.add(databaseId)
            advertorials.push(innerPost.node)
          }
        })
      }

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

    advertorials.sort((a, b) => new Date(b.date) - new Date(a.date))
    honorsCircles.sort((a, b) => new Date(b.date) - new Date(a.date))

    return { advertorials, honorsCircles }
  }

  let travelGuidesVariable = {
    search: 'null',
  }

  // Get Advertorial Stories
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

  // Random Partner Content Stories
  useEffect(() => {
    const shufflePartnerContentPost = () => {
      // Create a Set to store unique databaseId values
      const uniqueDatabaseIds = new Set()

      // Initialize an array to store unique posts
      const contentPartnerContent = []

      // Loop through all the contentNodes posts
      travelGuidesData?.tags?.edges?.forEach((contentNodes) => {
        {
          contentNodes?.node?.advertorials?.edges?.length !== 0 &&
            contentNodes.node?.advertorials?.edges.forEach((post) => {
              const { databaseId } = post.node

              // Check if the databaseId is unique (not in the Set)
              if (!uniqueDatabaseIds.has(databaseId)) {
                uniqueDatabaseIds.add(databaseId) // Add the databaseId to the Set
                contentPartnerContent.push(post.node) // Push the unique post to the array
              }
            })
        }
      })

      // Sort contentNodesPosts array by date
      contentPartnerContent.sort((a, b) => {
        // Assuming your date is stored in 'date' property of the post objects
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        // Compare the dates
        return dateB - dateA
      })

      // const TravelGuidesArray = Object.values(contentPartnerContent || [])

      // Shuffle only the otherBannerAds array
      const shuffleAdvertorialPost = shuffleArray(contentPartnerContent)

      // Concatenate the arrays with pinned ads first and shuffled other banner ads
      const shuffledPartnerContent = [...shuffleAdvertorialPost]

      // Get the last two elements
      const lastFivePartnerContent = shuffledPartnerContent.slice(-5)

      setPartnerContent(lastFivePartnerContent)
    }

    // Shuffle the banner ads when the component mounts
    shufflePartnerContentPost()
  }, [travelGuidesData])

  // Random Honors Circle Stories
  useEffect(() => {
    const shuffleHonorsCirclePost = () => {
      // Create a Set to store unique databaseId values
      const uniqueDatabaseIds = new Set()

      // Initialize an array to store unique posts
      const contentHonorsCircle = []

      // Loop through all the contentNodes posts
      travelGuidesData?.tags?.edges?.forEach((contentNodes) => {
        {
          contentNodes?.node?.honorsCircles?.edges?.length !== 0 &&
            contentNodes.node?.honorsCircles?.edges.forEach((post) => {
              const { databaseId } = post.node

              // Check if the databaseId is unique (not in the Set)
              if (!uniqueDatabaseIds.has(databaseId)) {
                uniqueDatabaseIds.add(databaseId) // Add the databaseId to the Set
                contentHonorsCircle.push(post.node) // Push the unique post to the array
              }
            })
        }
      })

      // Sort contentNodesPosts array by date
      contentHonorsCircle.sort((a, b) => {
        // Assuming your date is stored in 'date' property of the post objects
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        // Compare the dates
        return dateB - dateA
      })

      // const TravelGuidesArray = Object.values(contentHonorsCircle || [])

      // Shuffle only the otherBannerAds array
      const shuffleHonorsCirclePost = shuffleArray(contentHonorsCircle)

      // Concatenate the arrays with pinned ads first and shuffled other banner ads
      const shuffledHonorsCircle = [...shuffleHonorsCirclePost]

      // Get the last two elements
      const lastFiveHonorsCircle = shuffledHonorsCircle.slice(-5)

      setHonorsCircle(lastFiveHonorsCircle)
    }

    // Shuffle the banner ads when the component mounts
    shuffleHonorsCirclePost()
  }, [travelGuidesData])

  let menuVariable = {
    first: 100,
    footerHeaderLocation: FOOTER_LOCATION,
  }

  // Get Footer menus
  const { data: footerMenusData, loading: footerMenusLoading } = useQuery(
    GetTravelGuidesMenu,
    {
      variables: menuVariable,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  // Footer Menu
  const footerMenu = footerMenusData?.footerHeaderMenuItems?.nodes ?? []

  // Main category labels array (memoized)
  const mainMenu = useMemo(() => {
    // Replace spaces with dashes in mainCategory
    const formattedMainCategory = mainCategory
      .replace(/\s+/g, '-')
      .toLowerCase()

    return footerMenu.filter((post) => {
      const path = post?.path || ''
      return path.toLowerCase().includes(formattedMainCategory)
    })
  }, [footerMenu, mainCategory])

  // Based on https://www.wpgraphql.com/docs/menus/#hierarchical-data
  const hierarchicalMenuItems = flatListToHierarchical(mainMenu)

  // Loading state
  if (loading || menusLoading || travelGuidesloading || footerMenusLoading) {
    return (
      <>
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
      </>
    )
  }

  const getHonorsCircle = [...HonorsCircleArray]
  const getPartnerContent = [...PartnerContentArray]

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
                            <div className={cx('partner-content-wrapper')}>
                              <div className={cx('left-wrapper')}>
                                {results[index]?.data?.advertorials?.map(
                                  (advertorial, index) => (
                                    <>
                                      {index === 0 && (
                                        <>
                                          {advertorial?.uri &&
                                            advertorial?.title &&
                                            advertorial?.featuredImage?.node
                                              ?.sourceUrl && (
                                              <Link href={advertorial?.uri}>
                                                <div
                                                  className={cx(
                                                    'image-wrapper',
                                                  )}
                                                >
                                                  <div className={cx('image')}>
                                                    <Image
                                                      src={
                                                        advertorial
                                                          ?.featuredImage?.node
                                                          ?.sourceUrl
                                                      }
                                                      alt={advertorial?.title}
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
                                  ),
                                )}
                                {results[index]?.data?.advertorials?.length ===
                                  0 && (
                                  <>
                                    {getPartnerContent[0]?.uri &&
                                      getPartnerContent[0]?.title &&
                                      getPartnerContent[0]?.featuredImage?.node
                                        ?.sourceUrl && (
                                        <Link href={getPartnerContent[0]?.uri}>
                                          <div className={cx('image-wrapper')}>
                                            <div className={cx('image')}>
                                              <Image
                                                src={
                                                  getPartnerContent[0]
                                                    ?.featuredImage?.node
                                                    ?.sourceUrl
                                                }
                                                alt={
                                                  getPartnerContent[0]?.title
                                                }
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
                                <div className={cx('partner-content-title')}>
                                  <span className={cx('content-title')}>
                                    {'Partner Content'}
                                  </span>
                                </div>
                                <div className={cx('posts-wrapper')}>
                                  {results[index]?.data?.advertorials?.map(
                                    (advertorial, index, array) => (
                                      <div
                                        className={cx('posts-content-wrapper')}
                                        key={advertorial?.databaseId}
                                      >
                                        {advertorial?.title &&
                                          advertorial?.uri && (
                                            <Link href={advertorial?.uri}>
                                              <div
                                                className={cx('name-wrapper')}
                                              >
                                                <div
                                                  className={cx(
                                                    'content-name-wrapper',
                                                  )}
                                                >
                                                  <span className={cx('name')}>
                                                    {advertorial?.title}
                                                    {index !==
                                                      array.length - 1 && ' |'}
                                                  </span>
                                                </div>
                                              </div>
                                            </Link>
                                          )}
                                      </div>
                                    ),
                                  )}
                                  {results[index]?.data?.advertorials
                                    ?.length === 0 && (
                                    <>
                                      {getPartnerContent?.map(
                                        (advertorial, index, array) => (
                                          <div
                                            className={cx(
                                              'posts-content-wrapper',
                                            )}
                                            key={advertorial?.databaseId}
                                          >
                                            {advertorial?.title &&
                                              advertorial?.uri && (
                                                <Link href={advertorial?.uri}>
                                                  <div
                                                    className={cx(
                                                      'name-wrapper',
                                                    )}
                                                  >
                                                    <div
                                                      className={cx(
                                                        'content-name-wrapper',
                                                      )}
                                                    >
                                                      <span
                                                        className={cx('name')}
                                                      >
                                                        {advertorial?.title}
                                                        {index !==
                                                          array.length - 1 &&
                                                          ' |'}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </Link>
                                              )}
                                          </div>
                                        ),
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
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
                                                  className={cx(
                                                    'image-wrapper',
                                                  )}
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
                                  ),
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
                                                    'content-name-wrapper',
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
                                    ),
                                  )}
                                  {results[index]?.data?.honorsCircles
                                    ?.length === 0 && (
                                    <>
                                      {getHonorsCircle?.map(
                                        (honorsCircle, index, array) => (
                                          <div
                                            className={cx(
                                              'posts-content-wrapper',
                                            )}
                                            key={honorsCircle?.databaseId}
                                          >
                                            {honorsCircle?.title &&
                                              honorsCircle?.uri && (
                                                <Link href={honorsCircle?.uri}>
                                                  <div
                                                    className={cx(
                                                      'name-wrapper',
                                                    )}
                                                  >
                                                    <div
                                                      className={cx(
                                                        'content-name-wrapper',
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
                                        ),
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
                                      connectedNode?.node?.parent?.node
                                        ?.name}{' '}
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
                                              'content-name-wrapper',
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
                                ),
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
