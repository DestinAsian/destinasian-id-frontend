import { useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import className from 'classnames/bind'
import styles from './ContentWrapperLLFrontPage.module.scss'
import { GetLuxeListStories } from '../../queries/GetLuxeListStories'
import { LLPost, Button } from '../../components'
import { renderToStaticMarkup } from 'react-dom/server'
import Image from 'next/image'
import { BACKEND_URL } from '../../constants/backendUrl'

let cx = className.bind(styles)

export default function ContentWrapperLLFrontPage({
  content,
  databaseId,
  parentTitle,
}) {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const postsPerPage = 4
  const [transformedContent, setTransformedContent] = useState('')

  useEffect(() => {
    // Function to extract image data and replace <img> with <Image>
    const extractImageData = () => {
      // Create a DOMParser
      const parser = new DOMParser()

      // Parse the HTML content
      const doc = parser.parseFromString(content, 'text/html')

      // Get only image elements with src containing BACKEND_URL
      const imageElements = doc.querySelectorAll(`img[src*="${BACKEND_URL}"]`)

      // Replace <img> elements with <Image> components
      imageElements.forEach((img) => {
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        const width = img.getAttribute('width')
        const height = img.getAttribute('height')

        // Create Image component
        const imageComponent = (
          <Image
            src={src}
            alt={alt}
            width={width ? width : '500'}
            height={height ? height : '500'}
            style={{ objectFit: 'contain' }}
            priority
          />
        )

        // Render the Image component to HTML string
        const imageHtmlString = renderToStaticMarkup(imageComponent)

        // Replace the <img> element with the Image HTML string in the HTML content
        img.outerHTML = imageHtmlString
      })

      // Set the transformed HTML content
      setTransformedContent(doc.body.innerHTML)
    }

    // Call the function to extract image data and replace <img>
    extractImageData()
  }, [content])

  // Get Pages
  const { data, error, loading, fetchMore } = useQuery(GetLuxeListStories, {
    variables: {
      first: postsPerPage,
      after: null,
      id: databaseId,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const luxeList = data?.luxeListBy

  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev

    const prevEdges = data?.luxeListBy?.children?.edges || []
    const newEdges = fetchMoreResult?.luxeListBy?.children?.edges || []

    return {
      ...data,
      luxeListBy: {
        ...data?.luxeListBy,
        children: {
          ...data?.luxeListBy?.children,
          edges: [...prevEdges, ...newEdges],
          pageInfo: fetchMoreResult?.luxeListBy?.children?.pageInfo,
        },
      },
    }
  }

  // Function to fetch more posts
  const fetchMorePosts = () => {
    if (!isFetchingMore && luxeList?.children?.pageInfo?.hasNextPage) {
      setIsFetchingMore(true)
      fetchMore({
        variables: {
          after: luxeList?.children?.pageInfo?.endCursor,
        },
        updateQuery,
      }).then(() => {
        setIsFetchingMore(false) // Reset the flag after fetch is done
      })
    }
  }

  // Scroll event listener to detect when user scrolls to the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight

      if (scrolledToBottom) {
        // Call the function to fetch more when scrolled to the bottom
        fetchMorePosts()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [data, isFetchingMore, luxeList])

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>
  }

  if (loading) {
    return (
      <>
        <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
          <Button className="gap-x-4	">{'Loading...'}</Button>
        </div>
      </>
    )
  }

  // Declare all posts
  const allPosts = luxeList?.children?.edges.map((post) => post.node)

  return (
    <article className={cx('component')}>
      <div
        className={cx('content-wrapper')}
        dangerouslySetInnerHTML={{ __html: transformedContent ?? '' }}
      />
      <div className={cx('full-wrapper')}>
        {allPosts.length !== 0 &&
          allPosts.map((post, index) => (
            <React.Fragment key={post?.id}>
              <LLPost
                title={post?.title}
                uri={post?.uri}
                category={post?.categories?.edges[0]?.node?.name}
                categoryUri={post?.categories?.edges[0]?.node?.uri}
                featuredImage={post?.featuredImage?.node}
                parentTitle={parentTitle}
              />
            </React.Fragment>
          ))}
        {allPosts.length && (
          <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
            {luxeList?.children?.pageInfo?.hasNextPage &&
              luxeList?.children?.pageInfo?.endCursor && (
                <Button
                  onClick={() => {
                    if (
                      !isFetchingMore &&
                      luxeList?.children?.pageInfo?.hasNextPage
                    ) {
                      fetchMorePosts()
                    }
                  }}
                  className="gap-x-4	"
                >
                  {isFetchingMore ? (
                    'Loading...' // Display loading text when fetching
                  ) : (
                    <>
                      Load More{' '}
                      <svg
                        className="h-auto w-8 origin-center rotate-90"
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="512.000000pt"
                        height="512.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#ffffff"
                          stroke="none"
                        >
                          <path
                            d="M1387 5110 c-243 -62 -373 -329 -272 -560 27 -62 77 -114 989 -1027
l961 -963 -961 -963 c-912 -913 -962 -965 -989 -1027 -40 -91 -46 -200 -15
-289 39 -117 106 -191 220 -245 59 -28 74 -31 160 -30 74 0 108 5 155 23 58
22 106 70 1198 1160 1304 1302 1202 1185 1202 1371 0 186 102 69 -1202 1371
-1102 1101 -1140 1137 -1198 1159 -67 25 -189 34 -248 20z"
                          />
                        </g>
                      </svg>
                    </>
                  )}
                </Button>
              )}
          </div>
        )}
      </div>
    </article>
  )
}
