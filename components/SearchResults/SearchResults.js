import { FaSearch, FaSpinner } from 'react-icons/fa'
import classNames from 'classnames/bind'
import styles from './SearchResults.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const PostInfo = dynamic(() => import('../../components/PostInfo/PostInfo'))
const cx = classNames.bind(styles)

export default function SearchResults({ searchResults, isLoading }) {
  const [filteredResults, setFilteredResults] = useState([])

  // Update filtered results when searchResults change
  useEffect(() => {
    if (searchResults?.length) {
      setFilteredResults(searchResults)
    } else {
      setFilteredResults([])
    }
  }, [searchResults])

  // Helper function to trim excerpt safely and add "Continue reading" link
  const calculateTrimmedExcerpt = (excerpt, uri, title) => {
    const MAX_EXCERPT_LENGTH = 100
    let trimmed = excerpt?.substring(0, MAX_EXCERPT_LENGTH) ?? ''
    const lastSpace = trimmed.lastIndexOf(' ')

    if (lastSpace !== -1) {
      trimmed = trimmed.substring(0, lastSpace) + '...'
    }

    return `${trimmed} <a class="more-link" href="${uri}">Continue reading <span class="screen-reader-text">${title}</span></a>`
  }

  // Render when no results
  if (!isLoading && !filteredResults.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    )
  }

  // Render loading spinner
  if (isLoading) {
    return (
      <div className="mx-auto flex h-[88vh] max-w-[100vw] items-center justify-center sm:h-[95vh] md:max-w-[700px]">
        <div role="status">
          <FaSpinner className="h-8 w-8 animate-spin text-black dark:text-gray-600" />
        </div>
      </div>
    )
  }

  // Render search results
  return (
    <div className={cx('component')}>
      {filteredResults
        .filter((node) => node?.title || node?.excerpt || node?.featuredImage?.node?.sourceUrl)
        .map((node) => {
          const imageUrl = node?.featuredImage?.node?.sourceUrl
          return (
            <div key={node?.databaseId} className={cx('content-wrapper')}>
              {/* Left: Featured Image */}
              <div className={cx('left-wrapper')}>
                {imageUrl && (
                  <Link href={node?.uri || '#'} className={cx('image-link')}>
                    <div className={cx('image-wrapper')}>
                      <Image
                        src={imageUrl}
                        alt={node?.title || 'Image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  </Link>
                )}
              </div>

              {/* Right: Meta, Title, Excerpt */}
              <div className={cx('right-wrapper')}>
                {node?.categories?.edges?.length > 0 && (
                  <div className={cx('meta-wrapper')}>
                    <Link href={node.categories.edges[0].node.uri || '#'}>
                      <h2 className={cx('meta')}>
                        {node.categories.edges[0].node.parent?.node?.name}{' '}
                        {node.categories.edges[0].node.name}
                      </h2>
                    </Link>
                  </div>
                )}

                {node?.title && (
                  <h2 className={cx('title')}>
                    <Link href={node?.uri}>{node?.title}</Link>
                  </h2>
                )}

                {node?.date && <PostInfo date={node.date} className={cx('meta')} />}

                {node?.excerpt && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: calculateTrimmedExcerpt(node.excerpt, node.uri, node.title),
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
    </div>
  )
}
