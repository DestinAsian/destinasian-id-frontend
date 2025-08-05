import { FaSearch } from 'react-icons/fa'
import className from 'classnames/bind'

import styles from './SearchResults.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import CategoryIcon from '../../components/CategoryIcon/CategoryIcon'
import Container from '../../components/Container/Container'
import FeaturedImage from '../../components/FeaturedImage/FeaturedImage'
import PostInfo from '../../components/PostInfo/PostInfo'
let cx = className.bind(styles)

/**
 * Renders the search results list.
 *
 * @param {Props} props The props object.
 * @param {object[]} props.searchResults The search results list.
 * @param {boolean} props.isLoading Whether the search results are loading.
 * @returns {React.ReactElement} The SearchResults component.
 */
export default function SearchResults({ searchResults, isLoading }) {
  const [filteredResults, setFilteredResults] = useState([])

  useEffect(() => {
    if (searchResults && searchResults.length) {
      const categoryNodes = searchResults.filter(
        (node) =>
          node?.__typename !== 'Category' &&
          node?.contentNodes?.edges?.length !== 0,
      )
      setFilteredResults(categoryNodes)
    }
  }, [searchResults])

  // If there are no results, or are loading, return null.
  if (!isLoading && searchResults === undefined) {
    return null
  }

  // If there are no results, return a message.
  if (!isLoading && !filteredResults?.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    )
  }

  // If loading is running, return a Loading screen
  if (isLoading) {
    return (
      <>
        <div className="mx-auto my-0 flex h-[88vh] max-w-[100vw] justify-center sm:h-[95vh]	md:max-w-[700px]">
          <div role="status">
            <svg
              aria-hidden="true"
              className="mr-2 h-full w-8 animate-spin fill-black text-gray-200 sm:h-[86vh] dark:text-gray-600"
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

  const calculateTrimmedExcerpt = (excerpt, uri, title) => {
    const MAX_EXCERPT_LENGTH = 100 // You can adjust this value according to your needs

    let trimmedExcerpt = excerpt?.substring(0, MAX_EXCERPT_LENGTH)
    const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')

    if (lastSpaceIndex !== -1) {
      trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
    }

    return `${trimmedExcerpt} <a class="more-link" href="${uri}">Continue reading <span class="screen-reader-text">${title}</span></a>`
  }

  return (
    <>
      <div className={cx('component')}>
        {filteredResults?.map((node) => (
          <Container>
            {node?.__typename === 'Category' ? (
              // Search Result for Categories
              <div className={cx('content-wrapper')}>
                <div className={cx('left-wrapper')}>
                  {node?.categoryImages?.changeToSlider === null &&
                    node?.categoryImages?.categoryImages?.sourceUrl &&
                    node?.uri && (
                      <Link href={node?.uri}>
                        <div className={cx('wrapper-image')}>
                          <div className={cx('featured-image')}>
                            <Image
                              src={
                                node?.categoryImages?.categoryImages?.sourceUrl
                              }
                              alt={'Category Images ' + node?.title}
                              fill
                              sizes="100%"
                              priority
                            />
                          </div>
                        </div>
                      </Link>
                    )}
                  {node?.categoryImages?.changeToSlider === 'yes' &&
                    node?.categoryImages?.categorySlide1?.sourceUrl &&
                    node?.uri && (
                      <Link href={node?.uri}>
                        <div className={cx('wrapper-image')}>
                          <div className={cx('featured-image')}>
                            <Image
                              src={
                                node?.categoryImages?.categorySlide1?.sourceUrl
                              }
                              alt={'Category Images ' + node?.title}
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
                  <div key={node?.databaseId} className={cx('result')}>
                    {node?.children?.edges?.length !== 0 && (
                      <div className={cx('title-wrapper')}>
                        <Link href={node?.uri}>
                          <h2 className={cx('title')}>{node?.name}</h2>
                        </Link>
                      </div>
                    )}
                    {node?.children?.edges?.length === 0 && (
                      <div className={cx('title-wrapper')}>
                        <Link href={node?.uri}>
                          <h2 className={cx('title')}>
                            {(node?.parent?.node?.name
                              ? node?.parent?.node?.name
                              : '') +
                              ' ' +
                              node?.name}
                          </h2>
                        </Link>
                      </div>
                    )}
                    {node?.description && node?.uri && (
                      <Link href={node?.uri}>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: calculateTrimmedExcerpt(
                              node?.description,
                              node?.uri,
                              node?.title,
                            ),
                          }}
                        />
                      </Link>
                    )}
                    {node?.children?.edges?.length !== 0 ? (
                      // Main Guides Category posts
                      <div className={cx('main-category-post')}>
                        {node?.children?.edges?.map((post, index, array) => (
                          <div
                            key={index}
                            className={cx('main-category-post-wrapper')}
                          >
                            <Link href={post?.node?.uri}>
                              <div className={cx('category-post-wrapper')}>
                                <p className={cx('category-post')}>
                                  {post?.node?.name}
                                </p>
                              </div>
                            </Link>
                            {/* Border gap */}
                            {index !== array.length - 1 && (
                              <div className={cx('border-gap')}></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Sub Guides Category posts
                      <div className={cx('sub-category-post')}>
                        {node?.contentNodes?.edges?.map(
                          (post, index, array) => (
                            <div
                              key={index}
                              className={cx('sub-category-post-wrapper')}
                            >
                              <Link href={post?.node?.uri}>
                                <div className={cx('category-post-wrapper')}>
                                  <p className={cx('category-post')}>
                                    {post?.node?.title}
                                  </p>
                                </div>
                              </Link>
                              {index !== array.length - 1 && (
                                <div className={cx('border-gap')}></div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Search Result for Tags
              <div className={cx('content-wrapper')}>
                <div className={cx('left-wrapper')}>
                  {node?.featuredImage?.node && node?.uri && (
                    <Link href={node?.uri}>
                      <div className={cx('wrapper-image')}>
                        <FeaturedImage
                          image={node?.featuredImage?.node}
                          className={cx('featured-image')}
                        />
                      </div>
                    </Link>
                  )}
                </div>

                <div className={cx('right-wrapper')}>
                  <div key={node?.databaseId} className={cx('result')}>
                    {/* No Category in Pages */}
                    {node?.contentType?.node?.graphqlPluralName ==
                    'pages' ? null : (
                      <div className={cx('category-wrapper')}>
                        {/* Destinations */}
                        {node?.contentType?.node?.graphqlPluralName ==
                          'Editorials' &&
                          node?.categories?.edges[0]?.node?.uri && (
                            <Link href={node?.categories?.edges[0]?.node?.uri}>
                              <h2 className={cx('meta')}>
                                {node?.categories?.edges[0]?.node?.name}
                              </h2>
                            </Link>
                          )}

                        {/* Destination Guides */}
                        {node?.contentType?.node?.graphqlPluralName ==
                          'posts' &&
                          node?.categories?.edges[0]?.node?.uri && (
                            <Link href={node?.categories?.edges[0]?.node?.uri}>
                              <h2 className={cx('meta')}>
                                {
                                  node?.categories?.edges[0]?.node?.parent?.node
                                    ?.name
                                }{' '}
                                {node?.categories?.edges[0]?.node?.name}
                              </h2>
                            </Link>
                          )}

                        {/* Update */}
                        {node?.contentType?.node?.graphqlPluralName ==
                          'Updates' &&
                          node?.categories?.edges[0]?.node?.uri && (
                            <Link href={node?.categories?.edges[0]?.node?.uri}>
                              <h2 className={cx('meta')}>
                                {
                                  node?.categories?.edges[0]?.node?.parent?.node
                                    ?.name
                                }{' '}
                                {node?.categories?.edges[0]?.node?.name}
                              </h2>
                            </Link>
                          )}

                        {/* HonorsCircle */}
                        {node?.contentType?.node?.graphqlPluralName ==
                          'HonorsCircles' && (
                          <Link href={'/honors-circle'}>
                            <h2 className={cx('meta', 'meta-hc')}>
                              {'Honors Circle'}
                            </h2>
                          </Link>
                        )}

                    

                        {/* LuxeList */}
                        {node?.contentType?.node?.graphqlPluralName ==
                          'LuxeLists' && (
                          <h2 className={cx('meta')}>{'Luxe List'}</h2>
                        )}

                        {/* Contest */}
                        {node?.contentType?.node?.graphqlPluralName ==
                          'Contests' && (
                          <Link href={'/contests'}>
                            <h2 className={cx('meta')}>{'Contest'}</h2>
                          </Link>
                        )}

                        {/* Luxury Travel */}
                        {node?.contentType?.node?.graphqlPluralName ==
                          'LuxuryTravels' &&
                          node?.uri && (
                            <Link href={node?.uri}>
                              <h2 className={cx('meta')}>{'Luxury Travel'}</h2>
                            </Link>
                          )}
                      </div>
                    )}

                    <div className={cx('title-wrapper')}>
                      {/* Destinations */}
                      {node?.contentType?.node?.graphqlPluralName ==
                        'Editorials' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title')}>{node?.title}</h2>
                          </Link>
                        )}

                      {/* Destination Guides */}
                      {node?.contentType?.node?.graphqlPluralName == 'posts' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title')}>{node?.title}</h2>
                          </Link>
                        )}

                      {/* Pages */}
                      {node?.contentType?.node?.graphqlPluralName == 'pages' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title')}>{node?.title}</h2>
                          </Link>
                        )}

                      {/* Update */}
                      {node?.contentType?.node?.graphqlPluralName ==
                        'Updates' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title')}>{node?.title}</h2>
                          </Link>
                        )}

                      {/* HonorsCircle */}
                      {node?.contentType?.node?.graphqlPluralName ==
                        'HonorsCircles' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title', 'title-hc')}>
                              {node?.title}
                            </h2>
                          </Link>
                        )}



                      {/* LuxeList */}
                      {node?.contentType?.node?.graphqlPluralName ==
                        'LuxeLists' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title', 'title-ll')}>
                              {node?.title}
                            </h2>
                          </Link>
                        )}

                      {/* Contest */}
                      {node?.contentType?.node?.graphqlPluralName ==
                        'Contests' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title', 'title-contest')}>
                              {node?.title}
                            </h2>
                          </Link>
                        )}



                      {/* Luxury Travel */}
                      {node?.contentType?.node?.graphqlPluralName ==
                        'LuxuryTravels' &&
                        node?.uri && (
                          <Link href={node?.uri}>
                            <h2 className={cx('title', 'title-advertorial')}>
                              {node?.title}
                            </h2>
                          </Link>
                        )}
                    </div>

                    <div className={cx('meta-wrapper')}>
                      <div className={cx('date-wrapper')}>
                        <PostInfo date={node?.date} className={cx('meta')} />
                      </div>
                      {node?.acfCategoryIcon && node?.acfLocationIcon && (
                        <div className={cx('icon-wrapper')}>
                          <CategoryIcon
                            chooseYourCategory={
                              node?.acfCategoryIcon?.chooseYourCategory
                            }
                            chooseIcon={
                              node?.acfCategoryIcon?.chooseIcon?.mediaItemUrl
                            }
                            categoryLabel={node?.acfCategoryIcon?.categoryLabel}
                          />
                          <LocationIcon
                            locationValidation={
                              node?.acfLocationIcon?.fieldGroupName
                            }
                            locationLabel={node?.acfLocationIcon?.locationLabel}
                            locationUrl={node?.acfLocationIcon?.locationUrl}
                          />
                        </div>
                      )}
                    </div>

                    {node?.excerpt && node?.uri && (
                      <Link href={node?.uri}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: calculateTrimmedExcerpt(
                              node?.excerpt,
                              node?.uri,
                              node?.title,
                            ),
                          }}
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Container>
        ))}
      </div>
    </>
  )
}
