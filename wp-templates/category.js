'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import useSWR from 'swr'
import { gql } from '@apollo/client'
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
import { useSWRGraphQL } from '../lib/useSWRGraphQL'

const fetcher = async (query, variables = {}) => {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error('Network error')
  }

  const json = await res.json()

  if (json.errors) {
    console.error(json.errors)
    throw new Error('GraphQL error')
  }

  return json.data
}

export default function Category({ data: initialData, loading }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavShown, setIsNavShown] = useState(false)
  const [isGuidesNavShown, setIsGuidesNavShown] = useState(false)

  const [viewport, setViewport] = useState({ isDesktop: false })

  useEffect(() => {
    const onResize = () => {
      setViewport({ isDesktop: window.innerWidth >= 1024 })
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isDesktop = viewport.isDesktop
  const isMobile = !viewport.isDesktop

  useEffect(() => {
    const className = 'no-scroll'
    if (searchQuery || isNavShown || isGuidesNavShown) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }

    return () => document.body.classList.remove(className)
  }, [searchQuery, isNavShown, isGuidesNavShown])

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

  const { data: menusData } = useSWRGraphQL(
    ['menus', MENUS.PRIMARY_LOCATION],
    GetMenus,
    {
      first: 10,
      headerLocation: MENUS.PRIMARY_LOCATION,
      secondHeaderLocation: MENUS.SECONDARY_LOCATION,
      thirdHeaderLocation: MENUS.THIRD_LOCATION,
      fourthHeaderLocation: MENUS.FOURTH_LOCATION,
      fifthHeaderLocation: MENUS.FIFTH_LOCATION,
    },
  )

  const isMenuReady = menusData?.headerMenuItems?.nodes?.length > 0

  const { data: latestStories } = useSWR('latest-stories', () =>
    fetcher(GetLatestStories, { first: 5 }),
  )

  const { data: dataSecondaryHeader } = useSWR(
    databaseId ? `secondary-header-${databaseId}` : null,
    () => fetcher(GetSecondaryHeader, { id: databaseId }),
  )

  const isGuidesCategory =
    dataSecondaryHeader?.category?.destinationGuides?.destinationGuides ===
    'yes'

  const latestPosts = useMemo(() => {
    const posts = [
      ...(latestStories?.posts?.edges || []),
      ...(latestStories?.updates?.edges || []),
    ]
    return posts
      .map((e) => e.node)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [latestStories])

  const categorySlider = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((i) => [
        categoryImages?.[`categorySlide${i}`]?.mediaItemUrl || null,
        categoryImages?.[`categorySlideCaption${i}`] || null,
      ]),
    [categoryImages],
  )

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

  const renderAdComponent = useCallback(
    (pos) => {
      const map = {
        top: {
          desktop: MastHeadTop,
          mobile: MastHeadTopMobile,
          guidesDesktop: MastHeadTopGuides,
          guidesMobile: MastHeadTopMobileGuides,
        },
        bottom: {
          desktop: MastHeadBottom,
          mobile: MastHeadBottomMobile,
          guidesDesktop: MastHeadBottomGuides,
          guidesMobile: MastHeadBottomMobileGuides,
        },
      }

      const key = isGuidesCategory
        ? isMobile
          ? 'guidesMobile'
          : 'guidesDesktop'
        : isMobile
        ? 'mobile'
        : 'desktop'

      const Ad = map[pos]?.[key]
      return Ad ? <Ad /> : null
    },
    [isMobile, isGuidesCategory],
  )

  if (loading) return <>Loading...</>

  return (
    <>
      <SEO
        title={category?.seo?.title || name}
        description={category?.seo?.metaDesc || description}
        imageUrl={category?.categoryImages?.categoryImages?.mediaItemUrl}
        url={category?.uri}
        focuskw={category?.seo?.focuskw}
      />

      <main className={`${open_sans.variable}`}>
        {isMenuReady &&
          (isDesktop ? (
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
          ))}

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
