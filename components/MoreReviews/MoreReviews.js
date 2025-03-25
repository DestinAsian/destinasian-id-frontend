import { useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './MoreReviews.module.scss'
import { GetMoreReviews } from '../../queries/GetMoreReviews'
import { Button, CategoryIcon, LocationIcon } from '../../components'
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

export default function MoreReviews({ databaseId }) {
  // Initialize a state variable to hold shuffled more reviews
  const [shuffledMoreReviews, setShuffledMoreReviews] = useState([])

  // Get Stories
  const { data, error, loading } = useQuery(GetMoreReviews, {
    variables: {
      id: databaseId,
      notIn: databaseId,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const moreReviews = data?.post?.categories?.edges[0]?.node?.posts?.edges ?? []

  // Use an effect to shuffle more reviews when data changes
  useEffect(() => {
    if (moreReviews && moreReviews.length > 0) {
      // Clone the moreReviews array to avoid modifying the original data
      const clonedMoreReviews = [...moreReviews]
      // Shuffle the cloned array
      const shuffledArray = shuffleArray(clonedMoreReviews)
      // Set the shuffled array in state
      setShuffledMoreReviews(shuffledArray)
    }
  }, [moreReviews]) // Trigger shuffling when moreReviews changes

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  if (loading) {
    return (
      <>
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center	bg-white ">
          <Button className="gap-x-4 ">{'Loading...'}</Button>
        </div>
      </>
    )
  }

  // Show only the first 3 items from shuffledMoreReviews
  const firstThreeReviews = shuffledMoreReviews.slice(0, 3)

  return (
    <>
      {firstThreeReviews.map((post) => (
        <article className={cx('component')}>
          <div className={cx('content-wrapper')}>
            {post?.node?.uri && (
              <Link href={post?.node?.uri}>
                <div className={cx('row-wrapper')}>
                  <h2 className={cx('title')}>{post?.node?.title}</h2>
                  <div className={cx('icon-wrapper')}>
                    <CategoryIcon
                      chooseYourCategory={
                        post?.node?.acfCategoryIcon?.chooseYourCategory
                      }
                      chooseIcon={
                        post?.node?.acfCategoryIcon?.chooseIcon?.mediaItemUrl
                      }
                      categoryLabel={post?.node?.acfCategoryIcon?.categoryLabel}
                    />
                    <LocationIcon
                      locationValidation={
                        post?.node?.acfLocationIcon?.fieldGroupName
                      }
                      locationLabel={post?.node?.acfLocationIcon?.locationLabel}
                      locationUrl={post?.node?.acfLocationIcon?.locationUrl}
                    />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </article>
      ))}
    </>
  )
}
