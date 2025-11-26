import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import * as MENUS from '../constants/menus'
import { BlogInfoFragment } from '../fragments/GeneralSettings'

// Components
import FeaturedImage from '../components/FeaturedImage/FeaturedImage'
import Main from '../components/Main/Main'
import Footer from '../components/Footer/Footer'
import CategoryDesktopHeader from '../components/CategoryDesktopHeader/CategoryDesktopHeader'

import CategoryHeader from '../components/CategoryHeader/CategoryHeader'
import SecondaryHeader from '../components/Header/SecondaryHeader/SecondaryHeader'
import CategoryEntryHeader from '../components/CategoryEntryHeader/CategoryEntryHeader'
import CategoryStoriesLatest from '../components/CategoryStoriesLatest/CategoryStoriesLatest'
import GuideFitur from '../components/GuideFitur/GuideFitur'
import CategorySecondStoriesLatest from '../components/CategorySecondStoriesLatest/CategorySecondStoriesLatest'
import GuideReelIg from '../components/GuideReelIg/GuideReelIg'
import Tagline from '../components/Tagline/Tagline'
import CategoryStories from '../components/CategoryStories/CategoryStories'
import BannerPosterGuide from '../components/BannerPosterGuide/BannerPosterGuide'
import { open_sans } from '../styles/fonts/fonts'
import SEO from '../components/SEO/SEO'
import FloatingButtons from '../components/FloatingButtons/FloatingButtons'

// Ads
import MastHeadTop from '../components/AdUnit/MastHeadTop/MastHeadTop'
import MastHeadTopMobile from '../components/AdUnit/MastHeadTopMobile/MastHeadTopMobile'
import MastHeadBottom from '../components/AdUnit/MastHeadBottom/MastHeadBottom'
import MastHeadBottomMobile from '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobile'
import MastHeadTopGuides from '../components/AdUnit/MastHeadTop/MastHeadTopGuides'
import MastHeadTopMobileGuides from '../components/AdUnit/MastHeadTopMobile/MastHeadTopMobileGuides'
import MastHeadBottomGuides from '../components/AdUnit/MastHeadBottom/MastHeadBottomGuides'
import MastHeadBottomMobileGuides from '../components/AdUnit/MastHeadBottomMobile/MastHeadBottomMobileGuides'

// Queries
import { GetMenus } from '../queries/GetMenus'
import { GetLatestStories } from '../queries/GetLatestStories'
import { GetSecondaryHeader } from '../queries/GetSecondaryHeader'

