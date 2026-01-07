import React, { useEffect, useState, useMemo } from 'react'
import { gql } from '@apollo/client'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

import * as MENUS from '../constants/menus'
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { open_sans } from '../styles/fonts/fonts'
import SEO from '../components/SEO/SEO'
import { useSWRGraphQL } from '../lib/useSWRGraphQL'
import { GetSecondaryHeaders } from '../queries/GetSecondaryHeaders'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import CategoryEntryHeader from '../components/CategoryEntryHeader/CategoryEntryHeader'
import TagStories from '../components/TagStories/TagStories'
import Main from '../components/Main/Main'
import Footer from '../components/Footer/Footer'

const MastHeadTop = dynamic(() =>
  import('../components/AdUnit/MastHeadTop/MastHeadTop'),
)
const MastHeadTopMobile = dynamic(() =>
  import('../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'),
)
const MastHeadBottom = dynamic(() =>
  import('../components/AdUnit/MastHeadBottom/MastHeadBottom'),
)
const MastHeadBottomMobile = dynamic(() =>
  import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile'),
)

import { graphQLFetcher } from '../lib/graphqlFetcher'

export default function TagPage({ data }) {
  const tag = data?.tag
  const site = data?.generalSettings

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isSearchBarShown] = useState(false)
  const [isMagNavShown] = useState(false)
  const [isBurgerNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { data: secondaryHeaderData, isLoading: secondaryHeaderLoading } =
    useSWRGraphQL('secondary-headers', GetSecondaryHeaders, {
      include: ['20', '29', '3'],
    })

  const secondaryCategories = useMemo(() => {
    return secondaryHeaderData?.categories?.edges ?? []
  }, [secondaryHeaderData])
  /* =====================
     SCROLL & RESIZE
  ===================== */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0)
    const onResize = () => {
      const w = window.innerWidth
      setIsMobile(w <= 768)
      setIsDesktop(w > 768)
    }

    onResize()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  /* =====================
     BODY LOCK
  ===================== */
  useEffect(() => {
    const lock =
      searchQuery ||
      isNavShown ||
      isSearchBarShown ||
      isMagNavShown ||
      isGuidesNavShown ||
      isBurgerNavShown

    document.body.style.overflow = lock ? 'hidden' : ''
  }, [
    searchQuery,
    isNavShown,
    isSearchBarShown,
    isMagNavShown,
    isGuidesNavShown,
    isBurgerNavShown,
  ])

  /* =====================
     MENUS (SWR)
  ===================== */
  const { data: menusData, isLoading: menusLoading } = useSWR(
    [
      GetMenus,
      {
        first: 30,
        headerLocation: MENUS.PRIMARY_LOCATION,
        secondHeaderLocation: MENUS.SECONDARY_LOCATION,
        thirdHeaderLocation: MENUS.THIRD_LOCATION,
        fourthHeaderLocation: MENUS.FOURTH_LOCATION,
        fifthHeaderLocation: MENUS.FIFTH_LOCATION,
      },
    ],
    ([query, variables]) => graphQLFetcher(query, variables),
    { revalidateOnFocus: false },
  )

  /* =====================
     LATEST STORIES (SWR)
  ===================== */
  const { data: latestStories } = useSWR(
    [GetLatestStories, { first: 5 }],
    ([query, variables]) => graphQLFetcher(query, variables),
    { revalidateOnFocus: false },
  )

  const latestAllPosts = useMemo(() => {
    const posts = latestStories?.posts?.edges?.map((p) => p.node) ?? []

    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  /* =====================
     ADS RENDER
  ===================== */
  const renderTopAd = () => (isMobile ? <MastHeadTopMobile /> : <MastHeadTop />)

  const renderBottomAd = () =>
    isMobile ? <MastHeadBottomMobile /> : <MastHeadBottom />

  return (
    <main className={`${open_sans.variable}`}>
      <SEO
        title={tag?.seo?.title}
        description={tag?.seo?.metaDesc}
        url={tag?.uri}
        focuskw={tag?.seo?.focuskw}
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
        latestStories={latestAllPosts}
        menusLoading={menusLoading}
        latestLoading={!latestStories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isNavShown={isNavShown}
        setIsNavShown={setIsNavShown}
        isScrolled={isScrolled}
      />

      {isDesktop ? (
        <SingleDesktopHeader
          categories={secondaryCategories}
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

      {/* <CategoryEntryHeader parent="Tag: " children={0} title={name} /> */}
      <CategoryEntryHeader parent="Tag: " title={tag?.name} />

      {/* <Main>
        {renderAdComponent('top')}
        <TagStories tagUri={databaseId} name={name} />
        {renderAdComponent('bottom')}
      </Main> */}
      <Main>
        {renderTopAd()}
        <TagStories tagUri={tag?.databaseId} name={tag?.name} />
        {renderBottomAd()}
      </Main>

      <Footer />
    </main>
  )
}

// GraphQL Query
TagPage.query = gql`
  query GetTagPage($databaseId: ID!) {
    tag(id: $databaseId, idType: DATABASE_ID) {
      id
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

TagPage.variables = ({ databaseId }) => ({ databaseId })
