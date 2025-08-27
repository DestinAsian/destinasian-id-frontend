import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import { GetMenus } from '../queries/GetMenus'
import SingleLTEntryHeader from '../components/SingleLuxuryTravel/SingleLTEntryHeader'
import ContentWrapperLuxuryTravel from '../components/ContentWrapperLuxuryTravel/ContentWrapperLuxuryTravel'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import SEO from '../components/SEO/SEO'
import Footer from '../components/Footer/Footer'
import Main from '../components/Main/Main'
import SingleSlider from '../components/SingleSlider/SingleSlider'
import SingleLTContainer from '../components/SingleLuxuryTravel/SingleLTContainer'
import PasswordProtected from '../components/PasswordProtected/PasswordProtected'
import { rubik, rubik_mono_one } from '../styles/fonts/fonts'
import Cookies from 'js-cookie'

// Dynamic Imports (iklan/ad components)
import dynamic from 'next/dynamic'
const MastHeadTopGuides = dynamic(() => import('../components/AdUnit/MastHeadTop/MastHeadTopGuides'))
const MastHeadTopMobileSingleGuides = dynamic(() => import('../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileSingleGuides'))
const MastHeadBottomGuides = dynamic(() => import('../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'))
const MastHeadBottomMobileGuides = dynamic(() => import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'))


export default function SingleLuxuryTravel(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for stored password in cookies on mount
  useEffect(() => {
    const storedPassword = Cookies.get('luxuryTravelPassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.luxuryTravel?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.luxuryTravel?.passwordProtected?.password])

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const {
    title,
    databaseId,
    content,
    parent,
    featuredImage,
    acfPostSlider,
    seo,
    uri,
    passwordProtected,
  } = props?.data?.luxuryTravel

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (searchQuery !== '') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [searchQuery])

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

  const images = [
    [
      acfPostSlider.slide1 != null ? acfPostSlider.slide1.mediaItemUrl : null,
      acfPostSlider.slideCaption1 != null ? acfPostSlider.slideCaption1 : null,
    ],
    [
      acfPostSlider.slide2 != null ? acfPostSlider.slide2.mediaItemUrl : null,
      acfPostSlider.slideCaption2 != null ? acfPostSlider.slideCaption2 : null,
    ],
    [
      acfPostSlider.slide3 != null ? acfPostSlider.slide3.mediaItemUrl : null,
      acfPostSlider.slideCaption3 != null ? acfPostSlider.slideCaption3 : null,
    ],
    [
      acfPostSlider.slide4 != null ? acfPostSlider.slide4.mediaItemUrl : null,
      acfPostSlider.slideCaption4 != null ? acfPostSlider.slideCaption4 : null,
    ],
    [
      acfPostSlider.slide5 != null ? acfPostSlider.slide5.mediaItemUrl : null,
      acfPostSlider.slideCaption5 != null ? acfPostSlider.slideCaption5 : null,
    ],
  ]

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('luxuryTravelPassword', enteredPassword, { expires: 1 }) // Set cookie to expire in 1 day
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

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

  return (
    <main
      className={` ${rubik_mono_one.variable} ${rubik.variable}`}
    >
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />
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
            menusLoading={menusLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
          />
          <SingleDesktopHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
            menusLoading={menusLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
          />
          <SecondaryHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isScrolled={isScrolled}
          />
        </>
      )}
      <Main>
        <>
          <div>
            {isMobile ? (
              <MastHeadTopMobileSingleGuides />
            ) : (
              <MastHeadTopGuides />
            )}
          </div>
          <SingleLTContainer>
            <SingleSlider images={images} />
            <SingleLTEntryHeader title={title} />
            <ContentWrapperLuxuryTravel content={content} />
            <div>
              {isMobile ? (
                <MastHeadBottomMobileGuides />
              ) : (
                <MastHeadBottomGuides />
              )}
            </div>
          </SingleLTContainer>
        </>
      </Main>
      <Footer />
    </main>
  )
}

SingleLuxuryTravel.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    luxuryTravel(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      databaseId
      content
      date
      passwordProtected {
        onOff
        password
      }
      parent {
        node {
          ... on LuxuryTravel {
            title
          }
        }
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
        slideCaption2
        slideCaption3
        slideCaption4
        slideCaption5
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

SingleLuxuryTravel.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
