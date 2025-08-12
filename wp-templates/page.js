import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'

import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { HeaderFooterVisibilityFragment } from '../fragments/HeaderFooterVisibility'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
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

import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'

import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'

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
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedPassword = Cookies.get('pagePassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.page?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.page?.passwordProtected?.password])

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const {
    title,
    content,
    featuredImage,
    headerFooterVisibility,
    seo,
    uri,
    passwordProtected,
  } = props?.data?.page

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (searchQuery !== '') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [searchQuery])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsDesktop(width > 768)
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

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isNavShown])

  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 10,
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

  const { data: latestStories, loading: latestLoading } = useQuery(
    GetLatestStories,
    {
      variables: { first: 5 },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    }
  )

  const posts = latestStories?.posts ?? []
  const mainPosts = []
  posts?.edges?.forEach((post) => {
    mainPosts.push(post.node)
  })

  const sortPostsByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA
  }

  const mainCatPosts = [...(mainPosts != null ? mainPosts : [])]
  const allPosts = mainCatPosts.sort(sortPostsByDate)

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('pagePassword', enteredPassword, { expires: 1 })
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
      <>
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
      </>
      <Main>
        <>
          {headerFooterVisibility?.headerVisibility == true ? null : (
            <EntryHeader title={title} />
          )}
          <div>{isMobile ? <MastHeadTopMobile /> : <MastHeadTop />}</div>
          <Container>
            <ContentWrapperPage content={content} />
          </Container>
          <div>{isMobile ? <MastHeadBottomMobile /> : <MastHeadBottom />}</div>
        </>
      </Main>
      {headerFooterVisibility?.footerVisibility == true ? null : <Footer />}
    </main>
  )
}

Component.query = gql`
  ${BlogInfoFragment}
  ${HeaderFooterVisibilityFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      passwordProtected {
        onOff
        password
      }
      ...FeaturedImageFragment
      headerFooterVisibility {
        ...HeaderFooterVisibilityFragment
      }
      seo {
        title
        metaDesc
        focuskw
      }
      uri
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
