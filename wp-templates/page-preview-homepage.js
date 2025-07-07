import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import classNames from 'classnames/bind'
import styles from '../components/VideoFrontPage/VideoFrontPage.module.scss'
import { GetVideos } from '../queries/GetVideos'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetHomepagePinPosts } from '../queries/GetHomepagePinPosts'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'

import dynamic from 'next/dynamic'
const HomepageHeader = dynamic(() => import('../components/HomepageHeader/HomepageHeader'))
const HomepageSecondaryHeader = dynamic(() => import('../components/HomepageHeader/HomepageSecondaryHeader/HomepageSecondaryHeader'))
const HomepageDestopHeader = dynamic(() => import('../components/HomepageHeader/HomepageDestopHeader/HomepageDestopHeader'))
const Main = dynamic(() => import('../components/Main/Main'))
const Container = dynamic(() => import('../components/Container/Container'))
const FeatureWell = dynamic(() => import('../components/FeatureWell/FeatureWell'))
const FrontPageLayout = dynamic(() => import('../components/FrontPageLayout/FrontPageLayout'))
const ContentWrapperVideo = dynamic(() => import('../components/ContentWrapperVideo/ContentWrapperVideo'))
const Outnow = dynamic(() => import('../components/Outnow/Outnow'))
const Footer = dynamic(() => import('../components/Footer/Footer'))
const HalfPage2 = dynamic(() => import('../components/AdUnit/HalfPage2/HalfPage2'))
const SEO = dynamic(() => import('../components/SEO/SEO'))
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'

export default function Preview_homepage(props) {
  if (props.loading) return <>Loading...</>

  const {
    data: {
      generalSettings: { title: siteTitle, description: siteDescription },
      page: { featuredImage, uri, seo, acfHomepageSlider, acfGalleryImages = [] } = {},
      guide: { content } = {},
    } = {},
    __TEMPLATE_VARIABLES__: { databaseId, asPreview } = {},
  } = props

  const [currentFeatureWell, setCurrentFeatureWell] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const cx = classNames.bind(styles)

  useEffect(() => {
    document.body.style.overflow = searchQuery || isNavShown || isGuidesNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    handleScroll()
    handleResize()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const featureWell = [1, 2, 3].map(num => ({
    type: acfHomepageSlider?.[`typeSlide${num}`],
    videoSrc: acfHomepageSlider?.[`video${num}`]?.mediaItemUrl,
    desktopSrc: acfHomepageSlider?.[`desktopSlide${num}`]?.mediaItemUrl,
    mobileSrc: acfHomepageSlider?.[`mobileSlide${num}`]?.mediaItemUrl,
    url: acfHomepageSlider?.[`slideLink${num}`],
    category: acfHomepageSlider?.[`slideCategory${num}`],
    categoryLink: acfHomepageSlider?.[`slideCategoryLink${num}`],
    caption: acfHomepageSlider?.[`slideCaption${num}`],
    standFirst: acfHomepageSlider?.[`slideStandFirst${num}`],
  }))

  useEffect(() => {
    const filtered = featureWell.filter(item => item.type)
    if (filtered[0]) {
      const randIndex = Math.floor(Math.random() * filtered.length)
      setCurrentFeatureWell(filtered[randIndex])
    }
  }, [])

  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 20,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
      featureHeaderLocation: MENUS.FEATURE_LOCATION,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.footerMenuItems?.nodes ?? []

  const { data: pinPostsStories } = useQuery(GetHomepagePinPosts, {
    variables: { id: databaseId, asPreview },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })
  const homepagePinPosts = pinPostsStories?.page?.homepagePinPosts ?? []

  const { data: latestStories, loading: latestLoading } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const mainPosts = latestStories?.posts?.edges?.map(edge => edge.node) || []
  const sortedPosts = mainPosts.sort((a, b) => new Date(b.date) - new Date(a.date))

  const { data: videosData, loading: videosLoading, error: videosError } = useQuery(GetVideos, {
    variables: { first: 10 },
  })
  const videos = videosData?.videos?.edges || []

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {/* <SEO title={seo?.title} description={seo?.metaDesc} imageUrl={featuredImage?.node?.sourceUrl} url={uri} focuskw={seo?.focuskw} /> */}
      {isDesktop ? (
        <HomepageDestopHeader {...{ siteTitle, siteDescription, primaryMenu, secondaryMenu, thirdMenu, fourthMenu, fifthMenu, featureMenu, latestStories: sortedPosts, home: uri, menusLoading, latestLoading, searchQuery, setSearchQuery, isNavShown, setIsNavShown, isScrolled, isGuidesNavShown, setIsGuidesNavShown }} />
      ) : (
        <>
          <HomepageHeader {...{ siteTitle, siteDescription, primaryMenu, secondaryMenu, thirdMenu, fourthMenu, fifthMenu, featureMenu, latestStories: sortedPosts, home: uri, menusLoading, latestLoading, searchQuery, setSearchQuery, isNavShown, setIsNavShown, isScrolled }} />
          <HomepageSecondaryHeader {...{ searchQuery, setSearchQuery, isGuidesNavShown, setIsGuidesNavShown, isScrolled }} />
        </>
      )}
      <Main>
        <div className="snap-y snap-mandatory">
          <div className="snap-start">
            {currentFeatureWell && (
              <Container>
                <FeatureWell featureWells={featureWell} />
              </Container>
            )}
          </div>
          <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
            <FrontPageLayout />
          </div>
          <div className="w-full" style={{ backgroundColor: '#008080' }}>
            <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
              <h2 className={cx('title-videos')}>Videos</h2>
              <div className={cx('wrapper-videos')} />
              <div className={cx('component-videos')}>
                <div className={cx('two-columns')}>
                  <div className={cx('left-column')}>
                    {!videosLoading && !videosError && videos.length > 0 && (
                      <div className={cx('category-updates-component')}>
                        <ContentWrapperVideo data={videos} />
                      </div>
                    )}
                  </div>
                  <div className={cx('right-column')}>
                    <aside className={cx('outnow-wrapper')}>
                      <div className={cx('outnow-videos')}>
                        <Outnow />
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <HalfPage2 />
        </div>
      </Main>
      <Footer />
    </main>
  )
}

Preview_homepage.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      uri
      seo {
        title
        metaDesc
        focuskw
      }
      ...FeaturedImageFragment
      acfHomepageSlider {
        desktopSlide1 { mediaItemUrl }
        desktopSlide2 { mediaItemUrl }
        desktopSlide3 { mediaItemUrl }
        mobileSlide1 { mediaItemUrl }
        mobileSlide2 { mediaItemUrl }
        mobileSlide3 { mediaItemUrl }
        video1 { mediaItemUrl }
        video2 { mediaItemUrl }
        video3 { mediaItemUrl }
        slideCaption1
        slideCaption2
        slideCaption3
        slideStandFirst1
        slideStandFirst2
        slideStandFirst3
        slideCategory1
        slideCategory2
        slideCategory3
        slideCategoryLink1
        slideCategoryLink2
        slideCategoryLink3
        slideLink1
        slideLink2
        slideLink3
        typeSlide1
        typeSlide2
        typeSlide3
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Preview_homepage.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})