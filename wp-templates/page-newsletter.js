import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { HeaderFooterVisibilityFragment } from '../fragments/HeaderFooterVisibility'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Main from '../components/Main/Main'
import Container from '../components/Container/Container'
import EntryHeader from '../components/EntryHeader/EntryHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import SEO from '../components/SEO/SEO'

import { GetMenus } from '../queries/GetMenus'
// import { GetFooterMenus } from '../queries/GetFooterMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'

export default function Component(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings
  const { title, content, featuredImage, headerFooterVisibility, seo, uri } =
    props?.data?.page

  // Search function content
  const [searchQuery, setSearchQuery] = useState('')
  // Scrolled Function
  const [isScrolled, setIsScrolled] = useState(false)
  // NavShown Function
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isRCANavShown, setIsRCANavShown] = useState(false)

  // Stop scrolling pages when searchQuery
  useEffect(() => {
    if (searchQuery !== '') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [searchQuery])

  // Add sticky header on scroll
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Get menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 20,
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

  // Header Menu
  const primaryMenu = menusData?.headerMenuItems?.nodes ?? []
  const secondaryMenu = menusData?.secondHeaderMenuItems?.nodes ?? []
  const thirdMenu = menusData?.thirdHeaderMenuItems?.nodes ?? []
  const fourthMenu = menusData?.fourthHeaderMenuItems?.nodes ?? []
  const fifthMenu = menusData?.fifthHeaderMenuItems?.nodes ?? []
  const featureMenu = menusData?.featureHeaderMenuItems?.nodes ?? []

  // Get Footer menus
  const { data: footerMenusData, loading: footerMenusLoading } = useQuery(
    GetFooterMenus,
    {
      variables: {
        first: 50,
        footerHeaderLocation: MENUS.FOOTER_LOCATION,
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  // Footer Menu
  const footerMenu = footerMenusData?.footerHeaderMenuItems?.nodes ?? []

  // Get latest travel stories
  const { data: latestStories, loading: latestLoading } = useQuery(
    GetLatestStories,
    {
      variables: {
        first: 5,
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  )

  const posts = latestStories?.posts ?? []
  const editorials = latestStories?.editorials ?? []
  const updates = latestStories?.updates ?? []

  const mainPosts = []
  const mainEditorialPosts = []
  const mainUpdatesPosts = []

  // loop through all the main categories posts
  posts?.edges?.forEach((post) => {
    mainPosts.push(post.node)
  })

  // loop through all the main categories and their posts
  editorials?.edges?.forEach((post) => {
    mainEditorialPosts.push(post.node)
  })

  // loop through all the main categories and their posts
  updates?.edges?.forEach((post) => {
    mainUpdatesPosts.push(post.node)
  })

  // sort posts by date
  const sortPostsByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA // Sort in descending order
  }

  // define mainCatPostCards
  const mainCatPosts = [
    ...(mainPosts != null ? mainPosts : []),
    ...(mainEditorialPosts != null ? mainEditorialPosts : []),
    ...(mainUpdatesPosts != null ? mainUpdatesPosts : []),
  ]

  // sortByDate mainCat & childCat Posts
  const allPosts = mainCatPosts.sort(sortPostsByDate)

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
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
        <>
          {headerFooterVisibility?.headerVisibility == true ? null : (
            <EntryHeader title={title} />
          )}
          <Container>
            <div
              dangerouslySetInnerHTML={{
                __html: `<div id="mc_embed_shell"><div id="mc_embed_signup"><form action="https://destinasian.us5.list-manage.com/subscribe/post?u=ee44e7f13f448e90776db3877&amp;id=d4a22bd002&amp;f_id=00d7c2e1f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank"><div id="mc_embed_signup_scroll"><h2>Stay inspired with our DestinAsian newsletters</h2><div class="divider"></div><div class="content-wrapper"><div class="mc-field-wrapper mc-field-group input-group"><ul><li><div class="container-check"><input type="checkbox" name="group[7601][4]" id="mce-group[7601]-7601-2" value="" class="checkbox-button" checked="checked"><label for="mce-group[7601]-7601-2">Travel News</label></div></li><li><div class="container-check"><input type="checkbox" name="group[7601][1]" id="mce-group[7601]-7601-0" value="" class="checkbox-button"><label for="mce-group[7601]-7601-0">Airline News</label></div></li><li><div class="container-check"><input type="checkbox" name="group[7601][2]" id="mce-group[7601]-7601-1" value="" class="checkbox-button"><label for="mce-group[7601]-7601-1">Contests/Partner Offers</label></div></li></ul></div><div class="mc-field-wrapper mc-field-group-two-column"><div class="mc-field-group mc-field-email"><input type="email" name="EMAIL" class="required text-form email" id="mce-EMAIL" required="" value="" placeholder="Email address"></div><div class="clear"><input type="submit" name="subscribe" id="mc-embedded-subscribe" class="submit-button" value="Subscribe"></div></div><div id="mce-responses" class="clearfalse"><div class="response" id="mce-error-response" style="display:none"></div><div class="response" id="mce-success-response" style="display:none"></div></div><div aria-hidden="true" style="position:absolute;left:-5000px"><input type="text" name="b_ee44e7f13f448e90776db3877_d4a22bd002" tabindex="-1" value=""></div></div></div></form></div></div>`,
              }}
              className="mx-auto my-0 w-screen pb-[50vh] pt-[25vh] sm:max-w-[700px]"
            />
          </Container>
        </>
      </Main>
      {headerFooterVisibility?.footerVisibility == true ? null : (
        <Footer />
      )}
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
