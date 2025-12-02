'use client'

import React, { useState, useDeferredValue, useRef, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames/bind'
import { IoSearchOutline } from 'react-icons/io5'
import { FaSpinner } from 'react-icons/fa'

import styles from './SearchTags.module.scss'
import { GetContentNodesSearch } from '../../queries/GetContentNodesSearch'

const cx = classNames.bind(styles)

export default function SearchTags({ setIsSearchResultsVisible }) {
  const [keyword, setKeyword] = useState('')
  const deferred = useDeferredValue(keyword)
  const isReady = deferred.length >= 2

  const inputRef = useRef()

  const clearSearch = () => {
    setKeyword('')
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }

  /* ----------------------------------------------
     SEARCH CONTENT NODES
  ------------------------------------------------*/
  const { data, loading, error } = useQuery(GetContentNodesSearch, {
    variables: { search: deferred, first: 50 },
    skip: !isReady,
    fetchPolicy: 'no-cache',
  })

  const results = useMemo(() => {
    if (!data) return []

    const nodes = data?.contentNodes?.nodes || []
    const seen = new Set()

    return nodes.filter((n) => {
      const key = n.uri || n.id
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [data])

  /* ----------------------------------------------
     UPDATE FULL MENU VISIBILITY — SAMA DENGAN SEARCHPOSTS
  ------------------------------------------------*/
  useEffect(() => {
    if (setIsSearchResultsVisible) {
      setIsSearchResultsVisible(keyword.length > 0 || results.length > 0)
    }
  }, [keyword, results, setIsSearchResultsVisible])

  /* ----------------------------------------------
     HELPERS
  ------------------------------------------------*/
  const highlight = (text, key) => {
    if (!key || !text) return text
    const regex = new RegExp(`(${key})`, 'gi')
    return text.replace(regex, '<mark class="global-highlight">$1</mark>')
  }

  const cleanExcerpt = (excerpt) => excerpt?.replace(/\[\/?dropcap\]/g, '') || ''

  const trimExcerpt = (excerpt) => {
    const MAX = 110
    let trimmed = cleanExcerpt(excerpt)?.substring(0, MAX)
    const last = trimmed.lastIndexOf(' ')
    if (last !== -1) trimmed = trimmed.substring(0, last)
    return trimmed + '...'
  }

  const extractImage = (node) => node?.featuredImage?.node?.sourceUrl || null

  const extractCategory = (node) => {
    switch (node?.__typename) {
      case 'Post':
        return node?.categories?.edges?.[0]?.node?.name || ''
      case 'TravelGuide':
        return 'Travel Guide'
      default:
        return node?.contentType?.node?.label || ''
    }
  }

  const extractTags = (node) =>
    node?.tags?.edges?.map((t) => t.node.name) || []

  /* ----------------------------------------------
     RENDER
  ------------------------------------------------*/
  return (
    <div className={cx('component')}>

      {/* SEARCH INPUT — UI SAMA DENGAN SearchPosts */}
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

          {error && (
            <div className={cx('no-results')}>Error: {error.message}</div>
          )}

          {!isReady && keyword.length > 0 && (
            <div className={cx('no-results')}>
              <div className={cx('no-results-row')}>
                <IoSearchOutline className={cx('no-results-icon')} />
                <span className={cx('no-results-text')}>
                  Type at least 2 characters…
                </span>
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
                <span className={cx('no-results-text')}>
                  No results found.
                </span>
              </div>
            </div>
          )}

          {/* LIST RESULTS */}
          {results.length > 0 &&
            results.map((node) => {
              const img = extractImage(node)
              const category = extractCategory(node)
              const tags = extractTags(node)

              return (
                <div key={node?.id} className={cx('content-wrapper')}>
                  
                  {/* LEFT IMAGE */}
                  <div className={cx('left-wrapper')}>
                    {img && (
                      <Link href={node.uri} className={cx('image-link')}>
                        <div className={cx('image-wrapper')}>
                          <Image
                            src={img}
                            alt={node?.title || ''}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* RIGHT SIDE */}
                  <div className={cx('right-wrapper')}>
                    <div className={cx('meta-date')}>
                      {category && <span className={cx('meta')}>{category}</span>}
                    </div>

                    {tags.length > 0 && (
                      <div className={cx('tags-row')}>
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className={cx('tag')}
                            dangerouslySetInnerHTML={{
                              __html: highlight(tag, deferred),
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {node.title && (
                      <h2 className={cx('title', 'truncate')}>
                        <Link href={node.uri}>{node.title}</Link>
                      </h2>
                    )}

                    {node.excerpt && (
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
