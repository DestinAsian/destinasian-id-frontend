
'use client'

import React, { useState, useDeferredValue, useRef, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames/bind'
import { IoSearchOutline } from 'react-icons/io5'
import { FaSpinner } from 'react-icons/fa'

import styles from './SearchPosts.module.scss'
import { GetSearchAll } from '../../queries/GetSearchAll'

const cx = classNames.bind(styles)

export default function SearchPosts({ setIsSearchResultsVisible }) {
  const [keyword, setKeyword] = useState('')
  const deferred = useDeferredValue(keyword)
  const isReady = deferred.length >= 2

  const inputRef = useRef()
  const clearSearch = () => {
    setKeyword('')
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  const { data, loading, error } = useQuery(GetSearchAll, {
    variables: { search: deferred, first: 30 },
    skip: !isReady,
  })

  const results = data?.contentNodes?.nodes || []

  // Update FullMenu tentang visibilitas search
  useEffect(() => {
    if (setIsSearchResultsVisible) {
      setIsSearchResultsVisible(keyword.length > 0 || results.length > 0)
    }
  }, [keyword, results, setIsSearchResultsVisible])

  const highlight = (text, key) => {
    if (!key) return text
    const regex = new RegExp(`(${key})`, 'gi')
    return text.replace(regex, '<mark class="global-highlight">$1</mark>')
  }

  const cleanExcerpt = (excerpt) => excerpt?.replace(/\[\/?dropcap\]/g, '') || ''

  const trimExcerpt = (excerpt) => {
    const MAX = 110
    let trimmed = cleanExcerpt(excerpt)?.substring(0, MAX)
    const last = trimmed.lastIndexOf(' ')
    if (last !== -1) trimmed = trimmed.substring(0, last) + '...'
    return trimmed
  }

  return (
    <div className={cx('component')}>
      {/* INPUT SEARCH */}
      <div className={cx('search-wrapper', 'fixed-search')}>
        <IoSearchOutline className={cx('search-icon')} />

        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your search…"
          className={cx('search-input')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        {keyword.length > 0 && (
          <button onClick={clearSearch} className={cx('search-close')}>
            ×
          </button>
        )}
      </div>

      {/* RESULTS */}
      {(keyword.length > 0 || results.length > 0) && (
        <div className={cx('results-scroll')}>
          {error && <div className={cx('no-results')}>Error: {error.message}</div>}

          {!isReady && keyword.length > 0 && (
            <div className={cx('no-results')}>
              <div className={cx('no-results-row')}>
                <IoSearchOutline className={cx('no-results-icon')} />
                <span className={cx('no-results-text')}>Type at least 2 characters…</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="mx-auto flex h-[40vh] items-center justify-center">
              <FaSpinner className="h-8 w-8 animate-spin text-black" />
            </div>
          )}

          {isReady && !loading && results.length === 0 && (
            <div className={cx('no-results')}>
              <div className={cx('no-results-row')}>
                <IoSearchOutline className={cx('no-results-icon')} />
                <span className={cx('no-results-text')}>No results found.</span>
              </div>
            </div>
          )}

          {/* HASIL LIST */}
          {results.length > 0 &&
            results.map((node) => {
              const img = node?.featuredImage?.node?.sourceUrl
              const category =
                node?.categories?.edges?.[0]?.node?.name ||
                node?.contentType?.node?.label ||
                ''

              return (
                <div key={node?.id} className={cx('content-wrapper')}>
                  <div className={cx('left-wrapper')}>
                    {img && (
                      <Link href={node.uri} className={cx('image-link')}>
                        <div className={cx('image-wrapper')}>
                          <Image
                            src={img}
                            alt={node?.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className={cx('right-wrapper')}>
                    <div className={cx('meta-date')}>
                      {category && <span className={cx('meta')}>{category}</span>}
                    </div>

                    {node?.title && (
                      <h2 className={cx('title', 'truncate')}>
                        <Link
                          href={node.uri}
                          dangerouslySetInnerHTML={{
                            __html: highlight(node.title, deferred),
                          }}
                        />
                      </h2>
                    )}

                    {node?.excerpt && (
                      <div
                        className={cx('excerpt')}
                        dangerouslySetInnerHTML={{
                          __html: trimExcerpt(node.excerpt),
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}