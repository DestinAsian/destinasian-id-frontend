import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Cookies from 'js-cookie'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { eb_garamond, rubik, rubik_mono_one } from '../styles/fonts/fonts'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import { GetMenus } from '../queries/GetMenus'
import dynamic from 'next/dynamic'

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

// Ads (dynamic imports)
const MastHeadTopGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadTop/MastHeadTopGuides'),
)
const MastHeadTopMobileSingleGuides = dynamic(() =>
  import(
    '../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileSingleGuides'
  ),
)
const MastHeadBottomGuides = dynamic(() =>
  import('../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'),
)
const MastHeadBottomMobileGuides = dynamic(() =>
  import(
    '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'
  ),
)

export default function SingleContest(props) {
  if (props.loading) {
    return <>Loading...</>
  }

  const [enteredPassword, setEnteredPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check password from cookies on mount
  useEffect(() => {
    const storedPassword = Cookies.get('contestPassword')
    if (
      storedPassword &&
      storedPassword === props?.data?.contest?.passwordProtected?.password
    ) {
      setIsAuthenticated(true)
    }
  }, [props?.data?.contest?.passwordProtected?.password])

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings

  const {
    title,
    content,
    featuredImage,
    acfPostSlider,
    seo,
    uri,
    passwordProtected,
    author,
    date,
  } = props?.data?.contest

  const categories = props?.data?.contest.categories?.edges ?? []

  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Disable body scroll when search is active
  useEffect(() => {
    document.body.style.overflow = searchQuery ? 'hidden' : ''
  }, [searchQuery])

  // Add sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Disable body scroll when navigation menu is open
  useEffect(() => {
    document.body.style.overflow = isNavShown ? 'hidden' : ''
  }, [isNavShown])

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      setIsMobile(width <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 10,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  const images = [
    [
      acfPostSlider?.slide1?.mediaItemUrl || null,
      acfPostSlider?.slideCaption1 || null,
    ],
    [
      acfPostSlider?.slide2?.mediaItemUrl || null,
      acfPostSlider?.slideCaption2 || null,
    ],
    [
      acfPostSlider?.slide3?.mediaItemUrl || null,
      acfPostSlider?.slideCaption3 || null,
    ],
    [
      acfPostSlider?.slide4?.mediaItemUrl || null,
      acfPostSlider?.slideCaption4 || null,
    ],
    [
      acfPostSlider?.slide5?.mediaItemUrl || null,
      acfPostSlider?.slideCaption5 || null,
    ],
  ]

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (enteredPassword === passwordProtected?.password) {
      setIsAuthenticated(true)
      Cookies.set('contestPassword', enteredPassword, { expires: 1 }) // 1 day expiry
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  if (passwordProtected?.onOff && !isAuthenticated) {
    return (
      <main>
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
          <SingleHeader
            title={siteTitle}
            description={siteDescription}
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
            title={siteTitle}
            description={siteDescription}
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
          title={title}
          categoryUri={categories?.[0]?.node?.uri}
          parentCategory={categories?.[0]?.node?.parent?.node?.name}
          categoryName={categories?.[0]?.node?.name}
          author={author?.node?.name}
          date={date}
        />
        <ContentWrapperContest content={content} />
        <div>
          {isMobile ? <MastHeadBottomMobileGuides /> : <MastHeadBottomGuides />}
        </div>
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
