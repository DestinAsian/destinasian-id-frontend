import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'

import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'
import { GetMenus } from '../queries/GetMenus'
import { eb_garamond, rubik_mono_one } from '../styles/fonts/fonts'

// Components
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import HomepageHeader from '../components/HomepageHeader/HomepageHeader'
import HomepageSecondaryHeader from '../components/HomepageHeader/HomepageSecondaryHeader/HomepageSecondaryHeader'
import HomepageDestopHeader from '../components/HomepageHeader/HomepageDestopHeader/HomepageDestopHeader'
import FeatureWell from '../components/FeatureWell/FeatureWell'
import Main from '../components/Main/Main'
import FrontPageLayout from '../components/FrontPageLayout/FrontPageLayout'
import Container from '../components/Container/Container'
import Footer from '../components/Footer/Footer'
import FrontPageVideos from '../components/FrontPageLayout/FrontPageVideos'
import SEO from '../components/SEO/SEO'

export default function Component(props) {
  if (props.loading) return <>Loading...</>

  // Data dari props
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings || {}
  const { featuredImage, uri, seo, acfHomepageSlider } = props?.data?.page || {}
  const { databaseId, asPreview } = props?.__TEMPLATE_VARIABLES__ ?? {}

  // State UI
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [currentFeatureWell, setCurrentFeatureWell] = useState(null)

  // Scroll & resize listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0)
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)

    onResize()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Lock body scroll saat menu/search aktif
  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown || isGuidesNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  // Generate featureWell slides
  const featureWell = useMemo(() => {
    return [1, 2, 3]
      .map((num) => ({
        type: acfHomepageSlider?.[`typeSlide${num}`],
        videoSrc: acfHomepageSlider?.[`video${num}`]?.mediaItemUrl,
        desktopSrc: acfHomepageSlider?.[`desktopSlide${num}`]?.mediaItemUrl,
        mobileSrc: acfHomepageSlider?.[`mobileSlide${num}`]?.mediaItemUrl,
        url: acfHomepageSlider?.[`slideLink${num}`],
        category: acfHomepageSlider?.[`slideCategory${num}`],
        categoryLink: acfHomepageSlider?.[`slideCategoryLink${num}`],
        caption: acfHomepageSlider?.[`slideCaption${num}`],
        standFirst: acfHomepageSlider?.[`slideStandFirst${num}`],
      }))
      .filter((slide) => slide.type)
  }, [acfHomepageSlider])

  // Pilih random slide awal
  useEffect(() => {
    if (featureWell.length) {
      const randomIndex = Math.floor(Math.random() * featureWell.length)
      setCurrentFeatureWell(featureWell[randomIndex])
    }
  }, [featureWell])

  // Ambil data menus
  const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
    variables: {
      first: 10,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
      featureHeaderLocation: MENUS.FEATURE_LOCATION,
    },
    fetchPolicy: 'cache-first',
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
    menusLoading,
    searchQuery,
    setSearchQuery,
    isNavShown,
    setIsNavShown,
    isScrolled,
  }

  return (
    <main className={`${eb_garamond.variable} ${rubik_mono_one.variable}`}>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={featuredImage?.node?.sourceUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />

      {isDesktop ? (
        <HomepageDestopHeader
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
            {currentFeatureWell && (
              <Container>
                <FeatureWell featureWells={featureWell} />
              </Container>
            )}
          </div>

          <div className="mx-auto max-w-[calc(1400px+2rem)] px-4">
            <Suspense fallback={<div>Loading section...</div>}>
              <FrontPageLayout />
            </Suspense>
          </div>

          <div className="component-videos w-full" style={{ backgroundColor: '#008080' }}>
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

Component.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
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
        desktopSlide1 { mediaItemUrl }
        desktopSlide2 { mediaItemUrl }
        desktopSlide3 { mediaItemUrl }
        mobileSlide1 { mediaItemUrl }
        mobileSlide2 { mediaItemUrl }
        mobileSlide3 { mediaItemUrl }
        video1 { mediaItemUrl }
        video2 { mediaItemUrl }
        video3 { mediaItemUrl }
        slideCaption1
        slideCaption2
        slideCaption3
        slideStandFirst1
        slideStandFirst2
        slideStandFirst3
        slideCategory1
        slideCategory2
        slideCategory3
        slideCategoryLink1
        slideCategoryLink2
        slideCategoryLink3
        slideLink1
        slideLink2
        slideLink3
        typeSlide1
        typeSlide2
        typeSlide3
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Component.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
})
