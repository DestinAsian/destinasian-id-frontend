
import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import classNames from 'classnames/bind'
import dynamic from 'next/dynamic'

import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { GetVideos } from '../queries/GetVideos'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetHomepagePinPosts } from '../queries/GetHomepagePinPosts'
import { GetChildrenTravelGuides } from '../queries/GetChildrenTravelGuides'

import styles from '../components/VideoFrontPage/VideoFrontPage.module.scss'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
const HomepageHeader = dynamic(() => import('../components/HomepageHeader/HomepageHeader'))
const HomepageSecondaryHeader = dynamic(() => import('../components/HomepageHeader/HomepageSecondaryHeader/HomepageSecondaryHeader'))
const HomepageDestopHeader = dynamic(() => import('../components/HomepageHeader/HomepageDestopHeader/HomepageDestopHeader'))
const Main = dynamic(() => import('../components/Main/Main'))
const Container = dynamic(() => import('../components/Container/Container'))
const FeatureWell = dynamic(() => import('../components/FeatureWell/FeatureWell'))
const FrontPageLayout = dynamic(() => import('../components/FrontPageLayout/FrontPageLayout'), { ssr: false })
const FrontPageVideos = dynamic(() => import('../components/FrontPageLayout/FrontPageVideos'))
const Footer = dynamic(() => import('../components/Footer/Footer'))
const HalfPage2 = dynamic(() => import('../components/AdUnit/HalfPage2/HalfPage2'))
// const SEO = dynamic(() => import('../components/SEO/SEO'))

const cx = classNames.bind(styles)

export default function Component(props) {
  if (props.loading) return <>Loading...</>

  const { title: siteTitle, description: siteDescription } = props?.data?.generalSettings || {}
  const { featuredImage, uri, seo } = props?.data?.page || {}
  const { content } = props?.data?.guide || {}

  const acfHomepageSlider = props?.data?.page?.acfHomepageSlider
  const { databaseId, asPreview } = props?.__TEMPLATE_VARIABLES__ ?? {}

  const [currentFeatureWell, setCurrentFeatureWell] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Unified overflow control for modals & search
  useEffect(() => {
    const isBlocking = searchQuery || isNavShown || isGuidesNavShown
    document.body.style.overflow = isBlocking ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detect desktop
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Feature Well Slides
  const featureWell = [1, 2, 3].map((num) => ({
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
    const validSlides = featureWell.filter((item) => item.type)
    if (validSlides.length) {
      const randomIndex = Math.floor(Math.random() * validSlides.length)
      setCurrentFeatureWell(validSlides[randomIndex])
    }
  }, [])

  // Queries
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
    fetchPolicy: 'cache-first',
  })

  const {
    data: pinPostsData
  } = useQuery(GetHomepagePinPosts, {
    variables: { id: databaseId, asPreview },
    fetchPolicy: 'cache-and-network',
  })

  const { data: latestStories } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'cache-and-network',
  })

  const { data: videosData } = useQuery(GetVideos, {
    variables: { first: 2 },
    fetchPolicy: 'cache-and-network',
  })

  useQuery(GetChildrenTravelGuides)

  // Extract & sort posts
  const mainPosts = latestStories?.posts?.edges?.map((p) => p.node) || []
  const sortedPosts = mainPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
  const homepagePinPosts = pinPostsData?.page?.homepagePinPosts ?? []

  // Menu destructuring
  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.footerMenuItems?.nodes ?? []

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {/* <SEO title={seo?.title} description={seo?.metaDesc} imageUrl={featuredImage?.node?.sourceUrl} url={uri} focuskw={seo?.focuskw} /> */}
      {isDesktop ? (
        <HomepageDestopHeader {...{
          title: siteTitle,
          description: siteDescription,
          primaryMenuItems: primaryMenu,
          secondaryMenuItems: secondaryMenu,
          thirdMenuItems: thirdMenu,
          fourthMenuItems: fourthMenu,
          fifthMenuItems: fifthMenu,
          featureMenuItems: featureMenu,
          latestStories: sortedPosts,
          home: uri,
          menusLoading,
          latestLoading: !latestStories,
          searchQuery,
          setSearchQuery,
          isNavShown,
          setIsNavShown,
          isScrolled,
          isGuidesNavShown,
          setIsGuidesNavShown,
        }} />
      ) : (
        <>
          <HomepageHeader {...{
            title: siteTitle,
            description: siteDescription,
            primaryMenuItems: primaryMenu,
            secondaryMenuItems: secondaryMenu,
            thirdMenuItems: thirdMenu,
            fourthMenuItems: fourthMenu,
            fifthMenuItems: fifthMenu,
            featureMenuItems: featureMenu,
            latestStories: sortedPosts,
            home: uri,
            menusLoading,
            latestLoading: !latestStories,
            searchQuery,
            setSearchQuery,
            isNavShown,
            setIsNavShown,
            isScrolled,
          }} />
          <HomepageSecondaryHeader {...{
            searchQuery,
            setSearchQuery,
            isGuidesNavShown,
            setIsGuidesNavShown,
            isScrolled,
          }} />
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
          <div className="component-videos w-full" style={{ backgroundColor: '#008080' }}>
            <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
              <FrontPageVideos />
            </div>
          </div>
          {/* <HalfPage2 /> */}
        </div>
      </Main>

      <Footer />
    </main>
  )
}

Component.query = gql`
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

Component.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})
