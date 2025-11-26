// wp-template/page-404-page.js

import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'

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

export default function Component(props) {
  if (props.loading) return <>Loading...</>

  // Site & page data
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const { title, content, featuredImage, seo, uri } = props?.data?.page ?? {}

  // UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)

  // Lock body scroll when search or nav is active
  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown])

  // Add sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 20,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.featureHeaderMenuItems?.nodes ?? []

  // Latest stories
  const { data: latestStories, loading: latestLoading } = useQuery(
    GetLatestStories,
    {
      variables: { first: 5 },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'network-only',
    },
  )

  // Merge all posts
  const mainCatPosts = [
    ...(latestStories?.posts?.edges ?? []).map((p) => p.node),
    ...(latestStories?.editorials?.edges ?? []).map((p) => p.node),
    ...(latestStories?.updates?.edges ?? []).map((p) => p.node),
  ]

  const allPosts = mainCatPosts.sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )

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

// GraphQL query
Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID = "133415", $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      id
      title
      content
      ...FeaturedImageFragment
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

// Query variables
Component.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})
