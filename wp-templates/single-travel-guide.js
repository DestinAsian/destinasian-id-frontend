'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { gql } from '@apollo/client'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
import { useSWRGraphQL } from '../lib/useSWRGraphQL'

// Constants & Fragments
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

// Queries
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeaderTravelGuide } from '../queries/GetSecondaryHeaderTravelGuide'
import { GetSecondaryHeaders } from '../queries/GetSecondaryHeaders'

// Components
import SEO from '../components/SEO/SEO'
import Footer from '../components/Footer/Footer'
import Main from '../components/Main/Main'
import Container from '../components/Container/Container'
import SingleHeader from '../components/SingleHeader/SingleHeader'
import SingleDesktopHeader from '../components/SingleHeader/SingleDesktopHeader/SingleDesktopHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import SingleEntryHeaderTravelGuide from '../components/SingleEntryHeaderTravelGuide/SingleEntryHeaderTravelGuide'
import ContentWrapperTravelGuide from '../components/ContentWrapperTravelGuide/ContentWrapperTravelGuide'
import SingleSliderTravelGuide from '../components/SingleSliderTravelGuide/SingleSliderTravelGuide'
import EntryMoreReviews from '../components/EntryMoreReviews/EntryMoreReviews'
import PasswordProtected from '../components/PasswordProtected/PasswordProtected'
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import FloatingButtons from '../components/FloatingButtons/FloatingButtons'
import RelatedTravelGuides from '../components/RelatedPosts/RelatedTravelGuides'

// Fonts
import { open_sans } from '../styles/fonts/fonts'

const MastHeadTopGuides = dynamic(
  () => import('../components/AdUnit/MastHeadTop/MastHeadTopGuides'),
  { ssr: false },
)
const MastHeadTopMobileSingleGuides = dynamic(
  () =>
    import(
      '../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileSingleGuides'
    ),
  { ssr: false },
)
const MastHeadBottomGuides = dynamic(
  () => import('../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'),
  { ssr: false },
)
const MastHeadBottomMobileGuides = dynamic(
  () =>
    import(
      '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'
    ),
  { ssr: false },
)

