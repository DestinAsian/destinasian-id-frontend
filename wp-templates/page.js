// wp-template/page.js
import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'

import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { PageFragment } from '../fragments/PageFragment' // ✅ pakai PageFragment tunggal

// Komponen
import Header from '../components/Header/Header'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import SecondaryDesktopHeaderPage from '../components/Header/SecondaryDesktopHeaderPage/SecondaryDesktopHeaderPage'
import Footer from '../components/Footer/Footer'
import Main from '../components/Main/Main'
import Container from '../components/Container/Container'
import ContentWrapperPage from '../components/ContentWrapperPage/ContentWrapperPage'
import EntryHeader from '../components/EntryHeader/EntryHeader'
import SEO from '../components/SEO/SEO'
import PasswordProtected from '../components/PasswordProtected/PasswordProtected'

// Queries tambahan
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'


// Ads (lazy)
const MastHeadTop = dynamic(() =>
  import('../components/AdUnit/MastHeadTop/MastHeadTop')
)
const MastHeadTopMobile = dynamic(() =>
  import('../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile')
)
const MastHeadBottom = dynamic(() =>
  import('../components/AdUnit/MastHeadBottom/MastHeadBottom')
)
const MastHeadBottomMobile = dynamic(() =>
  import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile')
)

export default function Component(props) {
  if (props.loading) return <>Loading...</>

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { generalSettings, page } = props?.data || {}
  const { title: siteTitle, description: siteDescription } = generalSettings || {}

  const {
    title,
    content,
    featuredImage,
    headerFooterVisibility,
    seo,
    uri,
    passwordProtected,
  } = page || {}

  // Password check
  useEffect(() => {
    const storedPassword = Cookies.get('pagePassword')
    if (storedPassword && storedPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
    }
  }, [passwordProtected?.password])

  // Lock scroll saat search aktif
  useEffect(() => {
    document.body.style.overflow = searchQuery ? 'hidden' : 'visible'
  }, [searchQuery])

  // Scroll + responsive
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    const handleResize = () => {
      const w = window.innerWidth
      setIsMobile(w <= 768)
      setIsDesktop(w > 768)
    }
    handleScroll()
    handleResize()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Lock scroll saat nav aktif
  useEffect(() => {
    document.body.style.overflow = isNavShown ? 'hidden' : 'visible'
  }, [isNavShown])

  // Menus
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
    fetchPolicy: 'cache-and-network',
  })

  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.featureHeaderMenuItems?.nodes ?? []

  // Latest posts
  const { data: latestStories, loading: latestLoading } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'cache-and-network',
  })

  const allPosts =
    latestStories?.posts?.edges
      ?.map((e) => e?.node)
      ?.sort((a, b) => new Date(b?.date) - new Date(a?.date)) ?? []

  // Password submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('pagePassword', enteredPassword, { expires: 1 })
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  // Password Protected View
  if (passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main
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
    <main>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />

      {isDesktop ? (
        <>
          <Header
            title={siteTitle}
            description={siteDescription}
            primaryMenuItems={primaryMenu}
            secondaryMenuItems={secondaryMenu}
            thirdMenuItems={thirdMenu}
            fourthMenuItems={fourthMenu}
            fifthMenuItems={fifthMenu}
            featureMenuItems={featureMenu}
            latestStories={allPosts}
            menusLoading={menusLoading}
            latestLoading={latestLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isNavShown={isNavShown}
            setIsNavShown={setIsNavShown}
            isScrolled={isScrolled}
          />
          <SecondaryDesktopHeaderPage
            title={siteTitle}
            description={siteDescription}
            primaryMenuItems={primaryMenu}
            secondaryMenuItems={secondaryMenu}
            thirdMenuItems={thirdMenu}
            fourthMenuItems={fourthMenu}
            fifthMenuItems={fifthMenu}
            featureMenuItems={featureMenu}
            latestStories={allPosts}
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
        </>
      ) : (
        <>
          <Header
            title={siteTitle}
            description={siteDescription}
            primaryMenuItems={primaryMenu}
            secondaryMenuItems={secondaryMenu}
            thirdMenuItems={thirdMenu}
            fourthMenuItems={fourthMenu}
            fifthMenuItems={fifthMenu}
            featureMenuItems={featureMenu}
            latestStories={allPosts}
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
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
            isScrolled={isScrolled}
          />
        </>
      )}

      <Main>
        {!headerFooterVisibility?.headerVisibility && <EntryHeader title={title} />}

        {isMobile ? <MastHeadTopMobile /> : <MastHeadTop />}

        <Container>
          <ContentWrapperPage content={content} />
        </Container>

        {isMobile ? <MastHeadBottomMobile /> : <MastHeadBottom />}
      </Main>

      {!headerFooterVisibility?.footerVisibility && <Footer />}
    </main>
  )
}

// ✅ Query bersih: hanya BlogInfoFragment & PageFragment.
//    PageFragment sudah berisi semua field yang dibutuhkan untuk `page`.
Component.query = gql`
  ${BlogInfoFragment}
  ${PageFragment}
  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      ...PageFragment
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
