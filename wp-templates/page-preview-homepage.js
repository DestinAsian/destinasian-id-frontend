'use client'

import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { gql } from '@apollo/client'
import useSWR from 'swr'

import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { GetMenus } from '../queries/GetMenus'
import { graphQLFetcher } from '../lib/graphqlFetcher'

// Components
import HomepageHeader from '../components/HomepageHeader/HomepageHeader'
import HomepageSecondaryHeader from '../components/HomepageHeader/HomepageSecondaryHeader/HomepageSecondaryHeader'
import HomepageDesktopHeader from '../components/HomepageHeader/HomepageDestopHeader/HomepageDestopHeader'
import FeatureWell from '../components/FeatureWell/FeatureWell'
import Main from '../components/Main/Main'
import FrontPageLayout from '../components/FrontPageLayout/FrontPageLayout'
import Container from '../components/Container/Container'
import Footer from '../components/Footer/Footer'
import FrontPageVideos from '../components/FrontPageLayout/FrontPageVideos'
import SEO from '../components/SEO/SEO'

export default function Component(props) {
  if (props.loading) return <>Loading...</>

  /* =====================
     DATA
  ===================== */
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings || {}

  const { featuredImage, uri, seo, acfHomepageSlider } =
    props?.data?.page || {}

  /* =====================
     UI STATES
  ===================== */
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  /* =====================
     SCROLL & RESIZE
  ===================== */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0)
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)

    onResize()
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  /* =====================
     BODY SCROLL LOCK
  ===================== */
  useEffect(() => {
    const shouldLock = searchQuery || isNavShown || isGuidesNavShown
    document.body.classList.toggle('no-scroll', !!shouldLock)
  }, [searchQuery, isNavShown, isGuidesNavShown])

  /* =====================
     FEATURE WELL DATA
  ===================== */
  const featureWells = useMemo(() => {
    if (!acfHomepageSlider) return []

    return [1, 2, 3, 4, 5]
      .map((i) => ({
        type: acfHomepageSlider[`typeSlide${i}`],
        videoSrc: acfHomepageSlider[`video${i}`]?.mediaItemUrl,
        desktopSrc: acfHomepageSlider[`desktopSlide${i}`]?.mediaItemUrl,
        mobileSrc: acfHomepageSlider[`mobileSlide${i}`]?.mediaItemUrl,
        url: acfHomepageSlider[`slideLink${i}`],
        category: acfHomepageSlider[`slideCategory${i}`],
        categoryLink: acfHomepageSlider[`slideCategoryLink${i}`],
        caption: acfHomepageSlider[`slideCaption${i}`],
        standFirst: acfHomepageSlider[`slideStandFirst${i}`],
      }))
      .filter((slide) => slide.type)
  }, [acfHomepageSlider])

  /* =====================
     RANDOM SLIDE (CLIENT ONLY)
  ===================== */
  useEffect(() => {
    if (!featureWells.length) return
    setActiveSlideIndex(Math.floor(Math.random() * featureWells.length))
  }, [featureWells.length])

  /* =====================
     MENUS (SWR)
  ===================== */
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

  const menuProps = {
    title: siteTitle,
    description: siteDescription,
    primaryMenuItems: menusData?.headerMenuItems?.nodes ?? [],
    secondaryMenuItems: menusData?.secondHeaderMenuItems?.nodes ?? [],
    thirdMenuItems: menusData?.thirdHeaderMenuItems?.nodes ?? [],
    fourthMenuItems: menusData?.fourthHeaderMenuItems?.nodes ?? [],
    fifthMenuItems: menusData?.fifthHeaderMenuItems?.nodes ?? [],
    featureMenuItems: menusData?.footerMenuItems?.nodes ?? [],
    home: uri,
    menusLoading,
    searchQuery,
    setSearchQuery,
    isNavShown,
    setIsNavShown,
    isScrolled,
  }

  /* =====================
     RENDER
  ===================== */
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
        <HomepageDesktopHeader
          {...menuProps}
          isGuidesNavShown={isGuidesNavShown}
          setIsGuidesNavShown={setIsGuidesNavShown}
        />
      ) : (
        <>
          <HomepageHeader {...menuProps} />
          <HomepageSecondaryHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
            isScrolled={isScrolled}
          />
        </>
      )}

      <Main>
        <div className="snap-y snap-mandatory">
          <div className="snap-start">
            {featureWells.length > 0 && (
              <Container>
                <FeatureWell
                  featureWells={featureWells}
                  initialIndex={activeSlideIndex}
                />
              </Container>
            )}
          </div>

          <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
            <Suspense fallback={<div>Loading section...</div>}>
              <FrontPageLayout />
            </Suspense>
          </div>

          <div className="component-videos w-full bg-[#008080]">
            <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
              <FrontPageVideos />
            </div>
          </div>
        </div>
      </Main>

      <Footer />
    </main>
  )
}
