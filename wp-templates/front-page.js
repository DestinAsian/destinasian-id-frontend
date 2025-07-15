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
import { GetChildrenTravelGuides } from '../queries/GetChildrenTravelGuides'

import dynamic from 'next/dynamic'
const HomepageHeader = dynamic(() =>
  import('../components/HomepageHeader/HomepageHeader'),
)
const HomepageSecondaryHeader = dynamic(() =>
  import(
    '../components/HomepageHeader/HomepageSecondaryHeader/HomepageSecondaryHeader'
  ),
)
const HomepageDestopHeader = dynamic(() =>
  import(
    '../components/HomepageHeader/HomepageDestopHeader/HomepageDestopHeader'
  ),
)
const Main = dynamic(() => import('../components/Main/Main'))
const Container = dynamic(() => import('../components/Container/Container'))
const FeatureWell = dynamic(() =>
  import('../components/FeatureWell/FeatureWell'),
)
const FrontPageLayout = dynamic(() =>
  import('../components/FrontPageLayout/FrontPageLayout'), { ssr: false }
)
const FrontPageVideos = dynamic(() =>
  import('../components/FrontPageLayout/FrontPageVideos'),
)
const Footer = dynamic(() => import('../components/Footer/Footer'))
const HalfPage2 = dynamic(() =>
  import('../components/AdUnit/HalfPage2/HalfPage2'),
)
const SEO = dynamic(() => import('../components/SEO/SEO'))
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const { featuredImage, uri, seo } = props?.data?.page || {}
  const { content } = props?.data?.guide || {}
  const images = props?.data?.page?.acfGalleryImages ?? []

  const acfHomepageSlider = props?.data?.page?.acfHomepageSlider

  const { databaseId, asPreview } = props?.__TEMPLATE_VARIABLES__ ?? {}

  const [currentFeatureWell, setCurrentFeatureWell] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  // Stop scrolling pages when searchQuery
  useEffect(() => {
    if (searchQuery !== '') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [searchQuery])

  // Add sticky header on scroll
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Stop scrolling pages when isNavShown
  useEffect(() => {
    if (isNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isNavShown])

  // Stop scrolling pages when isGuidesNavShown
  useEffect(() => {
    if (isGuidesNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isGuidesNavShown])

  // Slideshow untuk FeatureWell
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
    const filteredFeatureWell = featureWell.filter((item) => item.type !== null)
    if (filteredFeatureWell?.[0]) {
      const randomIndex = Math.floor(
        Math.random() * filteredFeatureWell?.length,
      )
      setCurrentFeatureWell(filteredFeatureWell[randomIndex])
    }
  }, [])

  // Get menus
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
    fetchPolicy: 'cache-first', // Cepat karena data jarang berubah
    nextFetchPolicy: 'cache-first',
  })

  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.footerMenuItems?.nodes ?? []

  // Pin posts
  const { data: pinPostsStories } = useQuery(GetHomepagePinPosts, {
    variables: { id: databaseId, asPreview },
    fetchPolicy: 'cache-and-network', // Cepat + tetap segar
    nextFetchPolicy: 'cache-first',
  })
  // State variable of homepage pin posts
  const homepagePinPosts = pinPostsStories?.page?.homepagePinPosts ?? []

  // Get latest travel stories
  const { data: latestStories, loading: latestLoading } = useQuery(
    GetLatestStories,
    {
      variables: {
        first: 5,
      },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  )

  const cx = classNames.bind(styles)
  const {
    data: videosData,
    loading: videosLoading,
    error: videosError,
  } = useQuery(GetVideos, {
    variables: { first: 2 },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })
  const videos = videosData?.videos?.edges || []

  const posts = latestStories?.posts ?? []
  const guides = latestStories?.guides ?? []

  const mainPosts = []
  const mainGuidePosts = []

  // loop through all the main categories posts
  posts?.edges?.forEach((post) => {
    mainPosts.push(post.node)
  })

  guides?.edges?.forEach((post) => {
    mainGuidePosts.push(post.node)
  })

  // sort posts by date
  const sortPostsByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA // Sort in descending order
  }

  // define mainCatPostCards
  const mainCatPosts = [...(mainPosts != null ? mainPosts : [])]

  // sortByDate mainCat & childCat Posts
  const allPosts = mainCatPosts.sort(sortPostsByDate)
  // Tambahkan di atas dalam komponen
  const [isDesktop, setIsDesktop] = useState(false)

  const {
    data: travelGuideData,
    loading: travelGuideLoading,
    error: travelGuideError,
  } = useQuery(GetChildrenTravelGuides)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    handleResize() // jalankan pertama kali
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {/* <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      /> */}
      <>
        {isDesktop ? (
          <HomepageDestopHeader
            title={siteTitle}
            description={siteDescription}
            primaryMenuItems={primaryMenu}
            secondaryMenuItems={secondaryMenu}
            thirdMenuItems={thirdMenu}
            fourthMenuItems={fourthMenu}
            fifthMenuItems={fifthMenu}
            featureMenuItems={featureMenu}
            latestStories={allPosts}
            home={uri}
            menusLoading={menusLoading}
            latestLoading={latestLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
          />
        ) : (
          <>
            <HomepageHeader
              title={siteTitle}
              description={siteDescription}
              primaryMenuItems={primaryMenu}
              secondaryMenuItems={secondaryMenu}
              thirdMenuItems={thirdMenu}
              fourthMenuItems={fourthMenu}
              fifthMenuItems={fifthMenu}
              featureMenuItems={featureMenu}
              latestStories={allPosts}
              home={uri}
              menusLoading={menusLoading}
              latestLoading={latestLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isNavShown={isNavShown}
              setIsNavShown={setIsNavShown}
              isScrolled={isScrolled}
            />
            <HomepageSecondaryHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isGuidesNavShown={isGuidesNavShown}
              setIsGuidesNavShown={setIsGuidesNavShown}
              isScrolled={isScrolled}
            />
          </>
        )}
      </>
      <Main>
        <>
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
            <div
              className="component-videos w-full"
              style={{ backgroundColor: '#008080' }}
            >
              <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
                <FrontPageVideos />
              </div>
            </div>
            <HalfPage2 />
          </div>
          {/* <div id="snapStart" className="snap-start pt-16">
      <HomepageStories pinPosts={homepagePinPosts} />
    </div> */}
        </>
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
        desktopSlide1 {
          mediaItemUrl
        }
        desktopSlide2 {
          mediaItemUrl
        }
        desktopSlide3 {
          mediaItemUrl
        }
        mobileSlide1 {
          mediaItemUrl
        }
        mobileSlide2 {
          mediaItemUrl
        }
        mobileSlide3 {
          mediaItemUrl
        }
        video1 {
          mediaItemUrl
        }
        video2 {
          mediaItemUrl
        }
        video3 {
          mediaItemUrl
        }
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

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
