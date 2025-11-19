import React, { useEffect, useState, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { open_sans } from '../styles/fonts/fonts'
import SEO from '../components/SEO/SEO'

// Components
import SingleHeader from '../components/SingleHeader/SingleHeader'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import CategoryEntryHeader from '../components/CategoryEntryHeader/CategoryEntryHeader'
import TagStories from '../components/TagStories/TagStories'
import Main from '../components/Main/Main'
import Footer from '../components/Footer/Footer'

// Ads
import MastHeadTop from '../components/AdUnit/MastHeadTop/MastHeadTop'
import MastHeadTopMobile from '../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'
import MastHeadBottom from '../components/AdUnit/MastHeadBottom/MastHeadBottom'
import MastHeadBottomMobile from '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile'
import MastHeadTopGuides from '../components/AdUnit/MastHeadTop/MastHeadTopGuides'
import MastHeadTopMobileGuides from '../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileGuides'
import MastHeadBottomGuides from '../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'
import MastHeadBottomMobileGuides from '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'

export default function Component(props) {
  const { seo, name, databaseId, uri } = props?.data?.tag ?? {}

  // UI States
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchBarShown, setIsSearchBarShown] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isMagNavShown, setIsMagNavShown] = useState(false)
  const [isBurgerNavShown, setIsBurgerNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle scroll and responsive screen (desktop vs mobile)
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

  // Lock/unlock body scroll when overlays or navigation menus are active
  useEffect(() => {
    const shouldLock =
      searchQuery ||
      isNavShown ||
      isSearchBarShown ||
      isMagNavShown ||
      isGuidesNavShown ||
      isBurgerNavShown

    document.body.style.overflow = shouldLock ? 'hidden' : 'unset'
  }, [
    searchQuery,
    isNavShown,
    isSearchBarShown,
    isMagNavShown,
    isGuidesNavShown,
    isBurgerNavShown,
  ])

  // Get menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 30,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: "network-only",
  })

  // Get latest travel stories
  const { data: latestStories } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: "network-only",
  })

  const latestPosts = latestStories?.posts?.edges?.map((post) => post.node) ?? []
  const latestAllPosts = latestPosts.sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )

  // Render ads (different for desktop/mobile)
  const renderAdComponent = useCallback(
    (pos) => {
      const position = pos === 'top' ? 'Top' : 'Bottom'
      const key = `${isMobile ? 'Mobile' : 'Desktop'}`
      const componentMap = {
        Top: {
          Desktop: MastHeadTop,
          Mobile: MastHeadTopMobile,
          DesktopGuides: MastHeadTopGuides,
          MobileGuides: MastHeadTopMobileGuides,
        },
        Bottom: {
          Desktop: MastHeadBottom,
          Mobile: MastHeadBottomMobile,
          DesktopGuides: MastHeadBottomGuides,
          MobileGuides: MastHeadBottomMobileGuides,
        },
      }
      // This is tag page (not guides)
      const AdComponent = componentMap[position][key]
      return AdComponent ? <AdComponent /> : null
    },
    [isMobile],
  )

  return (
    <main className={`${open_sans.variable}`}>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
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
            latestStories={latestAllPosts}
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
            latestStories={latestAllPosts}
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

      <CategoryEntryHeader parent="Tag: " children={0} title={name} />

      <Main>
        {renderAdComponent('top')}
        <TagStories tagUri={databaseId} name={name} />
        {renderAdComponent('bottom')}
      </Main>

      <Footer />
    </main>
  )
}

// GraphQL Query
Component.query = gql`
  query GetTagPage($databaseId: ID!) {
    tag(id: $databaseId, idType: DATABASE_ID) {
      name
      databaseId
      uri
      seo {
        title
        metaDesc
        focuskw
      }
      categoryImages {
        changeToSlider
        categorySlide1 {
          mediaItemUrl
        }
        categorySlide2 {
          mediaItemUrl
        }
        categorySlide3 {
          mediaItemUrl
        }
        categorySlide4 {
          mediaItemUrl
        }
        categorySlide5 {
          mediaItemUrl
        }
        categoryImages {
          mediaItemUrl
        }
        categorySlideCaption1
        categorySlideCaption2
        categorySlideCaption3
        categorySlideCaption4
        categorySlideCaption5
        categoryImagesCaption
      }
    }
  }
`

Component.variables = ({ databaseId }) => ({ databaseId })
