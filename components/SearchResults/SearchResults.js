import { FaSpinner } from 'react-icons/fa'
import classNames from 'classnames/bind'
import styles from './SearchResults.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { IoSearchOutline } from 'react-icons/io5'
const PostInfo = dynamic(() => import('../../components/PostInfo/PostInfo'))
const cx = classNames.bind(styles)

export default function SearchResults({ searchResults, isLoading }) {
  const [filteredResults, setFilteredResults] = useState([])
  const MAX_RESULTS = 20

  useEffect(() => {
    if (searchResults?.length) {
      setFilteredResults(searchResults)
    } else {
      setFilteredResults([])
    }
  }, [searchResults])

  // Hapus tag dropcap dari excerpt
  const cleanExcerpt = (excerpt) => {
    if (!excerpt) return ''
    return excerpt.replace(/\[\/?dropcap\]/g, '')
  }

  const calculateTrimmedExcerpt = (excerpt, uri, title) => {
    const MAX_EXCERPT_LENGTH = 100
    let trimmed = cleanExcerpt(excerpt)?.substring(0, MAX_EXCERPT_LENGTH) ?? ''
    const lastSpace = trimmed.lastIndexOf(' ')
    if (lastSpace !== -1) trimmed = trimmed.substring(0, lastSpace) + '...'
    return trimmed
  }

  if (!isLoading && !filteredResults.length) {
    return (
      <div className={styles['no-results']}>
        {/* Wrapper horizontal */}
        <div className={styles['no-results-row']}>
          <IoSearchOutline className={styles['no-results-icon']} />
          <span className={styles['no-results-text']}>No results found.</span>
        </div>

        {/* Teks penjelasan */}
        <div className={styles['no-results-subtext']}>
          Please ensure the correct tags are entered.
        </div>
      </div>
    )
  }

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
        .filter(
          (node) =>
            node?.title ||
            node?.excerpt ||
            node?.featuredImage?.node?.sourceUrl,
        )
        .slice(0, MAX_RESULTS)
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
                {/* Meta + Date Sejajar */}
                <div className={cx('meta-date')}>
                  {node?.categories?.edges?.length > 0 && (
                    <Link href={node.categories.edges[0].node.uri || '#'}>
                      <span className={cx('meta')}>
                        {node.categories.edges[0].node.parent?.node?.name}{' '}
                        {node.categories.edges[0].node.name}
                      </span>
                    </Link>
                  )}
                </div>

                {/* Title dibatasi 2 baris */}
                {node?.title && (
                  <h2 className={cx('title', 'truncate')}>
                    <Link href={node?.uri}>{node?.title}</Link>
                  </h2>
                )}

                {/* Excerpt tampil di desktop saja */}
                {node?.excerpt && (
                  <div
                    className={cx('excerpt')}
                    dangerouslySetInnerHTML={{
                      __html: calculateTrimmedExcerpt(
                        node.excerpt,
                        node.uri,
                        node.title,
                      ),
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
