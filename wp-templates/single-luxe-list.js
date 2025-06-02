import React, { useEffect, useState, useRef } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import dynamic from 'next/dynamic'

const Main = dynamic(() => import('../components/Main/Main'))
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
const SEO = dynamic(() => import('../components/SEO/SEO'))
const SingleLLContainer = dynamic(() => import('../components/SingleLLContainer/SingleLLContainer'))
const SingleLLFeaturedImage = dynamic(() => import('../components/SingleLLFeaturedImage/SingleLLFeaturedImage'))
const ContentWrapperLL = dynamic(() => import('../components/ContentWrapperLL/ContentWrapperLL'))
const LLHeader = dynamic(() => import('../components/LLHeader/LLHeader'))
const LLSecondaryHeader= dynamic(() => import('../components/LLHeader/LLSecondaryHeader/LLSecondaryHeader'))
const PasswordProtected = dynamic(() => import('../components/PasswordProtected/PasswordProtected'))
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'
import Cookies from 'js-cookie'
import { GetLatestRCA } from '../queries/GetLatestRCA'

export default function singleLuxeList(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for stored password in cookies on mount
  useEffect(() => {
    const storedPassword = Cookies.get('luxeListPassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.luxeList?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.luxeList?.passwordProtected?.password])

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const {
    title,
    content,
    featuredImage,
    acfPostSlider,
    parent,
    seo,
    uri,
    databaseId,
    luxeListLogo,
    categories,
    passwordProtected,
  } = props?.data?.luxeList

  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)
  const [isLLNavShown, setIsLLNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isRCANavShown, setIsRCANavShown] = useState(false)

  // Slider Autoplay state
  const sliderLL = useRef(null)
  const [isAutoplayRunning, setIsAutoplayRunning] = useState(true)

  const toggleAutoplay = () => {
    const swiperInstance = sliderLL?.current?.swiper
    if (swiperInstance) {
      if (isAutoplayRunning) {
        swiperInstance.autoplay?.stop()
      } else {
        swiperInstance.autoplay?.start()
      }
      setIsAutoplayRunning(!isAutoplayRunning)
    }
  }

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

  // Latest Travel Stories
  const latestPosts = latestStories?.posts ?? []
  const latestEditorials = latestStories?.editorials ?? []
  const latestUpdates = latestStories?.updates ?? []

  const latestMainPosts = []
  const latestMainEditorialPosts = []
  const latestMainUpdatesPosts = []

  // loop through all the latest categories posts
  latestPosts?.edges?.forEach((post) => {
    latestMainPosts.push(post.node)
  })

  // loop through all the latest categories and their posts
  latestEditorials?.edges?.forEach((post) => {
    latestMainEditorialPosts.push(post.node)
  })

  // loop through all the latest categories and their posts
  latestUpdates?.edges?.forEach((post) => {
    latestMainUpdatesPosts.push(post.node)
  })

  // define latestCatPostCards
  const latestMainCatPosts = [
    ...(latestMainPosts != null ? latestMainPosts : []),
    ...(latestMainEditorialPosts != null ? latestMainEditorialPosts : []),
    ...(latestMainUpdatesPosts != null ? latestMainUpdatesPosts : []),
  ]

  // sort posts by date
  const sortPostsByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA // Sort in descending order
  }

  // sortByDate latestCat & childCat Posts
  const latestAllPosts = latestMainCatPosts.sort(sortPostsByDate)

  const images = [
    acfPostSlider.slide1 != null ? acfPostSlider.slide1.mediaItemUrl : null,
    acfPostSlider.slide2 != null ? acfPostSlider.slide2.mediaItemUrl : null,
    acfPostSlider.slide3 != null ? acfPostSlider.slide3.mediaItemUrl : null,
    acfPostSlider.slide4 != null ? acfPostSlider.slide4.mediaItemUrl : null,
    acfPostSlider.slide5 != null ? acfPostSlider.slide5.mediaItemUrl : null,
  ]

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('luxeListPassword', enteredPassword, { expires: 1 }) // Set cookie to expire in 1 day
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  if (passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main
        className={`${eb_garamond.variable} ${rubik_mono_one.variable} ${rubik.variable}`}
      >
        <form onSubmit={handlePasswordSubmit}>
          <PasswordProtected
            enteredPassword={enteredPassword}
            setEnteredPassword={setEnteredPassword}
            title={seo?.title}
            description={seo?.metaDesc}
            imageUrl={featuredImage?.node?.sourceUrl}
            url={uri}
            focuskw={seo?.focuskw}
          />
        </form>
      </main>
    )
  }

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />
      {/* Year pages */}
      {/* {parent == null && (
        <LLHeader
          title={siteTitle}
          description={siteDescription}
          primaryMenuItems={primaryMenu}
          secondaryMenuItems={secondaryMenu}
          thirdMenuItems={thirdMenu}
          fourthMenuItems={fourthMenu}
          fifthMenuItems={fifthMenu}
          featureMenuItems={featureMenu}
          latestStories={latestAllPosts}
          menusLoading={menusLoading}
          latestLoading={latestLoading}
        />
      )}
      {parent == null && (
        <Main>
          <>
            <SingleLLFrontPageContainer>
              // {'countries'} 
              // All posts sorted by mainPosts & date 
              <SingleLLFrontPageFeaturedImage
                mainLogo={luxeListLogo?.mainLogo}
                secondaryLogo={luxeListLogo?.secondaryLogo}
                databaseId={databaseId}
                uri={uri}
              />
              <ContentWrapperLLFrontPage
                content={content}
                databaseId={databaseId}
                parentTitle={title}
              />
            </SingleLLFrontPageContainer>
          </>
        </Main>
      )} */}
      <LLHeader
        title={siteTitle}
        description={siteDescription}
        primaryMenuItems={primaryMenu}
        secondaryMenuItems={secondaryMenu}
        thirdMenuItems={thirdMenu}
        fourthMenuItems={fourthMenu}
        fifthMenuItems={fifthMenu}
        featureMenuItems={featureMenu}
        latestStories={latestAllPosts}
        menusLoading={menusLoading}
        latestLoading={latestLoading}
        isNavShown={isNavShown}
        setIsNavShown={setIsNavShown}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isScrolled={isScrolled}
      />
      <LLSecondaryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        rcaDatabaseId={rcaDatabaseId}
        rcaUri={rcaUri}
        isGuidesNavShown={isGuidesNavShown}
        setIsGuidesNavShown={setIsGuidesNavShown}
        isRCANavShown={isRCANavShown}
        setIsRCANavShown={setIsRCANavShown}
        // isScrolled={isScrolled}
        isAutoplayRunning={isAutoplayRunning}
        toggleAutoplay={toggleAutoplay}
      />
      <Main>
        <>
          {/* {'hotel'} */}
          <SingleLLContainer>
            <div className="sm:fixed sm:left-[50vw] sm:flex sm:w-[50vw] sm:flex-col">
              <div className="w-full sm:relative sm:flex sm:h-[100vh] sm:flex-row-reverse sm:flex-nowrap sm:overflow-y-auto">
                {/* First wrapper */}
                <SingleLLFeaturedImage
                  mainLogo={
                    parent != null
                      ? parent?.node?.luxeListLogo?.mainLogo
                      : luxeListLogo?.mainLogo
                  }
                  secondaryLogo={
                    parent != null
                      ? parent?.node?.luxeListLogo?.secondaryLogo
                      : luxeListLogo?.secondaryLogo
                  }
                  databaseId={
                    parent != null ? parent?.node?.databaseId : databaseId
                  }
                  uri={parent != null ? parent?.node?.uri : uri}
                  isLLNavShown={isLLNavShown}
                  setIsLLNavShown={setIsLLNavShown}
                />
                {/* Second wrapper */}
                <div className="w-full sm:relative sm:pt-20">
                  <ContentWrapperLL
                    router={props?.router}
                    title={title}
                    category={categories?.edges[0]?.node?.name}
                    content={content}
                    images={images}
                    mainLogo={
                      parent != null
                        ? parent?.node?.luxeListLogo?.mainLogo
                        : luxeListLogo?.mainLogo
                    }
                    databaseId={databaseId}
                    isNavShown={isNavShown}
                    isLLNavShown={isLLNavShown}
                    setIsLLNavShown={setIsLLNavShown}
                    isAutoplayRunning={isAutoplayRunning}
                    setIsAutoplayRunning={setIsAutoplayRunning}
                    sliderLL={sliderLL}
                    toggleAutoplay={toggleAutoplay}
                  />
                </div>
              </div>
            </div>
          </SingleLLContainer>
        </>
      </Main>
      {/* <Footer /> */}
    </main>
  )
}

singleLuxeList.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    luxeList(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      databaseId
      passwordProtected {
        onOff
        password
      }
      ...FeaturedImageFragment
      luxeListLogo {
        mainLogo {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        secondaryLogo {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      author {
        node {
          name
        }
      }
      seo {
        title
        metaDesc
        focuskw
      }
      uri
      acfPostSlider {
        slide1 {
          mediaItemUrl
        }
        slide2 {
          mediaItemUrl
        }
        slide3 {
          mediaItemUrl
        }
        slide4 {
          mediaItemUrl
        }
        slide5 {
          mediaItemUrl
        }
      }
      ...FeaturedImageFragment
      parent {
        node {
          ... on LuxeList {
            uri
            databaseId
            luxeListLogo {
              mainLogo {
                id
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
              secondaryLogo {
                id
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

singleLuxeList.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
