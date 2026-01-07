import React, { useState, useEffect, useMemo } from 'react'
import { gql } from '@apollo/client'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import { GetMenus } from '../queries/GetMenus'
import dynamic from 'next/dynamic'
import { useSWRGraphQL } from '../lib/useSWRGraphQL'
import SEO from '../components/SEO/SEO'
import Footer from '../components/Footer/Footer'
import Main from '../components/Main/Main'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import SingleContestEntryHeader from '../components/SingleContest/SingleContestEntryHeader'
import SingleSlider from '../components/SingleSlider/SingleSlider'
import ContentWrapperContest from '../components/ContentWrapperContest/ContentWrapperContest'
import PasswordProtected from '../components/PasswordProtected/PasswordProtected'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import { GetSecondaryHeaders } from '../queries/GetSecondaryHeaders'

import { graphQLFetcher } from '../lib/graphqlFetcher'

const MastHeadTopGuides = dynamic(
  () =>
    import('../components/AdUnit/MastHeadTop/MastHeadTopGuides'),
  { ssr: false },
)
const MastHeadTopMobileSingleGuides = dynamic(
  () =>
    import('../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileSingleGuides'),
  { ssr: false },
)
const MastHeadBottomGuides = dynamic(
  () =>
    import('../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'),
  { ssr: false },
)
const MastHeadBottomMobileGuides = dynamic(
  () =>
    import('../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'),
  { ssr: false },
)

export default function SingleContest({ data, loading }) {
  if (loading) return <>Loading...</>

  const contest = data?.contest
  const site = data?.generalSettings

  /* ======================
     PASSWORD PROTECTION
  ====================== */
  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!contest?.passwordProtected?.onOff) return

    const saved = Cookies.get('contestPassword')
    if (saved === contest.passwordProtected.password) {
      setIsAuthenticated(true)
    }
  }, [contest?.passwordProtected])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()

    if (enteredPassword === contest?.passwordProtected?.password) {
      Cookies.set('contestPassword', enteredPassword, { expires: 1 })
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  if (contest?.passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main>
        <form onSubmit={handlePasswordSubmit}>
          <PasswordProtected
            enteredPassword={enteredPassword}
            setEnteredPassword={setEnteredPassword}
            title={contest?.seo?.title}
            description={contest?.seo?.metaDesc}
            imageUrl={contest?.featuredImage?.node?.sourceUrl}
            url={contest?.uri}
            focuskw={contest?.seo?.focuskw}
          />
        </form>
      </main>
    )
  }

  /* ======================
     HEADER UI STATES
  ====================== */
  const [searchQuery, setSearchQuery] = useState('')
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { data: secondaryHeaderData, isLoading: secondaryHeaderLoading } =
    useSWRGraphQL('secondary-headers', GetSecondaryHeaders, {
      include: ['20', '29', '3'],
    })

  const secondaryCategories = useMemo(() => {
    return secondaryHeaderData?.categories?.edges ?? []
  }, [secondaryHeaderData])

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
    document.body.style.overflow = searchQuery || isNavShown ? 'hidden' : ''
  }, [searchQuery, isNavShown])

  /* ======================
     MENUS (SWR)
  ====================== */
  const { data: menusData, isLoading: menusLoading } = useSWR(
    [
      GetMenus,
      {
        first: 10,
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

  const images = useMemo(() => {
    const slides = contest?.acfPostSlider
    if (!slides) return []

    return [
      slides.slide1?.mediaItemUrl,
      slides.slide2?.mediaItemUrl,
      slides.slide3?.mediaItemUrl,
      slides.slide4?.mediaItemUrl,
      slides.slide5?.mediaItemUrl,
    ]
      .filter(Boolean)
      .map((url) => [url, null])
  }, [contest?.acfPostSlider])

  const category = contest?.categories?.edges?.[0]?.node

  return (
    <main>
      <SEO
        title={contest?.seo?.title}
        description={contest?.seo?.metaDesc}
        imageUrl={contest?.featuredImage?.node?.sourceUrl}
        url={contest?.uri}
        focuskw={contest?.seo?.focuskw}
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

      <Main>
        <div>
          {isMobile ? <MastHeadTopMobileSingleGuides /> : <MastHeadTopGuides />}
        </div>
        {images?.length > 0 && (
          <>
            <div className="single-slider-wrapper">
              <SingleSlider images={images} />
            </div>

            <style jsx>{`
              .single-slider-wrapper {
                max-width: 1200px;
                width: 100%;
                margin: 0 auto;
                overflow: hidden;
              }

              .single-slider-wrapper img {
                width: 100%;
                height: auto;
                display: block;
                object-fit: cover;
              }
            `}</style>
          </>
        )}

        <SingleContestEntryHeader
          title={contest?.title}
          categoryUri={category?.uri}
          parentCategory={category?.parent?.node?.name}
          categoryName={category?.name}
          author={contest?.author?.node?.name}
          date={contest?.date}
        />

        <ContentWrapperContest content={contest?.content} />

        {isMobile ? <MastHeadBottomMobileGuides /> : <MastHeadBottomGuides />}
      </Main>

      <Footer />
    </main>
  )
}

SingleContest.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    contest(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
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
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

SingleContest.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})
