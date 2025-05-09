import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import {
  HomepageHeader,
  Main,
  Container,
  CategoryIndo,
  // CategoryInsights,
  FeaturedImage,
  SEO,
  FeatureWell,
  HomepageStories,
  HomepageSecondaryHeader,
  FrontPageLayout,
  Footer,
} from '../components'

import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'
// import { GetHomepagePinPosts } from '../queries/GetHomepagePinPosts'
import { GetIndoCategory } from '../queries/GetIndoCategory'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const { featuredImage, uri, seo } = props?.data?.page ?? {}

  const acfHomepageSlider = props?.data?.page?.acfHomepageSlider

  const { databaseId, asPreview } = props?.__TEMPLATE_VARIABLES__ ?? {}

  const [currentFeatureWell, setCurrentFeatureWell] = useState(null)
  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)
  const [isNewsNavShown, setIsNewsNavShown] = useState(false)
  const [isInsightNavShown, setIsInsightNavShown] = useState(false)
  const [isFeaturesNavShown, setIsFeaturesNavShown] = useState(false)
  const [isCityGuidesNavShown, setIsCityGuidesNavShown] = useState(false)
  const [isHonorsNavShown, setIsHonorsNavShown] = useState(false)
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

  // Stop scrolling pages when isNewsNavShown
  useEffect(() => {
    if (isNewsNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isNewsNavShown])

  // Stop scrolling pages when isInsightNavShown
  useEffect(() => {
    if (isInsightNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isInsightNavShown])

  // Stop scrolling pages when isFeaturesNavShown
  useEffect(() => {
    if (isFeaturesNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isFeaturesNavShown])

  // Stop scrolling pages when isCityGuidesNavShown
  useEffect(() => {
    if (isCityGuidesNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isCityGuidesNavShown])

  // Stop scrolling pages when isHonorsNavShown
  useEffect(() => {
    if (isHonorsNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isHonorsNavShown])

  const featureWell = [
    {
      type: acfHomepageSlider?.typeSlide1,
      videoSrc: acfHomepageSlider?.video1?.mediaItemUrl,
      desktopSrc: acfHomepageSlider?.desktopSlide1?.mediaItemUrl,
      mobileSrc: acfHomepageSlider?.mobileSlide1?.mediaItemUrl,
      url: acfHomepageSlider?.slideLink1,
      category: acfHomepageSlider?.slideCategory1,
      categoryLink: acfHomepageSlider?.slideCategoryLink1,
      caption: acfHomepageSlider?.slideCaption1,
      standFirst: acfHomepageSlider?.slideStandFirst1,
    },
    {
      type: acfHomepageSlider?.typeSlide2,
      videoSrc: acfHomepageSlider?.video2?.mediaItemUrl,
      desktopSrc: acfHomepageSlider?.desktopSlide2?.mediaItemUrl,
      mobileSrc: acfHomepageSlider?.mobileSlide2?.mediaItemUrl,
      url: acfHomepageSlider?.slideLink2,
      category: acfHomepageSlider?.slideCategory2,
      categoryLink: acfHomepageSlider?.slideCategoryLink2,
      caption: acfHomepageSlider?.slideCaption2,
      standFirst: acfHomepageSlider?.slideStandFirst2,
    },
    {
      type: acfHomepageSlider?.typeSlide3,
      videoSrc: acfHomepageSlider?.video3?.mediaItemUrl,
      desktopSrc: acfHomepageSlider?.desktopSlide3?.mediaItemUrl,
      mobileSrc: acfHomepageSlider?.mobileSlide3?.mediaItemUrl,
      url: acfHomepageSlider?.slideLink3,
      category: acfHomepageSlider?.slideCategory3,
      categoryLink: acfHomepageSlider?.slideCategoryLink3,
      caption: acfHomepageSlider?.slideCaption3,
      standFirst: acfHomepageSlider?.slideStandFirst3,
    },
  ]

  useEffect(() => {
    const filteredFeatureWell = featureWell.filter((item) => item.type !== null)

    // if (filteredFeatureWell.length > 0) {
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
      footerLocation: MENUS.FOOTER_LOCATION,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const {
    data: indoData,
    loading: indoLoading,
    error: indoError,
  } = useQuery(GetIndoCategory)

  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.footerMenuItems?.nodes ?? []
  const indoCategory =
    indoData?.category?.children?.edges?.map((edge) => edge.node) ?? []

  // // Get pin posts stories
  // const { data: pinPostsStories } = useQuery(GetHomepagePinPosts, {
  //   variables: {
  //     id: databaseId,
  //     asPreview: asPreview,
  //   },
  //   fetchPolicy: 'network-only',
  //   nextFetchPolicy: 'cache-and-network',
  // })

  // // State variable of homepage pin posts
  // const homepagePinPosts = pinPostsStories?.page?.homepagePinPosts ?? []

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
  // const editorials = latestStories?.editorials ?? []
  // const updates = latestStories?.updates ?? []

  const mainPosts = []
  // const mainEditorialPosts = []
  // const mainUpdatesPosts = []

  // loop through all the main categories posts
  posts?.edges?.forEach((post) => {
    mainPosts.push(post.node)
  })

  // // loop through all the main categories and their posts
  // editorials?.edges?.forEach((post) => {
  //   mainEditorialPosts.push(post.node)
  // })

  // // loop through all the main categories and their posts
  // updates?.edges?.forEach((post) => {
  //   mainUpdatesPosts.push(post.node)
  // })

  // sort posts by date
  const sortPostsByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA // Sort in descending order
  }

  // define mainCatPostCards
  const mainCatPosts = [
    ...(mainPosts != null ? mainPosts : []),
    // ...(mainEditorialPosts != null ? mainEditorialPosts : []),
    // ...(mainUpdatesPosts != null ? mainUpdatesPosts : []),
  ]

  // sortByDate mainCat & childCat Posts
  const allPosts = mainCatPosts.sort(sortPostsByDate)

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      {/* <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      /> */}
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
        // rcaDatabaseId={rcaDatabaseId}
        // rcaUri={rcaUri}
        isGuidesNavShown={isGuidesNavShown}
        setIsGuidesNavShown={setIsGuidesNavShown}
        isNewsNavShown={isNewsNavShown}
        setIsNewsNavShown={setIsNewsNavShown}
        isInsightNavShown={isInsightNavShown}
        setIsInsightNavShown={setIsInsightNavShown}
        isFeaturesNavShown={isFeaturesNavShown}
        setIsFeaturesNavShown={setIsFeaturesNavShown}
        isCityGuidesNavShown={isCityGuidesNavShown}
        setIsCityGuidesNavShown={setIsCityGuidesNavShown}
        isHonorsNavShown={isHonorsNavShown}
        setIsHonorsNavShown={setIsHonorsNavShown}
        // isRCANavShown={isRCANavShown}
        // setIsRCANavShown={setIsRCANavShown}
        isScrolled={isScrolled}
      />

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
            {!indoLoading && !indoError && indoCategory?.[0] && (
              <div>
                <CategoryIndo data={indoCategory} />
              </div>
            )}

            <div className="mx-auto max-w-7xl px-4">
              <FrontPageLayout />
            </div>
            {/* <div className="mx-auto max-w-7xl px-4">
              <CategoryInsights />
            </div> */}

            {/* <div id="snapStart" className="snap-start pt-16">
              <HomepageStories pinPosts={homepagePinPosts} />
            </div> */}
          </div>
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
