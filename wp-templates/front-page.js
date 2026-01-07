import React, { useState, useEffect, useMemo } from 'react'
import { gql } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { GetMenus } from '../queries/GetMenus'

import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import HomepageHeader from '../components/HomepageHeader/HomepageHeader'
import HomepageSecondaryHeader from '../components/HomepageHeader/HomepageSecondaryHeader/HomepageSecondaryHeader'
import HomepageDestopHeader from '../components/HomepageHeader/HomepageDestopHeader/HomepageDestopHeader'
import Main from '../components/Main/Main'
import FrontPageLayout from '../components/FrontPageLayout/FrontPageLayout'
import Container from '../components/Container/Container'
import Footer from '../components/Footer/Footer'
import SEO from '../components/SEO/SEO'
import { open_sans } from '../styles/fonts/fonts'
import { useSWRGraphQL } from '../lib/useSWRGraphQL'

import dynamic from 'next/dynamic'

const FrontPageVideos = dynamic(
  () => import('../components/FrontPageLayout/FrontPageVideos'),
  { ssr: false },
)

const FeatureWell = dynamic(
  () => import('../components/FeatureWell/FeatureWell'),
  { ssr: false }
)

export default function FrontPage(props) {
  if (props.loading) return null
  const { page, generalSettings } = props?.data || {}
  const { featuredImage, uri, seo, acfHomepageSlider } = page || {}

  const siteTitle = generalSettings?.title
  const siteDescription = generalSettings?.description

  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')


    // scroll optimized
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown || isGuidesNavShown ? 'hidden' : 'auto'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  const featureWell = useMemo(() => {
    if (!acfHomepageSlider) return []

    return [1, 2, 3, 4, 5]
      .map((num) => ({
        type: acfHomepageSlider[`typeSlide${num}`],
        desktopSrc: acfHomepageSlider[`desktopSlide${num}`]?.mediaItemUrl,
        mobileSrc: acfHomepageSlider[`mobileSlide${num}`]?.mediaItemUrl,
        videoSrc: acfHomepageSlider[`video${num}`]?.mediaItemUrl,
        url: acfHomepageSlider[`slideLink${num}`],
        caption: acfHomepageSlider[`slideCaption${num}`],
        standFirst: acfHomepageSlider[`slideStandFirst${num}`],
        category: acfHomepageSlider[`slideCategory${num}`],
        categoryLink: acfHomepageSlider[`slideCategoryLink${num}`],
      }))
      .filter(Boolean)
  }, [acfHomepageSlider])

  const { data: menusData } = useSWRGraphQL('menus', GetMenus, {
    first: 10,
    headerLocation: MENUS.PRIMARY_LOCATION,
    secondHeaderLocation: MENUS.SECONDARY_LOCATION,
    thirdHeaderLocation: MENUS.THIRD_LOCATION,
    fourthHeaderLocation: MENUS.FOURTH_LOCATION,
    fifthHeaderLocation: MENUS.FIFTH_LOCATION,
  })

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
    searchQuery,
    setSearchQuery,
    isNavShown,
    setIsNavShown,
    isScrolled,
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <main className={open_sans.variable}>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />

      <div className="hidden lg:block">
        <HomepageDestopHeader
          {...menuProps}
          isGuidesNavShown={isGuidesNavShown}
          setIsGuidesNavShown={setIsGuidesNavShown}
        />
      </div>

      <div className="block lg:hidden">
        <HomepageHeader {...menuProps} />
        <HomepageSecondaryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isGuidesNavShown={isGuidesNavShown}
          setIsGuidesNavShown={setIsGuidesNavShown}
          isScrolled={isScrolled}
        />
      </div>

      <Main>
        {featureWell.length > 0 && (
          <Container>
            <FeatureWell featureWells={featureWell} />
          </Container>
        )}

        <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
          <FrontPageLayout />
        </div>

        <div
          className="component-videos w-full"
          style={{ backgroundColor: '#008080' }}
        >
          <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
            <FrontPageVideos />
          </div>
        </div>
      </Main>

      <Footer />
    </main>
  )
}
FrontPage.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetFrontPage($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      uri
      seo {
        title
        metaDesc
        focuskw
      }
      ...FeaturedImageFragment
      acfHomepageSlider {
        desktopSlide1 {
          mediaItemUrl
        }
        desktopSlide2 {
          mediaItemUrl
        }
        desktopSlide3 {
          mediaItemUrl
        }
        desktopSlide4 {
          mediaItemUrl
        }
        desktopSlide5 {
          mediaItemUrl
        }
        mobileSlide1 {
          mediaItemUrl
        }
        mobileSlide2 {
          mediaItemUrl
        }
        mobileSlide3 {
          mediaItemUrl
        }
        mobileSlide4 {
          mediaItemUrl
        }
        mobileSlide5 {
          mediaItemUrl
        }
        video1 {
          mediaItemUrl
        }
        video2 {
          mediaItemUrl
        }
        video3 {
          mediaItemUrl
        }
        video4 {
          mediaItemUrl
        }
        video5 {
          mediaItemUrl
        }
        slideCaption1
        slideCaption2
        slideCaption3
        slideCaption4
        slideCaption5
        slideStandFirst1
        slideStandFirst2
        slideStandFirst3
        slideStandFirst4
        slideStandFirst5
        slideCategory1
        slideCategory2
        slideCategory3
        slideCategory4
        slideCategory5
        slideCategoryLink1
        slideCategoryLink2
        slideCategoryLink3
        slideCategoryLink4
        slideCategoryLink5
        slideLink1
        slideLink2
        slideLink3
        slideLink4
        slideLink5
        typeSlide1
        typeSlide2
        typeSlide3
        typeSlide4
        typeSlide5
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

FrontPage.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})
