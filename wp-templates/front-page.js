import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import {
  HomepageHeader,
  Main,
  Container,
  FeaturedImage,
  SEO,
  FeatureWell,
  HomepageStories,
  HomepageSecondaryHeader,
} from '../components'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'
import { GetHomepagePinPosts } from '../queries/GetHomepagePinPosts'
import { GetLatestRCA } from '../queries/GetLatestRCA'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const { featuredImage, acfHomepageSlider, uri, seo } = props?.data?.page ?? []
  const { databaseId, asPreview } = props?.__TEMPLATE_VARIABLES__ ?? []

  const [currentFeatureWell, setCurrentFeatureWell] = useState(null)
  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isRCANavShown, setIsRCANavShown] = useState(false)

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

  // Stop scrolling pages when isRCANavShown
  useEffect(() => {
    if (isRCANavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isRCANavShown])

  // Stop scrolling pages when isGuidesNavShown
  useEffect(() => {
    if (isGuidesNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isGuidesNavShown])

  const { data: rcaData } = useQuery(GetLatestRCA, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const [latestRCA, setLatestRCA] = useState(null)

  useEffect(() => {
    if (rcaData?.readersChoiceAwards?.edges) {
      // Find the first RCA where parent is null
      const filteredRCA = rcaData.readersChoiceAwards.edges.find(
        (edge) => !edge.node.parent,
      )?.node
      setLatestRCA(filteredRCA || null)
    }
  }, [rcaData]) // Runs whenever rcaData changes

  const {
    // title: rcaTitle,
    databaseId: rcaDatabaseId,
    uri: rcaUri,
  } = latestRCA ?? []

  const featureWell = [
    {
      type: acfHomepageSlider?.typeSlide1,
      videoSrc: acfHomepageSlider?.video1?.mediaItemUrl,
      desktopSrc: acfHomepageSlider?.desktopSlide2?.mediaItemUrl,
      mobileSrc: acfHomepageSlider?.mobileSlide2?.mediaItemUrl,
      url: acfHomepageSlider?.slideLink1,
      category: acfHomepageSlider?.slideCategory1,
      categoryLink: acfHomepageSlider?.slideCategoryLink1,
      caption: acfHomepageSlider?.slideCaption1,
      standFirst: acfHomepageSlider?.slideStandFirst1,
    },
    {
      type: acfHomepageSlider?.typeSlide2,
      desktopSrc: acfHomepageSlider?.desktopSlide2?.mediaItemUrl,
      mobileSrc: acfHomepageSlider?.mobileSlide2?.mediaItemUrl,
      videoSrc: acfHomepageSlider?.video2?.mediaItemUrl,
      url: acfHomepageSlider?.slideLink2,
      category: acfHomepageSlider?.slideCategory2,
      categoryLink: acfHomepageSlider?.slideCategoryLink2,
      caption: acfHomepageSlider?.slideCaption2,
      standFirst: acfHomepageSlider?.slideStandFirst2,
    },
    {
      type: acfHomepageSlider?.typeSlide3,
      desktopSrc: acfHomepageSlider?.desktopSlide3?.mediaItemUrl,
      mobileSrc: acfHomepageSlider?.mobileSlide3?.mediaItemUrl,
      videoSrc: acfHomepageSlider?.video3?.mediaItemUrl,
      url: acfHomepageSlider?.slideLink3,
      category: acfHomepageSlider?.slideCategory3,
      categoryLink: acfHomepageSlider?.slideCategoryLink3,
      caption: acfHomepageSlider?.slideCaption3,
      standFirst: acfHomepageSlider?.slideStandFirst3,
    },
  ]

  useEffect(() => {
    const filteredFeatureWell = featureWell.filter((item) => item.type !== null)

    if (filteredFeatureWell.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredFeatureWell.length)
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
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.featureHeaderMenuItems?.nodes ?? []

  // Get pin posts stories
  const { data: pinPostsStories } = useQuery(GetHomepagePinPosts, {
    variables: {
      id: databaseId,
      asPreview: asPreview,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
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
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  const posts = latestStories?.posts ?? []
  const editorials = latestStories?.editorials ?? []
  const updates = latestStories?.updates ?? []

  const mainPosts = []
  const mainEditorialPosts = []
  const mainUpdatesPosts = []

  // loop through all the main categories posts
  posts?.edges?.forEach((post) => {
    mainPosts.push(post.node)
  })

  // loop through all the main categories and their posts
  editorials?.edges?.forEach((post) => {
    mainEditorialPosts.push(post.node)
  })

  // loop through all the main categories and their posts
  updates?.edges?.forEach((post) => {
    mainUpdatesPosts.push(post.node)
  })

  // sort posts by date
  const sortPostsByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA // Sort in descending order
  }

  // define mainCatPostCards
  const mainCatPosts = [
    ...(mainPosts != null ? mainPosts : []),
    ...(mainEditorialPosts != null ? mainEditorialPosts : []),
    ...(mainUpdatesPosts != null ? mainUpdatesPosts : []),
  ]

  // sortByDate mainCat & childCat Posts
  const allPosts = mainCatPosts.sort(sortPostsByDate)

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />
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
        // home={uri}
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
        rcaDatabaseId={rcaDatabaseId}
        rcaUri={rcaUri}
        isGuidesNavShown={isGuidesNavShown}
        setIsGuidesNavShown={setIsGuidesNavShown}
        isRCANavShown={isRCANavShown}
        setIsRCANavShown={setIsRCANavShown}
        isScrolled={isScrolled}
      />
      <Main>
        <>
          {/* <NavigationHeader menuItems={navigationMenu}/> */}
          <div className="snap-y snap-mandatory">
            <div className="snap-start">
              {currentFeatureWell && (
                <Container>
                  <FeatureWell featureWells={featureWell} />
                </Container>
              )}
            </div>
            <div id="snapStart" className="snap-start pt-16">
              {/* All posts sorted by pinPosts then mainPosts & date */}
              <HomepageStories pinPosts={homepagePinPosts} />
            </div>
          </div>
        </>
      </Main>
      {/* <Footer /> */}
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