export default function Category({ loading, data: initialData }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      setIsMobile(width <= 768)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    handleResize() // run on mount
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Lock body scroll when search or nav is open
  useEffect(() => {
    document.body.style.overflow =
      searchQuery || isNavShown || isGuidesNavShown ? 'hidden' : 'visible'
  }, [searchQuery, isNavShown, isGuidesNavShown])

  const { generalSettings, category } = initialData || {}
  const {
    name,
    description,
    children,
    parent,
    pinPosts,
    categoryImages,
    destinationGuides,
    databaseId,
    guideStorie,
    guideReelIg,
    guidesfitur,
    tagline,
  } = category || {}

  // Menus query
  const { data: menusData } = useQuery(GetMenus, {
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

  // Latest stories query
  const { data: latestStories } = useQuery(GetLatestStories, {
    variables: { first: 5 },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  // Secondary header query
  const { data: dataSecondaryHeader } = useQuery(GetSecondaryHeader, {
    variables: { id: databaseId },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })

  const isGuidesCategory =
    dataSecondaryHeader?.category?.destinationGuides?.destinationGuides ===
    'yes'

  // Merge latest stories + updates, sorted by date
  const latestPosts = useMemo(() => {
    const posts = [
      ...(latestStories?.posts?.edges || []),
      ...(latestStories?.updates?.edges || []),
    ]
    return posts
      .map((e) => e.node)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  // Prepare category slider images and captions
  const categorySlider = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((i) => [
        categoryImages?.[`categorySlide${i}`]?.mediaItemUrl || null,
        categoryImages?.[`categorySlideCaption${i}`] || null,
      ]),
    [categoryImages],
  )

  // Shared header props for multiple components
  const sharedHeaderProps = useMemo(
    () => ({
      title: generalSettings?.title,
      description: generalSettings?.description,
      primaryMenuItems: menusData?.headerMenuItems?.nodes ?? [],
      secondaryMenuItems: menusData?.secondHeaderMenuItems?.nodes ?? [],
      thirdMenuItems: menusData?.thirdHeaderMenuItems?.nodes ?? [],
      fourthMenuItems: menusData?.fourthHeaderMenuItems?.nodes ?? [],
      fifthMenuItems: menusData?.fifthHeaderMenuItems?.nodes ?? [],
      featureMenuItems: menusData?.featureHeaderMenuItems?.nodes ?? [],
      latestStories: latestPosts,
      searchQuery,
      setSearchQuery,
      isNavShown,
      setIsNavShown,
      isScrolled,
      isGuidesCategory,
    }),
    [
      menusData,
      latestPosts,
      searchQuery,
      isNavShown,
      isScrolled,
      isGuidesCategory,
    ],
  )

  // Helper to render ad component depending on category and device type
  const renderAdComponent = useCallback(
    (pos) => {
      const position = pos === 'top' ? 'Top' : 'Bottom'
      const key = `${isGuidesCategory ? 'Guides' : ''}${
        isMobile ? 'Mobile' : 'Desktop'
      }`

      const componentMap = {
        Top: {
          Desktop: MastHeadTop,
          Mobile: MastHeadTopMobile,
          GuidesDesktop: MastHeadTopGuides,
          GuidesMobile: MastHeadTopMobileGuides,
        },
        Bottom: {
          Desktop: MastHeadBottom,
          Mobile: MastHeadBottomMobile,
          GuidesDesktop: MastHeadBottomGuides,
          GuidesMobile: MastHeadBottomMobileGuides,
        },
      }

      const Component = componentMap[position][key]
      return Component ? <Component /> : null
    },
    [isMobile, isGuidesCategory],
  )

  if (loading) return <>Loading...</>

  return (
    <>
      <SEO
        title={category?.seo?.title || category?.name}
        description={category?.seo?.metaDesc || category?.description}
        imageUrl={category?.categoryImages?.categoryImages?.mediaItemUrl}
        url={category?.uri}
        focuskw={category?.seo?.focuskw}
      />

      <main className={`${open_sans.variable}`}>
        {isDesktop ? (
          <CategoryDesktopHeader
            {...sharedHeaderProps}
            isGuidesNavShown={isGuidesNavShown}
            setIsGuidesNavShown={setIsGuidesNavShown}
          />
        ) : (
          <>
            <CategoryHeader {...sharedHeaderProps} />
            <SecondaryHeader
              {...sharedHeaderProps}
              isGuidesNavShown={isGuidesNavShown}
              setIsGuidesNavShown={setIsGuidesNavShown}
            />
          </>
        )}

        <CategoryEntryHeader
          parent={parent?.node?.name}
          children={children?.edges}
          title={name}
          destinationGuides={destinationGuides?.destinationGuides}
          changeToSlider={categoryImages?.changeToSlider}
          guidesTitle={destinationGuides?.guidesTitle}
          categorySlider={categorySlider}
          image={categoryImages?.categoryImages?.mediaItemUrl}
          imageCaption={categoryImages?.categoryImagesCaption}
          description={description}
        />

        <Main style={{ position: 'relative', zIndex: 1 }}>
          {tagline && <Tagline tagline={tagline} />}

          {isGuidesCategory && (
            <hr
              style={{
                border: 'none',
                borderTop: '1px solid black',
                margin: '2rem auto',
                maxWidth: '1400px',
              }}
            />
          )}

          {renderAdComponent('top')}

          <hr
            style={{
              border: 'none',
              borderTop: '1px solid black',
              padding: '0 0 2rem',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          />

          <CategoryStoriesLatest
            categoryUri={databaseId}
            pinPosts={pinPosts}
            name={name}
            children={children}
            parent={parent?.node?.name}
            guideStories={guideStorie}
          />

          {isGuidesCategory && guidesfitur && (
            <GuideFitur guidesfitur={guidesfitur} />
          )}

          <CategorySecondStoriesLatest
            categoryUri={databaseId}
            pinPosts={pinPosts}
            name={name}
            children={children}
            parent={parent?.node?.name}
            bannerDa={guideStorie}
            guideStories={guideStorie}
          />

          {guideReelIg && <GuideReelIg guideReelIg={guideReelIg} />}

          <CategoryStories
            categoryUri={databaseId}
            pinPosts={{
              pinPost: pinPosts?.pinPost,
              secondPinPost: pinPosts?.secondPinPost,
            }}
            name={name}
            children={children}
            parent={parent?.node?.name}
          />

          <BannerPosterGuide guideStorie={guideStorie} />

          <hr
            style={{
              border: 'none',
              borderTop: '1px solid black',
              margin: '2rem auto',
              maxWidth: '1400px',
            }}
          />

          {renderAdComponent('bottom')}
        </Main>

        <Footer />
      </main>

      {category?.buttontopup && (
        <FloatingButtons buttonTopUp={category.buttontopup} />
      )}
    </>
  )
}

Category.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetCategoryPage($databaseId: ID!) {
    category(id: $databaseId, idType: DATABASE_ID) {
      id
      name
      description
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
      destinationGuides {
        destinationGuides
        guidesTitle
      }
      guidesfitur {
        linkUrlGuideFitur1
        linkUrlGuideFitur2
        linkUrlGuideFitur3
        linkUrlGuideFitur4
        titleGuideFitur1
        titleGuideFitur2
        titleGuideFitur3
        titleGuideFitur4
        featureImageGuideFitur1 {
          mediaItemUrl
        }
        featureImageGuideFitur2 {
          mediaItemUrl
        }
        featureImageGuideFitur3 {
          mediaItemUrl
        }
        featureImageGuideFitur4 {
          mediaItemUrl
        }
      }
      guideReelIg {
        titleReelIg
        contentReelIg
        reelGuideIg1
        reelGuideIg2
        videoReelIg1
        bannerReelIg2 {
          mediaItemUrl
        }
        linkUrlBannerReelIg2
      }
      buttontopup {
        buttonPopUp1
        buttonPopUp2
        linkButtonPopUp1
        linkButtonPopUp2
        logoButtonPopUp
      }
      tagline {
        tagline
      }
      guideStorie {
        bannerFokusHubDa {
          mediaItemUrl
        }
        bannerGuideStories {
          mediaItemUrl
        }
        fieldGroupName
        linkBannerFokusHubDa
        linkBannerGuideStories
        linkBannerLandscape
        bannerLandscape {
          mediaItemUrl
        }
      }
      pinPosts {
        pinPost {
          ... on Post {
            id
            title
            uri
            excerpt
            ...FeaturedImageFragment
            author {
              node {
                id
                name
              }
            }
            categories(first: 100, where: { childless: true }) {
              edges {
                node {
                  id
                  name
                  uri
                  parent {
                    id
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
          ... on TravelGuide {
            id
            title
            uri
            excerpt
            guide_book_now {
              guideLocation
              guideName
              guidePrice
              linkBookNow
              linkLocation
            }
            ...FeaturedImageFragment
            author {
              node {
                id
                name
              }
            }
            categories(first: 100, where: { childless: true }) {
              edges {
                node {
                  id
                  name
                  uri
                  parent {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
        secondPinPost {
          ... on Post {
            id
            title
            uri
            excerpt
            ...FeaturedImageFragment
            author {
              node {
                id
                name
              }
            }
            categories(first: 100, where: { childless: true }) {
              edges {
                node {
                  id
                  name
                  uri
                  parent {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
          ... on TravelGuide {
            id
            title
            uri
            excerpt
            guide_book_now {
              guideLocation
              guideName
              guidePrice
              linkBookNow
              linkLocation
            }
            ...FeaturedImageFragment
            author {
              node {
                id
                name
              }
            }
            categories(first: 100, where: { childless: true }) {
              edges {
                node {
                  id
                  name
                  uri
                  parent {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
      parent {
        node {
          id
          name
          uri
          children(first: 100, where: { childless: true }) {
            edges {
              node {
                id
                name
                uri
              }
            }
          }
          countryCode {
            countryCode
          }
          destinationGuides {
            destinationGuides
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
    generalSettings {
      ...BlogInfoFragment
    }
  }
`

Category.variables = ({ databaseId }) => ({ databaseId })