export default function SingleTravelGuide(props) {
  if (props.loading) return <>Loading...</>

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const travelGuide = props?.data?.travelGuide || {}
  const {
    title,
    content,
    featuredImage,
    databaseId,
    acfPostSlider,
    seo,
    uri,
    passwordProtected,
    author,
    date,
  } = travelGuide

  const categories = travelGuide?.categories?.edges ?? []

  const siteDescription = props?.data?.generalSettings?.description

  useEffect(() => {
    const storedPassword = Cookies.get('travelGuidePassword')
    if (storedPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
    }
  }, [passwordProtected?.password])

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setIsDesktop(w >= 1024)
      setIsMobile(w < 1024)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    handleResize()
    handleScroll()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const shouldLock = searchQuery !== '' || isNavShown || isGuidesNavShown

    document.body.style.overflow = shouldLock ? 'hidden' : ''
  }, [searchQuery, isNavShown, isGuidesNavShown])

  // Secondary Header (Category)
  useSWRGraphQL(
    databaseId ? 'secondary-header-travel-guide' : null,
    GetSecondaryHeaderTravelGuide,
    { first: 1, id: databaseId },
  )

  // Menus
  const { data: menusData } = useSWRGraphQL('menus', GetMenus, {
    first: 10,
    headerLocation: MENUS.PRIMARY_LOCATION,
    secondHeaderLocation: MENUS.SECONDARY_LOCATION,
    thirdHeaderLocation: MENUS.THIRD_LOCATION,
    fourthHeaderLocation: MENUS.FOURTH_LOCATION,
    fifthHeaderLocation: MENUS.FIFTH_LOCATION,
  })

  const { data: secondaryHeaderData, isLoading: secondaryHeaderLoading } =
    useSWRGraphQL('secondary-headers', GetSecondaryHeaders, {
      include: ['20', '29', '3'],
    })

  const secondaryCategories = useMemo(() => {
    return secondaryHeaderData?.categories?.edges ?? []
  }, [secondaryHeaderData])

  // Latest Stories
  const { data: latestStories } = useSWRGraphQL(
    'latest-stories',
    GetLatestStories,
    { first: 5 },
  )

  const allPosts = useMemo(() => {
    const posts = latestStories?.posts?.edges?.map((p) => p.node) || []

    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  const images = [1, 2, 3, 4, 5].map((n) => [
    acfPostSlider?.[`slide${n}`]?.mediaItemUrl || null,
    acfPostSlider?.[`slideCaption${n}`] || null,
  ])

  const firstSlider = images[0]?.filter(Boolean)

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('travelGuidePassword', enteredPassword, { expires: 1 })
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  if (passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main className={open_sans.variable}>
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
    <>
      <main className={open_sans.variable}>
        <SEO
          title={seo?.title}
          description={seo?.metaDesc}
          imageUrl={featuredImage?.node?.sourceUrl}
          url={uri}
          focuskw={seo?.focuskw}
        />
        <SingleHeader
          title={props?.data?.generalSettings?.title}
          description={siteDescription}
          primaryMenuItems={menusData?.headerMenuItems?.nodes || []}
          secondaryMenuItems={menusData?.secondHeaderMenuItems?.nodes || []}
          thirdMenuItems={menusData?.thirdHeaderMenuItems?.nodes || []}
          fourthMenuItems={menusData?.fourthHeaderMenuItems?.nodes || []}
          fifthMenuItems={menusData?.fifthHeaderMenuItems?.nodes || []}
          featureMenuItems={menusData?.featureHeaderMenuItems?.nodes || []}
          latestStories={allPosts}
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
          {isMobile ? <MastHeadTopMobileSingleGuides /> : <MastHeadTopGuides />}

          {firstSlider?.length > 0 && (
            <>
              <div className="single-slider-wrapper">
                <SingleSliderTravelGuide images={images} />
              </div>

              <style jsx>{`
                .single-slider-wrapper {
                  max-width: 1200px;
                  margin: 0 auto;
                  width: 100%;
                  overflow: hidden;
                }

                .single-slider-wrapper img {
                  width: 100%;
                  height: auto;
                  max-width: 1400px;
                  display: block;
                  margin: 0 auto;
                  object-fit: cover;
                }

                @media (max-width: 768px) {
                  .single-slider-wrapper {
                    max-width: 100vw;
                  }
                }
              `}</style>
            </>
          )}

          <SingleEntryHeaderTravelGuide
            title={title}
            categoryUri={categories?.[0]?.node?.uri}
            parentCategory={categories?.[0]?.node?.parent?.node?.name}
            categoryName={categories?.[0]?.node?.name}
            author={author?.node?.name}
            date={date}
          />

          <Container>
            <ContentWrapperTravelGuide content={content} />
          </Container>

          <div>
            {isMobile ? (
              <MastHeadBottomMobileGuides />
            ) : (
              <MastHeadBottomGuides />
            )}
          </div>

          <EntryMoreReviews />

          <RelatedTravelGuides
            tagIds={
              props?.data?.travelGuide?.tags?.edges?.map(
                (edge) => edge.node.databaseId,
              ) || []
            }
            excludeIds={[databaseId]}
          />
        </Main>

        <Footer />
      </main>

      {props?.data?.travelGuide?.buttontopup && (
        <FloatingButtons buttonTopUp={props.data.travelGuide.buttontopup} />
      )}
    </>
  )
}

SingleTravelGuide.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GettravelGuide($databaseId: ID!, $asPreview: Boolean = false) {
    travelGuide(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      id
      title
      databaseId
      content
      date
      passwordProtected {
        onOff
        password
      }
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
      guide_book_now {
        fieldGroupName
        guideName
        linkBookNow
        linkLocation
        guideLocation
      }
      buttontopup {
        buttonPopUp1
        buttonPopUp2
        linkButtonPopUp1
        linkButtonPopUp2
        logoButtonPopUp
      }
      categories(where: { childless: true }) {
        edges {
          node {
            id
            name
            uri
            parent {
              node {
                id
                name
                uri
                countryCode {
                  countryCode
                }
                children {
                  edges {
                    node {
                      id
                      name
                      uri
                    }
                  }
                }
              }
            }
            children {
              edges {
                node {
                  id
                  name
                  uri
                }
              }
            }
          }
        }
      }
      tags {
        edges {
          node {
            id
            databaseId
            name
          }
        }
      }
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
        slideCaption1
        slideCaption2
        slideCaption3
        slideCaption4
        slideCaption5
      }
      ...FeaturedImageFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`
SingleTravelGuide.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  }
}
