import { useQuery } from '@apollo/client'
import React, { useState, useRef } from 'react'
import className from 'classnames/bind'
import styles from './ContentWrapperVideo.module.scss'
import { GetVideos } from '../../queries/GetVideos'
import { Button, Heading } from '../../components'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import Link from 'next/link'

let cx = className.bind(styles)

export default function ContentWrapperVideo() {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const offsetPosts = 1
  const videosPerPage = 6

  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

  // Extract Youtube Video
  const extractYouTubeVideoId = (embedUrl) => {
    const match = embedUrl.match(/\/embed\/([^?"]+)/)
    return match ? match[1] : null
  }

  // Extract Local Video
  const extractVideoSrc = (content) => {
    const match = content.match(/<video[^>]*>\s*<source[^>]*src="([^"]+)"/)
    return match ? match[1] : null
  }

  const params = (content) => {
    const videoId = extractYouTubeVideoId(content)
    const url = `&playlist=${videoId}&loop=1&controls=0&disablekb=1');`
    return url ? url : null
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const containsYouTube = (content) => {
    return content.includes('youtube')
  }

  // Get DA Video Offset
  const { data: firstData } = useQuery(GetVideos, {
    variables: {
      after: null,
      first: offsetPosts,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // First Post
  const startCursor = firstData?.videos?.pageInfo?.startCursor
  const latestVideos = firstData?.videos?.edges[0]

  // Get Pages
  const { data, error, loading, fetchMore } = useQuery(GetVideos, {
    variables: {
      first: videosPerPage,
      after: startCursor,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const updateQuery = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev

    const prevEdges = data?.videos?.edges || []
    const newEdges = fetchMoreResult?.videos?.edges || []

    return {
      ...data,
      videos: {
        ...data?.videos,
        edges: [...prevEdges, ...newEdges],
        pageInfo: fetchMoreResult?.videos?.pageInfo,
      },
    }
  }

  // Function to fetch more posts
  const fetchMorePosts = () => {
    if (!isFetchingMore && data?.videos?.pageInfo?.hasNextPage) {
      setIsFetchingMore(true)
      fetchMore({
        variables: {
          after: data?.videos?.pageInfo?.endCursor,
        },
        updateQuery,
      }).then(() => {
        setIsFetchingMore(false) // Reset the flag after fetch is done
      })
    }
  }

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

  // Other Post
  const otherVideos = data?.videos?.edges?.map((post) => post)

  return (
    <div className={cx('component')}>
      <div className={cx('full-wrapper')}>
        {latestVideos && (
          <div className={cx('first-wrapper')}>
            <div className={cx('first-video-wrapper')}>
              {latestVideos?.node?.content && (
                <div className={cx('first-iframe-wrapper')}>
                  {containsYouTube(latestVideos?.node?.content) ? (
                    <LiteYouTubeEmbed
                      id={extractYouTubeVideoId(latestVideos?.node?.content)}
                      title={latestVideos?.node?.title}
                      muted={true}
                      params={params(latestVideos?.node?.content)}
                      playerClass="play-icon"
                      poster="maxresdefault"
                      webp={true}
                    />
                  ) : (
                    <div className={cx('local-video-wrapper')}>
                      <video
                        ref={videoRef}
                        src={extractVideoSrc(latestVideos?.node?.content)}
                        className="video-content"
                        loop
                        autoPlay
                        muted
                        poster={
                          latestVideos?.node?.featuredImage?.node?.sourceUrl
                        }
                      />
                    </div>
                  )}
                </div>
              )}
              <div className={cx('first-video-text-wrapper')}>
                <div className={cx('first-guides-text-wrapper')}>
                  {latestVideos?.node?.videosAcf?.guidesCategoryLink &&
                    latestVideos?.node?.videosAcf?.guidesCategoryText && (
                      <Link
                        href={latestVideos?.node?.videosAcf?.guidesCategoryLink}
                      >
                        <Heading className={cx('first-guides-text')}>
                          {latestVideos?.node?.videosAcf?.guidesCategoryText}
                        </Heading>
                      </Link>
                    )}
                  {latestVideos?.node?.videosAcf?.guidesCategoryLink === null &&
                    latestVideos?.node?.videosAcf?.guidesCategoryText && (
                      <Heading className={cx('first-guides-text')}>
                        {latestVideos?.node?.videosAcf?.guidesCategoryText}
                      </Heading>
                    )}
                </div>
                <div className={cx('first-title-wrapper')}>
                  {latestVideos?.node?.videosAcf?.videoLink &&
                    latestVideos?.node?.title && (
                      <Link href={latestVideos?.node?.videosAcf?.videoLink}>
                        <h2 className={cx('title')}>
                          {latestVideos?.node?.title}
                        </h2>
                      </Link>
                    )}
                  {latestVideos?.node?.videosAcf?.videoLink === null &&
                    latestVideos?.node?.title && (
                      <h2 className={cx('title')}>
                        {latestVideos?.node?.title}
                      </h2>
                    )}
                </div>
                <div className={cx('first-custom-text-wrapper')}>
                  {latestVideos?.node?.videosAcf?.customLink &&
                    latestVideos?.node?.videosAcf?.customText && (
                      <Link href={latestVideos?.node?.videosAcf?.customLink}>
                        <Heading className={cx('first-custom-text')}>
                          {latestVideos?.node?.videosAcf?.customText}
                        </Heading>
                      </Link>
                    )}
                  {latestVideos?.node?.videosAcf?.customLink === null &&
                    latestVideos?.node?.videosAcf?.customText && (
                      <Heading className={cx('first-custom-text')}>
                        {latestVideos?.node?.videosAcf?.customText}
                      </Heading>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={cx('other-wrapper')}>
          {otherVideos.length !== 0 &&
            otherVideos.map((post, index) => (
              <div className={cx('other-video-wrapper')}>
                {post?.node?.content && (
                  <div className={cx('other-iframe-wrapper')}>
                    {containsYouTube(post?.node?.content) ? (
                      <LiteYouTubeEmbed
                        id={extractYouTubeVideoId(post?.node?.content)}
                        title={post?.node?.title}
                        muted={true}
                        params={params(post?.node?.content)}
                        playerClass="play-icon"
                        poster="maxresdefault"
                        webp={true}
                      />
                    ) : (
                      <div className={cx('local-video-wrapper')}>
                        <video
                          ref={videoRef}
                          src={extractVideoSrc(post?.node?.content)}
                          className="video-content"
                          loop
                          muted
                          poster={post?.node?.featuredImage?.node?.sourceUrl}
                        />
                        {!isPlaying && (
                          <button
                            className={cx('play-button')}
                            onClick={handlePlayPause}
                          ></button>
                        )}
                        {isPlaying && (
                          <button
                            className={cx('pause-button')}
                            onClick={handlePlayPause}
                          ></button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className={cx('other-video-text-wrapper')}>
                  <div className={cx('other-guides-text-wrapper')}>
                    {post?.node?.videosAcf?.guidesCategoryLink &&
                      post?.node?.videosAcf?.guidesCategoryText && (
                        <Link href={post?.node?.videosAcf?.guidesCategoryLink}>
                          <Heading className={cx('other-guides-text')}>
                            {post?.node?.videosAcf?.guidesCategoryText}
                          </Heading>
                        </Link>
                      )}
                    {post?.node?.videosAcf?.guidesCategoryLink === null &&
                      post?.node?.videosAcf?.guidesCategoryText && (
                        <Heading className={cx('other-guides-text')}>
                          {post?.node?.videosAcf?.guidesCategoryText}
                        </Heading>
                      )}
                  </div>
                  <div className={cx('other-title-wrapper')}>
                    {post?.node?.videosAcf?.videoLink && post?.node?.title && (
                      <Link href={post?.node?.videosAcf?.videoLink}>
                        <h2>{post?.node?.title}</h2>
                      </Link>
                    )}
                    {post?.node?.videosAcf?.videoLink === null &&
                      post?.node?.title && <h2>{post?.node?.title}</h2>}
                  </div>
                  <div className={cx('other-custom-text-wrapper')}>
                    {post?.node?.videosAcf?.customLink &&
                      post?.node?.videosAcf?.customText && (
                        <Link href={post?.node?.videosAcf?.customLink}>
                          <Heading className={cx('other-custom-text')}>
                            {post?.node?.videosAcf?.customText}
                          </Heading>
                        </Link>
                      )}
                    {post?.node?.videosAcf?.customLink === null &&
                      post?.node?.videosAcf?.customText && (
                        <Heading className={cx('other-custom-text')}>
                          {post?.node?.videosAcf?.customText}
                        </Heading>
                      )}
                  </div>
                </div>
              </div>
            ))}
          {otherVideos.length && (
            <div className="mx-auto my-0 flex max-w-[100vw] justify-center md:max-w-[700px]	">
              {data?.videos?.pageInfo?.hasNextPage &&
                data?.videos?.pageInfo?.endCursor && (
                  <Button
                    onClick={() => {
                      if (
                        !isFetchingMore &&
                        data?.videos?.pageInfo?.hasNextPage
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
                            fill="#000000"
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
      </div>
    </div>
  )
}
