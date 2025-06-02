import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../components/Header/Header'))
const Main = dynamic(() => import('../components/Main/Main'))
const Container = dynamic(() => import('../components/Container/Container'))
const EntryHeader = dynamic(() => import('../components/EntryHeader/EntryHeader'))
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
const SEO = dynamic(() => import('../components/SEO/SEO'))
const SingleHCFeaturedImage = dynamic(() => import('../components/SingleHCFeaturedImage/SingleHCFeaturedImage'))
const SingleHCEntryHeader = dynamic(() => import('../components/SingleHCEntryHeader/SingleHCEntryHeader'))
const SingleHCContainer = dynamic(() => import('../components/SingleHCContainer/SingleHCContainer'))
const ContentWrapperHCFrontPage = dynamic(() => import('../components/ContentWrapperHCFrontPage/ContentWrapperHCFrontPage'))
const ContentWrapperHC = dynamic(() => import('../components/ContentWrapperHC/ContentWrapperHC'))
const PasswordProtected = dynamic(() => import('../components/PasswordProtected/PasswordProtected'))
const SecondaryHeader = dynamic(() => import('../components/Header/SecondaryHeader/SecondaryHeader'));
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'
import Cookies from 'js-cookie'
import { GetLatestRCA } from '../queries/GetLatestRCA'

export default function SingleHonorsCircle(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for stored password in cookies on mount
  useEffect(() => {
    const storedPassword = Cookies.get('honorsCirclePassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.honorsCircle?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.honorsCircle?.passwordProtected?.password])

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const {
    title,
    content,
    featuredImage,
    acfHCSlider,
    parent,
    hcLocation,
    hcCaption,
    seo,
    uri,
    passwordProtected,
  } = props?.data?.honorsCircle

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
    acfHCSlider.slide1 != null ? acfHCSlider.slide1.mediaItemUrl : null,
    acfHCSlider.slide2 != null ? acfHCSlider.slide2.mediaItemUrl : null,
    acfHCSlider.slide3 != null ? acfHCSlider.slide3.mediaItemUrl : null,
    acfHCSlider.slide4 != null ? acfHCSlider.slide4.mediaItemUrl : null,
    acfHCSlider.slide5 != null ? acfHCSlider.slide5.mediaItemUrl : null,
  ]

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('honorsCirclePassword', enteredPassword, { expires: 1 }) // Set cookie to expire in 1 day
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
      <Header
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isNavShown={isNavShown}
        setIsNavShown={setIsNavShown}
        isScrolled={isScrolled}
      />
      <SecondaryHeader
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
      {parent == null && (
        <Main>
          <>
            <Container>
              {/* {'countries'} */}
              {/* All posts sorted by mainPosts & date */}
              <EntryHeader
                hcCountryTitle={title}
                hcCaption={hcCaption?.hcCaption}
              />
              <ContentWrapperHCFrontPage content={content} />
            </Container>
          </>
        </Main>
      )}
      {parent != null && (
        <Main>
          <>
            <SingleHCContainer>
              {/* {'hotel'} */}
              <SingleHCFeaturedImage image={featuredImage?.node} />
              <SingleHCEntryHeader
                title={title}
                locationLabel={hcLocation?.hcLocation}
              />
              {/* <SingleHCSlider images={images} /> */}
              <ContentWrapperHC content={content} images={images} />
            </SingleHCContainer>
          </>
        </Main>
      )}
      {/* <Footer /> */}
    </main>
  )
}

SingleHonorsCircle.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    honorsCircle(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      passwordProtected {
        onOff
        password
      }
      ...FeaturedImageFragment
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
      hcLocation {
        hcLocation
      }
      hcCaption {
        hcCaption
      }
      acfHCSlider {
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
      children {
        edges {
          node {
            ... on HonorsCircle {
              id
              title
              content
              uri
              ...FeaturedImageFragment
            }
          }
        }
      }
      parent {
        node {
          ... on HonorsCircle {
            title
            content
            date
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

SingleHonorsCircle.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
