import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, gql } from '@apollo/client'
import Image from 'next/image'
import styles from './CategorySingleUpdates.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

// Query untuk ambil detail post berdasarkan slug
const GET_SINGLE_UPDATE = gql`
  query GetSingleUpdate($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      slug
      featuredImage {
        node {
          mediaItemUrl
          title
        }
      }
    }
  }
`

const SingleUpdates = () => {
  const router = useRouter()
  const { slug } = router.query

  const { data, loading, error } = useQuery(GET_SINGLE_UPDATE, {
    variables: { slug },
    skip: !slug, // agar tidak dijalankan sebelum slug tersedia
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const post = data?.post
  if (!post) return <p>Artikel tidak ditemukan.</p>

  const { title, content, date, featuredImage } = post

  return (
    <div className={cx('categorySingleUpdateWrapper')}>
      <h1 className={cx('title')}>{title}</h1>
      <p className={cx('date')}>
        {new Date(date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      {featuredImage?.node?.mediaItemUrl && (
        <div className={cx('imageWrapper')}>
          <Image
            src={featuredImage.node.mediaItemUrl}
            alt={featuredImage.node.title || title}
            width={800}
            height={500}
            className={cx('featuredImage')}
          />
        </div>
      )}

      <div
        className={cx('content')}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default SingleUpdates
