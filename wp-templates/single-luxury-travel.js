import React, { useEffect, useMemo, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'

import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { GetMenus } from '../queries/GetMenus'
import { open_sans } from '../styles/fonts/fonts'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import SEO from '../components/SEO/SEO'
import Main from '../components/Main/Main'
import Footer from '../components/Footer/Footer'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import SingleSlider from '../components/SingleSlider/SingleSlider'
import PasswordProtected from '../components/PasswordProtected/PasswordProtected'

import SingleLTEntryHeader from '../components/SingleLuxuryTravel/SingleLTEntryHeader'
import ContentWrapperLuxuryTravel from '../components/ContentWrapperLuxuryTravel/ContentWrapperLuxuryTravel'
import SingleLTContainer from '../components/SingleLuxuryTravel/SingleLTContainer'

/* =====================
   ADS (LAZY)
===================== */
const MastHeadTopGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadTop/MastHeadTopGuides'),
)
const MastHeadTopMobileSingleGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileSingleGuides'),
)
const MastHeadBottomGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'),
)
const MastHeadBottomMobileGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'),
)

export default function SingleLuxuryTravel({ data, loading }) {
  if (loading) return <>Loading...</>

  const luxury = data?.luxuryTravel
  const site = data?.generalSettings

  /* =====================
     PASSWORD
  ===================== */
  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!luxury?.passwordProtected?.onOff) return

    const stored = Cookies.get('luxuryTravelPassword')
    if (stored === luxury.passwordProtected.password) {
      setIsAuthenticated(true)
    }
  }, [luxury?.passwordProtected])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === luxury?.passwordProtected?.password) {
      Cookies.set('luxuryTravelPassword', enteredPassword, { expires: 1 })
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  if (luxury?.passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main className={open_sans.variable}>
        <form onSubmit={handlePasswordSubmit}>
          <PasswordProtected
            enteredPassword={enteredPassword}
            setEnteredPassword={setEnteredPassword}
            title={luxury?.seo?.title}
            description={luxury?.seo?.metaDesc}
            imageUrl={luxury?.featuredImage?.node?.sourceUrl}
            url={luxury?.uri}
            focuskw={luxury?.seo?.focuskw}
          />
        </form>
      </main>
    )
  }

  /* =====================
     UI STATES
  ===================== */
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // resize
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setIsDesktop(w >= 1024)
      setIsMobile(w <= 768)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // body lock
  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown ? 'hidden' : ''
  }, [searchQuery, isNavShown])

  /* =====================
     MENUS (APOLLO)
  ===================== */
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 10,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  /* =====================
     SLIDER IMAGES (SAFE)
  ===================== */
  const images = useMemo(() => {
    const s = luxury?.acfPostSlider
    if (!s) return []

    return [
      [s.slide1?.mediaItemUrl, s.slideCaption1],
      [s.slide2?.mediaItemUrl, s.slideCaption2],
      [s.slide3?.mediaItemUrl, s.slideCaption3],
      [s.slide4?.mediaItemUrl, s.slideCaption4],
      [s.slide5?.mediaItemUrl, s.slideCaption5],
    ].filter(([url]) => Boolean(url))
  }, [luxury?.acfPostSlider])

  const category = luxury?.categories?.edges?.[0]?.node

  return (
    <main className={open_sans.variable}>
      <SEO
        title={luxury?.seo?.title}
        description={luxury?.seo?.metaDesc}
        imageUrl={luxury?.featuredImage?.node?.sourceUrl}
        url={luxury?.uri}
        focuskw={luxury?.seo?.focuskw}
      />

      <SingleHeader
        title={site?.title}
        description={site?.description}
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

      {isDesktop ? (
        <SingleDesktopHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGuidesNavShown={isGuidesNavShown}
          setIsGuidesNavShown={setIsGuidesNavShown}
          isScrolled={isScrolled}
        />
      ) : (
        <SecondaryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGuidesNavShown={isGuidesNavShown}
          setIsGuidesNavShown={setIsGuidesNavShown}
          isScrolled={isScrolled}
        />
      )}

      <Main>
        {isMobile ? (
          <MastHeadTopMobileSingleGuides />
        ) : (
          <MastHeadTopGuides />
        )}

        <SingleLTContainer>
          {images.length > 0 && <SingleSlider images={images} />}

          <SingleLTEntryHeader
            title={luxury?.title}
            categoryUri={category?.uri}
            parentCategory={category?.parent?.node?.name}
            categoryName={category?.name}
            author={luxury?.author?.node?.name}
            date={luxury?.date}
          />

          <ContentWrapperLuxuryTravel content={luxury?.content} />

          {isMobile ? (
            <MastHeadBottomMobileGuides />
          ) : (
            <MastHeadBottomGuides />
          )}
        </SingleLTContainer>
      </Main>

      <Footer />
    </main>
  )
}

/* =====================
   GRAPHQL
===================== */
SingleLuxuryTravel.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    luxuryTravel(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      id
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
            id
            title
          }
        }
      }
      ...FeaturedImageFragment
      author {
        node {
          id
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
        slide1 { mediaItemUrl }
        slide2 { mediaItemUrl }
        slide3 { mediaItemUrl }
        slide4 { mediaItemUrl }
        slide5 { mediaItemUrl }
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

SingleLuxuryTravel.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})
