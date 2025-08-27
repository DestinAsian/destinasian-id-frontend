import { FaSearch, FaSpinner } from 'react-icons/fa'
import className from 'classnames/bind'
import styles from './SearchResults.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const PostInfo = dynamic(() => import('../../components/PostInfo/PostInfo'))
const cx = className.bind(styles)

export default function SearchResults({ searchResults, isLoading }) {
  const [filteredResults, setFilteredResults] = useState([])

  useEffect(() => {
    if (searchResults && searchResults.length) {
      setFilteredResults(searchResults)
    }
  }, [searchResults])

  const calculateTrimmedExcerpt = (excerpt, uri, title) => {
    const MAX_EXCERPT_LENGTH = 100
    let trimmedExcerpt = excerpt?.substring(0, MAX_EXCERPT_LENGTH)
    const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(' ')

    if (lastSpaceIndex !== -1) {
      trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + '...'
    }

    return `${trimmedExcerpt} <a class="more-link" href="${uri}">Continue reading <span class="screen-reader-text">${title}</span></a>`
  }

  // No Results
  if (!isLoading && !filteredResults?.length) {
    return (
      <div className={styles['no-results']}>
        <FaSearch className={styles['no-results-icon']} />
        <div className={styles['no-results-text']}>No results</div>
      </div>
    )
  }

  // ✅ Loading pakai FaSpinner
  if (isLoading) {
    return (
      <div className="mx-auto flex h-[88vh] max-w-[100vw] items-center justify-center sm:h-[95vh] md:max-w-[700px]">
        <div role="status">
          <FaSpinner className="h-8 w-8 animate-spin text-black dark:text-gray-600" />
        </div>
      </div>
    )
  }

  return (
    <div className={cx('component')}>
      {filteredResults
        .filter((node) => node?.title || node?.excerpt || node?.featuredImage?.node?.sourceUrl)
        .map((node) => {
          const imageUrl = node?.featuredImage?.node?.sourceUrl
          return (
            <div key={node?.databaseId} className={cx('content-wrapper')}>
              {/* Left: Image */}
              <div className={cx('left-wrapper')}>
                {imageUrl && (
                  <Link href={node?.uri || '#'} className={cx('image-link')}>
                    <div className={cx('image-wrapper')}>
                      <Image
                        src={imageUrl}
                        alt={node?.title || node?.name || 'Image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  </Link>
                )}
              </div>

              {/* Right: Meta + Title + Excerpt */}
              <div className={cx('right-wrapper')}>
                {node?.categories?.edges?.length > 0 && (
                  <div className={cx('meta-wrapper')}>
                    <Link href={node?.categories?.edges[0]?.node?.uri || '#'}>
                      <h2 className={cx('meta')}>
                        {node?.categories?.edges[0]?.node?.parent?.node?.name}{' '}
                        {node?.categories?.edges[0]?.node?.name}
                      </h2>
                    </Link>
                  </div>
                )}

                {node?.title && (
                  <h2 className={cx('title')}>
                    <Link href={node?.uri}>{node?.title}</Link>
                  </h2>
                )}

                {node?.date && <PostInfo date={node?.date} className={cx('meta')} />}

                {node?.excerpt && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: calculateTrimmedExcerpt(node?.excerpt, node?.uri, node?.title),
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

