import className from 'classnames/bind'
import styles from './ContentWrapperRCAFrontPage.module.scss'
import React from 'react'
import Link from 'next/link'

let cx = className.bind(styles)

export default function ContentWrapperRCAFrontPage({ content, firstIndex }) {
  return (
    <article className={cx('component')}>
      <div
        className={cx('content-wrapper')}
        dangerouslySetInnerHTML={{ __html: content ?? '' }}
      />
      <div className={cx('chevron-wrapper')}>
        {firstIndex && (
          <Link href={firstIndex} className={cx('chevron-button')}>
            <div className={cx('circle-wrapper')}>
              <svg
                width="83"
                height="99"
                viewBox="0 0 83 99"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M67.8857 63.5143L45.36 93.7543L35.7943 93.7543L13.3714 63.5143L26.1257 54.2571L40.7314 74.52L55.5429 54.2571L67.8857 63.5143ZM67.8857 14.0946L45.36 44.3346L35.7943 44.3346L13.3714 14.0946L26.1257 4.8375L40.7314 25.1004L55.5429 4.8375L67.8857 14.0946Z"
                  fill="none"
                />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </article>
  )
}
