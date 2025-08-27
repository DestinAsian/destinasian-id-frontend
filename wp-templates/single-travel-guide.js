import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeaderTravelGuide } from '../queries/GetSecondaryHeaderTravelGuide'
import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'
import SEO from '../components/SEO/SEO'
import Footer from '../components/Footer/Footer'
import Main from '../components/Main/Main'
import Container from '../components/Container/Container'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import EntryMoreReviews from '../components/EntryMoreReviews/EntryMoreReviews'
import MoreReviews from '../components/MoreReviews/MoreReviews'
import PartnerContent from '../components/PartnerContent/PartnerContent'
import PasswordProtected from '../components/PasswordProtected/PasswordProtected'
import SingleEntryHeaderTravelGuide from '../components/SingleEntryHeaderTravelGuide/SingleEntryHeaderTravelGuide'
import ContentWrapperTravelGuide from '../components/ContentWrapperTravelGuide/ContentWrapperTravelGuide'
import SingleSliderTravelGuide from '../components/SingleSliderTravelGuide/SingleSliderTravelGuide'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'


const MastHeadTopGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadTop/MastHeadTopGuides'),
)
const MastHeadTopMobileSingleGuides = dynamic(() =>
  import(
    '../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileSingleGuides'
  ),
)
const MastHeadBottomGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'),
)
const MastHeadBottomMobileGuides = dynamic(() =>
  import(
    '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'
  ),
)
export default function SingleTravelGuide(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for stored password in cookies on mount
  useEffect(() => {
    const storedPassword = Cookies.get('travelGuidePassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.travelGuide?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.travelGuide?.passwordProtected?.password])

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const {
    title,
    content,
    featuredImage,
    databaseId,
    acfPostSlider,
    seo,
    uri,
    passwordProtected,
    author,
    date,
  } = props?.data?.travelGuide
  const categories = props?.data?.travelGuide.categories?.edges ?? []

  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

  // desktop
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      setIsMobile(width <= 768)
    }

    handleResize() // cek saat mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  let catVariable = {
    first: 1,
    id: databaseId,
  }

  // Get Category
  const { data, loading } = useQuery(GetSecondaryHeaderTravelGuide, {
    variables: catVariable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Get menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 10,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
      // featureHeaderLocation: MENUS.FEATURE_LOCATION,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Header Menu
  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.featureHeaderMenuItems?.nodes ?? []

  // Logic for Guides Category
  // Footer Menu

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

  const mainPosts = []
  // loop through all the main categories posts
  posts?.edges?.forEach((post) => {
    mainPosts.push(post.node)
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

  const images = [1, 2, 3, 4, 5].map((n) => [
    acfPostSlider?.[`slide${n}`]?.mediaItemUrl || null,
    acfPostSlider?.[`slideCaption${n}`] || null,
  ])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('travelGuidePassword', enteredPassword, { expires: 1 })
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  const category = categories?.[0]?.node

  if (passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main
        className={`${rubik_mono_one.variable} ${rubik.variable}`}
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

  const firstSlider = images[0]?.map((image) => {
    return image
  })

  return (
    <main className={`${rubik_mono_one.variable}`}>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />
      {/* Header */}
      {isDesktop ? (
        <>
          <SingleHeader
            title={props?.data?.generalSettings?.title}
            description={props?.data?.generalSettings?.description}
            primaryMenuItems={menusData?.headerMenuItems?.nodes || []}
            secondaryMenuItems={menusData?.secondHeaderMenuItems?.nodes || []}
            thirdMenuItems={menusData?.thirdHeaderMenuItems?.nodes || []}
            fourthMenuItems={menusData?.fourthHeaderMenuItems?.nodes || []}
            fifthMenuItems={menusData?.fifthHeaderMenuItems?.nodes || []}
            featureMenuItems={menusData?.featureHeaderMenuItems?.nodes || []}
            latestStories={allPosts}
            menusLoading={menusLoading}
            latestLoading={!latestStories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
          />
          <SingleDesktopHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
            isScrolled={isScrolled}
          />
        </>
      ) : (
        <>
          <SingleHeader
            title={props?.data?.generalSettings?.title}
            description={props?.data?.generalSettings?.description}
            primaryMenuItems={menusData?.headerMenuItems?.nodes || []}
            secondaryMenuItems={menusData?.secondHeaderMenuItems?.nodes || []}
            thirdMenuItems={menusData?.thirdHeaderMenuItems?.nodes || []}
            fourthMenuItems={menusData?.fourthHeaderMenuItems?.nodes || []}
            fifthMenuItems={menusData?.fifthHeaderMenuItems?.nodes || []}
            featureMenuItems={menusData?.featureHeaderMenuItems?.nodes || []}
            latestStories={allPosts}
            menusLoading={menusLoading}
            latestLoading={!latestStories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
          />
          <SecondaryHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
            isScrolled={isScrolled}
          />
        </>
      )}
      <Main>
        <div>
          {isMobile ? <MastHeadTopMobileSingleGuides /> : <MastHeadTopGuides />}
        </div>
        {firstSlider[0] !== null && <SingleSliderTravelGuide images={images} />}
        <SingleEntryHeaderTravelGuide
          title={title}
          categoryUri={categories?.[0]?.node?.uri}
          parentCategory={categories?.[0]?.node?.parent?.node?.name}
          categoryName={categories?.[0]?.node?.name}
          author={author?.node?.name}
          date={date}
        />
        <Container>
          <ContentWrapperTravelGuide content={content} />
        </Container>
        <div>
          {isMobile ? <MastHeadBottomMobileGuides /> : <MastHeadBottomGuides />}
        </div>

        <EntryMoreReviews
          parentName={categories?.[0]?.node?.parent?.node?.name}
          categoryName={categories?.[0]?.node?.name}
          categoryUri={categories?.[0]?.node?.uri}
        />
        <MoreReviews databaseId={databaseId} />
        <PartnerContent
          parentName={categories?.[0]?.node?.parent?.node?.name}
        />
      </Main>

      <Footer />
    </main>
  )
}

SingleTravelGuide.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GettravelGuide($databaseId: ID!, $asPreview: Boolean = false) {
    travelGuide(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      databaseId
      content
      date
      passwordProtected {
        onOff
        password
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
      guide_book_now {
        fieldGroupName
        guideName
        linkBookNow
        linkLocation
        guideLocation
      }
      categories(where: { childless: true }) {
        edges {
          node {
            name
            uri
            parent {
              node {
                name
                uri
                countryCode {
                  countryCode
                }
                children {
                  edges {
                    node {
                      name
                      uri
                    }
                  }
                }
              }
            }
            children {
              edges {
                node {
                  name
                  uri
                }
              }
            }
          }
        }
      }
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
        slideCaption1
        slideCaption3
        slideCaption2
        slideCaption4
        slideCaption5
      }
      ...FeaturedImageFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

SingleTravelGuide.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
