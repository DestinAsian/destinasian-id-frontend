'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames/bind'
import { IoSearchOutline } from 'react-icons/io5'
import { FaSpinner } from 'react-icons/fa'

import styles from './SearchTags.module.scss'
import { GetContentNodesSearch } from '../../queries/GetContentNodesSearch'
import { useSWRGraphQL } from '../../lib/useSWRGraphQL'
import PostInfo from '../../components/PostInfo/PostInfo'

const cx = classNames.bind(styles)

const MIN_CHAR = 2
const FETCH_LIMIT = 500 // target 100–500 (sudah aman)

export default function SearchTags({ setIsSearchResultsVisible }) {
  const inputRef = useRef(null)

  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')

  /* ------------------------------
   * Debounce input
   * ---------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim())
    }, 400)

    return () => clearTimeout(timer)
  }, [keyword])

  const isReady = debouncedKeyword.length >= MIN_CHAR

  /* ------------------------------
   * Data fetching (SWR GraphQL)
   * ---------------------------- */
  const { data, error, isLoading } = useSWRGraphQL(
    isReady ? ['search-content-nodes', debouncedKeyword] : null,
    GetContentNodesSearch,
    {
      search: debouncedKeyword,
      first: FETCH_LIMIT
    }
  )

  /* ------------------------------
   * Transform & deduplicate data
   * ---------------------------- */
  const results = useMemo(() => {
    if (!data?.contentNodes?.nodes) return []

    const seen = new Set()

    return data.contentNodes.nodes.reduce((acc, node) => {
      if (!node?.id || seen.has(node.id)) return acc
      if (node.__typename !== 'Post' && node.__typename !== 'TravelGuide') return acc

      seen.add(node.id)

      const category =
        node.categories?.edges?.find(e => e.isPrimary)?.node?.name ||
        node.categories?.edges?.[0]?.node?.name ||
        ''

      acc.push({
        id: node.id,
        uri: node.uri,
        title: node.title,
        excerpt: node.excerpt,
        date: node.date,
        featuredImage: node.featuredImage?.node?.sourceUrl,
        category
      })

      return acc
    }, [])
  }, [data])

  /* ------------------------------
   * Parent visibility sync
   * ---------------------------- */
  useEffect(() => {
    if (!setIsSearchResultsVisible) return
    setIsSearchResultsVisible(keyword.length > 0 || results.length > 0)
  }, [keyword.length, results.length, setIsSearchResultsVisible])

  /* ------------------------------
   * Helpers
   * ---------------------------- */
  const clearSearch = useCallback(() => {
    setKeyword('')
    inputRef.current?.focus()
  }, [])

  const trimExcerpt = useCallback((excerpt) => {
    if (!excerpt) return ''

    const MAX = 110

    let text = excerpt
      .replace(/<[^>]+>/g, '') // basic safety
      .replace(/\[\/?dropcap\]/g, '')
      .slice(0, MAX)

    const lastSpace = text.lastIndexOf(' ')
    if (lastSpace > 0) text = text.slice(0, lastSpace)

    return `${text}...`
  }, [])

  /* ------------------------------
   * Render
   * ---------------------------- */
  return (
    <div className={cx('component')}>
      {/* SEARCH INPUT */}
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
          <button
            type="button"
            onClick={clearSearch}
            className={cx('search-close')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* RESULTS */}
      {(keyword.length > 0 || results.length > 0) && (
        <div className={cx('results-scroll')}>
          {error && (
            <div className={cx('no-results')}>
              Error: {error.message}
            </div>
          )}

          {!isReady && keyword.length > 0 && (
            <div className={cx('no-results')}>
              <IoSearchOutline className={cx('no-results-icon')} />
              <span className={cx('no-results-text')}>
                Type at least {MIN_CHAR} characters…
              </span>
            </div>
          )}

          {isLoading && (
            <div className="mx-auto flex h-[40vh] items-center justify-center">
              <FaSpinner className="h-8 w-8 animate-spin text-black" />
            </div>
          )}

          {isReady && !isLoading && results.length === 0 && (
            <div className={cx('no-results')}>
              <IoSearchOutline className={cx('no-results-icon')} />
              <span className={cx('no-results-text')}>
                No results found.
              </span>
            </div>
          )}

          {results.map(item => (
            <div key={item.id} className={cx('content-wrapper')}>
              {item.featuredImage && (
                <Link href={item.uri} className={cx('image-link')}>
                  <div className={cx('image-wrapper')}>
                    <Image
                      src={item.featuredImage}
                      alt={item.title || ''}
                      width={300}
                      height={225} // 4:3 ratio
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Link>
              )}

              <div className={cx('right-wrapper')}>
                {item.category && item.date && (
                  <div className={cx('meta-date')}>
                    <span className={cx('meta')}>{item.category}</span>
                    <span className={cx('meta')}> | </span>
                    <PostInfo date={item.date} className={cx('meta')} />
                  </div>
                )}

                <h2 className={cx('title', 'truncate')}>
                  <Link href={item.uri}>{item.title}</Link>
                </h2>

                {item.excerpt && (
                  <div className={cx('excerpt')}>
                    {trimExcerpt(item.excerpt)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
