'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { gql } from '@apollo/client'

// Constants & Fragments
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

// Components
import Header from '../components/Header/Header'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import Main from '../components/Main/Main'
import Container from '../components/Container/Container'
import SEO from '../components/SEO/SEO'
import ErrorPage from '../components/ErrorPage/ErrorPage'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'

// Queries
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'

// SWR
import { useSWRGraphQL } from '../lib/useSWRGraphQL'

export default function Page404(props) {
  if (props.loading) return <>Loading...</>

  /* ===============================
     CLIENT READY (ANTI HYDRATION)
  =============================== */
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  /* ===============================
     SITE & PAGE DATA (SSR)
  =============================== */
  const { generalSettings, page } = props?.data ?? {}

  const siteTitle = generalSettings?.title
  const siteDescription = generalSettings?.description

  const {
    title,
    content,
    featuredImage,
    seo,
    uri,
  } = page ?? {}

  /* ===============================
     UI STATES
  =============================== */
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)

  /* ===============================
     BODY SCROLL LOCK
  =============================== */
  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown])

  /* ===============================
     SCROLL DETECTOR
  =============================== */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ===============================
     MENUS (SWR)
  =============================== */
  const { data: menusData } = useSWRGraphQL(
    'menus-404',
    GetMenus,
    {
      first: 20,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
    }
  )

  const menusLoading = !menusData

  const {
    headerMenuItems,
    secondHeaderMenuItems,
    thirdHeaderMenuItems,
    fourthHeaderMenuItems,
    fifthHeaderMenuItems,
    featureHeaderMenuItems,
  } = menusData ?? {}

  /* ===============================
     LATEST STORIES (SWR)
  =============================== */
  const { data: latestStories } = useSWRGraphQL(
    'latest-stories-404',
    GetLatestStories,
    { first: 5 }
  )

  const latestLoading = !latestStories

  const allPosts = useMemo(() => {
    const posts = [
      ...(latestStories?.posts?.edges ?? []).map((e) => e.node),
      ...(latestStories?.editorials?.edges ?? []).map((e) => e.node),
      ...(latestStories?.updates?.edges ?? []).map((e) => e.node),
    ]

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  /* ===============================
     RENDER
  =============================== */
  return (
    <main>
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
        primaryMenuItems={headerMenuItems?.nodes ?? []}
        secondaryMenuItems={secondHeaderMenuItems?.nodes ?? []}
        thirdMenuItems={thirdHeaderMenuItems?.nodes ?? []}
        fourthMenuItems={fourthHeaderMenuItems?.nodes ?? []}
        fifthMenuItems={fifthHeaderMenuItems?.nodes ?? []}
        featureMenuItems={featureHeaderMenuItems?.nodes ?? []}
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

      <Main>
        <Container>
          <ErrorPage
            image={featuredImage?.node}
            title={title}
            content={content}
          />
        </Container>
      </Main>
    </main>
  )
}
