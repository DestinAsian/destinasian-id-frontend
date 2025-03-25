import { useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './PartnerContent.module.scss'
import { GetAdvertorialStories } from '../../queries/GetAdvertorialStories'
import { GetHCStories } from '../../queries/GetHCStories'
import { GetPartnerContent } from '../../queries/GetPartnerContent'
import { Button, FeaturedImage } from '../../components'
import Link from 'next/link'

let cx = classNames.bind(styles)

// Randomized Function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Function to truncate the text
function truncateText(text) {
  const MAX_EXCERPT_LENGTH = 100 // Adjust the maximum length as needed

  if (text.length <= MAX_EXCERPT_LENGTH) {
    return text
  }

  const truncatedText = text.substring(0, MAX_EXCERPT_LENGTH)
  const lastSpaceIndex = truncatedText.lastIndexOf(' ')

  if (lastSpaceIndex !== -1) {
    return truncatedText.substring(0, lastSpaceIndex) + '...'
  }

  return truncatedText + '...'
}

export default function PartnerContent({ parentName }) {
  // Initialize a state variable to hold shuffled more reviews
  const [AdvertorialArray, setAdvertorialArray] = useState([])
  const [HCArray, setHCArray] = useState([])

  const hcFrontPage = '/honors-circle'

  // // Get Stories
  // const { data, error, loading } = useQuery(GetPartnerContent, {
  //   variables: {
  //     first: contentPerPage,
  //     search: parentName,
  //     id: '/honors-circle',
  //   },
  //   fetchPolicy: 'network-only',
  //   nextFetchPolicy: 'cache-and-network',
  // })

  // Get Advertorial Stories
  const { data: advertorialsData, error: advertorialsError } = useQuery(
    GetAdvertorialStories,
    {
      variables: { search: parentName }, // Use the modified variables
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  if (advertorialsError) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  // Get HC Stories
  const { data: honorsCirclesData, error: honorsCirclesError } = useQuery(
    GetHCStories,
    {
      variables: { search: parentName }, // Use the modified variables
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  if (honorsCirclesError) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  // Advertorial Stories
  useEffect(() => {
    const shuffleAdvertorialPost = () => {
      // Create a Set to store unique databaseId values
      const uniqueDatabaseIds = new Set()

      // Initialize an array to store unique posts
      const contentAdvertorials = []

      // Loop through all the contentNodes posts
      advertorialsData?.tags?.edges?.forEach((contentNodes) => {
        {
          contentNodes?.node?.contentNodes?.edges?.length !== 0 &&
            contentNodes?.node?.contentNodes?.edges.forEach((post) => {
              const { databaseId } = post.node

              // Check if the databaseId is unique (not in the Set)
              if (!uniqueDatabaseIds.has(databaseId)) {
                uniqueDatabaseIds.add(databaseId) // Add the databaseId to the Set
                contentAdvertorials.push(post.node) // Push the unique post to the array
              }
            })
        }
      })

      const advertorialArray = Object.values(contentAdvertorials || [])

      // Shuffle only the otherBannerAds array
      const shuffleAdvertorialPost = shuffleArray(advertorialArray)

      // Concatenate the arrays with pinned ads first and shuffled other banner ads
      const shuffledAdvertorialArray = [...shuffleAdvertorialPost]

      setAdvertorialArray(shuffledAdvertorialArray)
    }

    // Shuffle the banner ads when the component mounts
    shuffleAdvertorialPost()
  }, [advertorialsData])

  // HC Stories
  useEffect(() => {
    const shuffleHCPost = () => {
      // Create a Set to store unique databaseId values
      const uniqueDatabaseIds = new Set()

      // Initialize an array to store unique posts
      const contentHonorsCircles = []

      // Loop through all the contentNodes posts
      honorsCirclesData?.tags?.edges?.forEach((contentNodes) => {
        {
          contentNodes?.node?.contentNodes?.edges?.length !== 0 &&
            contentNodes?.node?.contentNodes?.edges.forEach((post) => {
              const { databaseId } = post.node

              // Check if the databaseId is unique (not in the Set)
              if (!uniqueDatabaseIds.has(databaseId)) {
                uniqueDatabaseIds.add(databaseId) // Add the databaseId to the Set
                contentHonorsCircles.push(post.node) // Push the unique post to the array
              }
            })
        }
      })

      const HCArray = Object.values(contentHonorsCircles || [])

      // Shuffle only the otherBannerAds array
      const shuffleHCPost = shuffleArray(HCArray)

      // Concatenate the arrays with pinned ads first and shuffled other banner ads
      const shuffledHCArray = [...shuffleHCPost]

      setHCArray(shuffledHCArray)
    }

    // Shuffle the banner ads when the component mounts
    shuffleHCPost()
  }, [honorsCirclesData])

  // Declare 2 Advertorial Post
  const getAdvertorialPost = [
    AdvertorialArray[0] || null,
    AdvertorialArray[1] || null,
  ]

  // Declare 2 HC Post
  const getHCPost = [HCArray[0] || null, HCArray[1] || null]

  return (
    <>
      {/* Adv Content */}
      <div className={cx('adv-component')}>
        {getAdvertorialPost[0] !== null && getAdvertorialPost[0]?.uri && (
          <article className={cx('main-wrapper')}>
            <div className={cx('left-wrapper')}>
              {getAdvertorialPost[0]?.featuredImage && (
                <Link href={getAdvertorialPost[0]?.uri}>
                  <div className={cx('content-wrapper-image')}>
                    <FeaturedImage
                      image={getAdvertorialPost[0]?.featuredImage?.node}
                      className={cx('image')}
                    />
                    <div className={cx('border-right-adv')}></div>
                  </div>
                </Link>
              )}
            </div>
            <div className={cx('right-wrapper')}>
              <div className={cx('content-wrapper')}>
                <Link href={getAdvertorialPost[0]?.uri}>
                  <h2 className={cx('sub-title-adv')}>{'Partner Content'}</h2>
                </Link>
              </div>
              <div className={cx('content-wrapper')}>
                <Link href={getAdvertorialPost[0]?.uri}>
                  <h2 className={cx('title')}>
                    {getAdvertorialPost[0]?.title}
                  </h2>
                </Link>
              </div>
              {getAdvertorialPost[0]?.excerpt !== undefined &&
                getAdvertorialPost[0]?.excerpt !== null && (
                  <div className={cx('content-wrapper')}>
                    <Link href={getAdvertorialPost[0]?.uri}>
                      <div
                        className={cx('excerpt', 'truncate-text')} // Add the class here
                        dangerouslySetInnerHTML={{
                          __html: truncateText(getAdvertorialPost[0]?.excerpt),
                        }}
                      />
                    </Link>
                  </div>
                )}
            </div>
          </article>
        )}
        {getAdvertorialPost[1] !== null && getAdvertorialPost[1]?.uri && (
          <article className={cx('main-wrapper')}>
            <div className={cx('left-wrapper')}>
              {getAdvertorialPost[1]?.featuredImage && (
                <Link href={getAdvertorialPost[1]?.uri}>
                  <div className={cx('content-wrapper-image')}>
                    <FeaturedImage
                      image={getAdvertorialPost[1]?.featuredImage?.node}
                      className={cx('image')}
                    />
                    <div className={cx('border-right-adv')}></div>
                  </div>
                </Link>
              )}
            </div>
            <div className={cx('right-wrapper')}>
              <div className={cx('content-wrapper')}>
                <Link href={getAdvertorialPost[1]?.uri}>
                  <h2 className={cx('sub-title-adv')}>{'Partner Content'}</h2>
                </Link>
              </div>
              <div className={cx('content-wrapper')}>
                <Link href={getAdvertorialPost[1]?.uri}>
                  <h2 className={cx('title')}>
                    {getAdvertorialPost[1]?.title}
                  </h2>
                </Link>
              </div>
              {getAdvertorialPost[1]?.excerpt !== undefined &&
                getAdvertorialPost[1]?.excerpt !== null && (
                  <div className={cx('content-wrapper')}>
                    <Link href={getAdvertorialPost[1]?.uri}>
                      <div
                        className={cx('excerpt', 'truncate-text')} // Add the class here
                        dangerouslySetInnerHTML={{
                          __html: truncateText(getAdvertorialPost[1]?.excerpt),
                        }}
                      />
                    </Link>
                  </div>
                )}
            </div>
          </article>
        )}
      </div>
      {/* HC Content */}
      <div className={cx('hc-component')}>
        {getHCPost[0] !== null && getHCPost[0]?.uri && (
          <article className={cx('main-wrapper')}>
            <div className={cx('left-wrapper')}>
              {getHCPost[0]?.featuredImage && (
                <Link href={getHCPost[0]?.uri}>
                  <div className={cx('content-wrapper-image')}>
                    <FeaturedImage
                      image={getHCPost[0]?.featuredImage?.node}
                      className={cx('image')}
                    />
                    <div className={cx('border-right-hc')}></div>
                  </div>
                </Link>
              )}
            </div>
            <div className={cx('right-wrapper')}>
              <div className={cx('hc-content-wrapper')}>
                <Link href={hcFrontPage}>
                  <h2 className={cx('honors-circle')}>{'Honors Circle'}</h2>
                </Link>
              </div>
              <div className={cx('hc-content-wrapper')}>
                <Link href={getHCPost[0]?.uri}>
                  <h2 className={cx('hc-title')}>{getHCPost[0]?.title}</h2>
                </Link>
              </div>
              {getHCPost[0]?.excerpt !== undefined &&
                getHCPost[0]?.excerpt !== null && (
                  <div className={cx('hc-content-wrapper')}>
                    <Link href={getHCPost[0]?.uri}>
                      <div
                        className={cx('hc-excerpt', 'truncate-text')} // Add the class here
                        dangerouslySetInnerHTML={{
                          __html: truncateText(getHCPost[0]?.excerpt),
                        }}
                      />
                    </Link>
                  </div>
                )}
            </div>
          </article>
        )}
        {getHCPost[1] !== null && getHCPost[1]?.uri && (
          <article className={cx('main-wrapper')}>
            <div className={cx('left-wrapper')}>
              {getHCPost[1]?.featuredImage && (
                <Link href={getHCPost[1]?.uri}>
                  <div className={cx('content-wrapper-image')}>
                    <FeaturedImage
                      image={getHCPost[1]?.featuredImage?.node}
                      className={cx('image')}
                    />
                    <div className={cx('border-right-hc')}></div>
                  </div>
                </Link>
              )}
            </div>
            <div className={cx('right-wrapper')}>
              <div className={cx('hc-content-wrapper')}>
                <Link href={hcFrontPage}>
                  <h2 className={cx('honors-circle')}>{'Honors Circle'}</h2>
                </Link>
              </div>
              <div className={cx('hc-content-wrapper')}>
                <Link href={getHCPost[1]?.uri}>
                  <h2 className={cx('hc-title')}>{getHCPost[1]?.title}</h2>
                </Link>
              </div>
              {getHCPost[1]?.excerpt !== undefined &&
                getHCPost[1]?.excerpt !== null && (
                  <div className={cx('hc-content-wrapper')}>
                    <Link href={getHCPost[1]?.uri}>
                      <div
                        className={cx('hc-excerpt', 'truncate-text')} // Add the class here
                        dangerouslySetInnerHTML={{
                          __html: truncateText(getHCPost[1]?.excerpt),
                        }}
                      />
                    </Link>
                  </div>
                )}
            </div>
          </article>
        )}
        <div className={cx('border-divider')}></div>
      </div>
    </>
  )
}
